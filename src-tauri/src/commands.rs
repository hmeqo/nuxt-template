use std::path::Path;

use serde::Serialize;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

use crate::{
    documents::{self, Document, RecentDocument},
    error::IpcError,
};

/// 文件选择器里的文本类型；也是允许打开/保存的类型清单。
const TEXT_EXTENSIONS: &[&str] = &[
    "txt", "md", "json", "jsonc", "toml", "yaml", "yml", "csv", "log", "xml", "sql", "sh", "rs",
    "ts", "vue",
];

#[derive(Debug, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
#[specta(rename_all = "camelCase")]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub identifier: String,
    pub tauri_version: String,
    pub os: String,
    pub arch: String,
}

#[tauri::command]
#[specta::specta]
pub fn app_info(app: AppHandle) -> AppInfo {
    let info = app.package_info();

    AppInfo {
        name: info.name.clone(),
        version: info.version.to_string(),
        identifier: app.config().identifier.clone(),
        tauri_version: tauri::VERSION.to_string(),
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
    }
}

/// 弹系统文件选择器；用户取消返回 `None`。
///
/// `blocking_*` 不能跑在主线程上，这里用 `async fn` 命令（tauri 把它放到异步运行时线程池）来满足。
#[tauri::command]
#[specta::specta]
pub async fn open_document(app: AppHandle) -> Result<Option<Document>, IpcError> {
    let picked = app
        .dialog()
        .file()
        .set_title("打开文件")
        .add_filter("文本", TEXT_EXTENSIONS)
        .blocking_pick_file();

    let Some(file) = picked else {
        return Ok(None);
    };

    let path = file
        .into_path()
        .map_err(|err| IpcError::new(err.to_string()))?;
    documents::open(&app, &path).map(Some)
}

/// 按已知路径打开：最近列表和「拖文件进窗口」都走这里。
#[tauri::command]
#[specta::specta]
pub fn open_path(app: AppHandle, path: String) -> Result<Document, IpcError> {
    documents::open(&app, Path::new(&path))
}

#[tauri::command]
#[specta::specta]
pub fn save_document(app: AppHandle, path: String, text: String) -> Result<Document, IpcError> {
    documents::save(&app, Path::new(&path), &text)
}

/// 无路径的「另存为」；用户取消返回 `None`。
#[tauri::command]
#[specta::specta]
pub async fn save_document_as(
    app: AppHandle,
    text: String,
    suggested_name: Option<String>,
) -> Result<Option<Document>, IpcError> {
    let dialog = app
        .dialog()
        .file()
        .set_title("另存为")
        // 没有建议名也必须给一个：留空的保存框会落到目录里的第一个文件上，一个回车就覆盖别人
        .set_file_name(suggested_name.unwrap_or_else(|| "未命名.txt".to_owned()))
        .add_filter("文本", TEXT_EXTENSIONS);

    let Some(file) = dialog.blocking_save_file() else {
        return Ok(None);
    };

    let path = file
        .into_path()
        .map_err(|err| IpcError::new(err.to_string()))?;
    documents::save(&app, &path, &text).map(Some)
}

#[tauri::command]
#[specta::specta]
pub fn recent_documents(app: AppHandle) -> Vec<RecentDocument> {
    documents::recents(&app)
}

/// 用系统默认程序打开链接（「帮助 → 项目主页」走这里，前端不需要 opener 的 JS 包）。
#[tauri::command]
#[specta::specta]
pub fn open_external(app: AppHandle, url: String) -> Result<(), IpcError> {
    app.opener()
        .open_url(url, None::<&str>)
        .map_err(|err| IpcError::new(err.to_string()))
}

#[tauri::command]
#[specta::specta]
pub fn clear_recents(app: AppHandle) -> Result<(), IpcError> {
    documents::clear_recents(&app)
}

#[tauri::command]
#[specta::specta]
pub fn quit(app: AppHandle) {
    app.exit(0);
}
