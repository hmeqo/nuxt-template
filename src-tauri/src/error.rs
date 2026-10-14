use std::fmt;

use serde::Serialize;

/// 命令统一错误：specta 要求 `Serialize` + `Type`，前端拿到 `{ message }` 直接可读。
#[derive(Debug, Serialize, specta::Type)]
pub struct IpcError {
    pub message: String,
}

impl IpcError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl fmt::Display for IpcError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for IpcError {}

impl From<std::io::Error> for IpcError {
    fn from(err: std::io::Error) -> Self {
        Self::new(err.to_string())
    }
}
