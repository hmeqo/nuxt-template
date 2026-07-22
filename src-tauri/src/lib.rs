#[cfg(debug_assertions)]
use specta_typescript::Typescript;
use std::sync::Arc;
use tauri_specta::collect_commands;

struct AppState {
    http_url: Arc<String>,
}

impl AppState {
    pub fn new() -> Self {
        let http_url =
            tauri::async_runtime::block_on(async { Arc::new("http://localhost:8000".into()) });
        Self { http_url }
    }
}

#[tauri::command]
#[specta::specta]
async fn http_url(state: tauri::State<'_, AppState>) -> Result<String, String> {
    Ok(state.http_url.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new().commands(collect_commands![http_url]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../packages/tauri/lib/binding.ts")
        .expect("Failed to export TypeScript bindings");

    tauri::Builder::default()
        .manage(AppState::new())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
