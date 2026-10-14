use std::{
    fs,
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

use crate::error::IpcError;

/// 一次读入内存的上限：文本模型挡不住大文件，超过就拒绝，避免把窗口卡死。
const MAX_DOCUMENT_BYTES: u64 = 8 * 1024 * 1024;
const MAX_RECENT: usize = 12;

#[derive(Debug, Clone, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
#[specta(rename_all = "camelCase")]
pub struct Document {
    pub path: String,
    pub name: String,
    pub text: String,
    /// 字节数（读取上限 8 MB，u32 足够且避开 specta 的 BigInt 导出限制）
    pub size: u32,
    pub modified_ms: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
#[specta(rename_all = "camelCase")]
pub struct RecentDocument {
    pub path: String,
    pub name: String,
    /// `alias` 兼容早期写下的 snake_case 存档，避免升级后把最近列表读空
    #[serde(alias = "opened_ms")]
    pub opened_ms: f64,
}

pub fn open(app: &AppHandle, path: &Path) -> Result<Document, IpcError> {
    let document = read(path)?;
    remember(app, &document);
    Ok(document)
}

/// 写盘后同样记进最近列表，「另存为」的新文件才会出现在侧栏。
pub fn save(app: &AppHandle, path: &Path, text: &str) -> Result<Document, IpcError> {
    let document = write(path, text)?;
    remember(app, &document);
    Ok(document)
}

fn read(path: &Path) -> Result<Document, IpcError> {
    let meta = fs::metadata(path)?;
    if !meta.is_file() {
        return Err(IpcError::new(format!("不是文件：{}", path.display())));
    }
    if meta.len() > MAX_DOCUMENT_BYTES {
        return Err(IpcError::new(format!(
            "文件超过 {} MB 上限",
            MAX_DOCUMENT_BYTES / 1024 / 1024
        )));
    }
    let text = fs::read_to_string(path)
        .map_err(|err| IpcError::new(format!("{} 不是 UTF-8 文本：{err}", path.display())))?;
    Ok(Document {
        path: path.to_string_lossy().into_owned(),
        name: file_name(path),
        text,
        size: meta.len() as u32,
        modified_ms: meta.modified().ok().and_then(to_ms),
    })
}

fn write(path: &Path, text: &str) -> Result<Document, IpcError> {
    fs::write(path, text)?;
    read(path)
}

pub fn recents(app: &AppHandle) -> Vec<RecentDocument> {
    recents_path(app)
        .map(|path| load_recents(&path))
        .unwrap_or_default()
}

pub fn clear_recents(app: &AppHandle) -> Result<(), IpcError> {
    let path = recents_path(app)?;
    if path.exists() {
        fs::remove_file(path)?;
    }
    Ok(())
}

fn remember(app: &AppHandle, document: &Document) {
    let Ok(path) = recents_path(app) else {
        return;
    };

    let mut list = load_recents(&path);
    merge_recent(&mut list, document, now_ms());
    store_recents(&path, &list);
}

/// 存档坏了（手改过、写了一半）就当没有，别让侧栏整个打不开。
fn load_recents(path: &Path) -> Vec<RecentDocument> {
    fs::read_to_string(path)
        .ok()
        .and_then(|raw| serde_json::from_str(&raw).ok())
        .unwrap_or_default()
}

/// 写失败不影响本次打开，静默丢弃。
fn store_recents(path: &Path, list: &[RecentDocument]) {
    if let Ok(raw) = serde_json::to_string(list) {
        let _ = fs::write(path, raw);
    }
}

fn merge_recent(list: &mut Vec<RecentDocument>, document: &Document, opened_ms: f64) {
    list.retain(|item| item.path != document.path);
    list.insert(
        0,
        RecentDocument {
            path: document.path.clone(),
            name: document.name.clone(),
            opened_ms,
        },
    );
    list.truncate(MAX_RECENT);
}

fn recents_path(app: &AppHandle) -> Result<PathBuf, IpcError> {
    let dir = app
        .path()
        .app_config_dir()
        .map_err(|err| IpcError::new(err.to_string()))?;
    fs::create_dir_all(&dir)?;
    Ok(dir.join("recent.json"))
}

fn file_name(path: &Path) -> String {
    path.file_name()
        .map(|name| name.to_string_lossy().into_owned())
        .unwrap_or_else(|| path.to_string_lossy().into_owned())
}

fn to_ms(time: SystemTime) -> Option<f64> {
    time.duration_since(UNIX_EPOCH)
        .ok()
        .map(|elapsed| elapsed.as_millis() as f64)
}

fn now_ms() -> f64 {
    to_ms(SystemTime::now()).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 每个用例独占一个文件名；`process::id` 让并发跑测试时互不踩踏。
    fn temp_path(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("app-documents-{}", std::process::id()));
        fs::create_dir_all(&dir).expect("create temp dir");
        dir.join(name)
    }

    fn document(path: &str) -> Document {
        Document {
            path: path.into(),
            name: file_name(Path::new(path)),
            text: String::new(),
            size: 0,
            modified_ms: None,
        }
    }

    #[test]
    fn writes_then_reads_back() {
        let path = temp_path("round-trip.md");
        let document = write(&path, "# 标题\n正文\n").expect("write");

        assert_eq!(document.text, "# 标题\n正文\n");
        assert_eq!(document.name, "round-trip.md");
        assert_eq!(document.size, document.text.len() as u32);
        assert_eq!(read(&path).expect("read").text, document.text);
    }

    #[test]
    fn rejects_non_utf8() {
        let path = temp_path("binary.bin");
        fs::write(&path, [0xff, 0xfe, 0x00]).expect("write bytes");

        let error = read(&path).expect_err("must reject");
        assert!(error.message.contains("UTF-8"), "{}", error.message);
    }

    #[test]
    fn rejects_missing_files_and_directories() {
        let missing = temp_path("missing.md");
        let _ = fs::remove_file(&missing);

        assert!(read(&missing).is_err());
        assert!(read(&std::env::temp_dir()).is_err());
    }

    #[test]
    fn recents_keep_newest_first_without_duplicates() {
        let mut list = vec![];

        merge_recent(&mut list, &document("/tmp/a.md"), 1.0);
        merge_recent(&mut list, &document("/tmp/b.md"), 2.0);
        merge_recent(&mut list, &document("/tmp/a.md"), 3.0);

        let paths: Vec<&str> = list.iter().map(|item| item.path.as_str()).collect();
        assert_eq!(paths, ["/tmp/a.md", "/tmp/b.md"]);
        assert_eq!(list[0].opened_ms, 3.0);
    }

    #[test]
    fn recents_round_trip_through_the_store() {
        let path = temp_path("recent.json");
        let list = vec![RecentDocument {
            path: "/tmp/a.md".into(),
            name: "a.md".into(),
            opened_ms: 7.0,
        }];

        store_recents(&path, &list);

        let raw = fs::read_to_string(&path).expect("store writes the file");
        assert!(
            raw.contains("\"openedMs\""),
            "存档键必须是 camelCase：{raw}"
        );
        assert_eq!(load_recents(&path)[0].path, "/tmp/a.md");

        fs::write(&path, "not json").expect("corrupt the store");
        assert!(load_recents(&path).is_empty(), "存档损坏时退回空列表");
    }

    #[test]
    fn recents_drop_the_oldest_beyond_capacity() {
        let mut list = vec![];

        for index in 0..MAX_RECENT + 3 {
            merge_recent(
                &mut list,
                &document(&format!("/tmp/{index}.md")),
                index as f64,
            );
        }

        assert_eq!(list.len(), MAX_RECENT);
        assert_eq!(list[0].path, format!("/tmp/{}.md", MAX_RECENT + 2));
        assert!(!list.iter().any(|item| item.path == "/tmp/0.md"));
    }
}
