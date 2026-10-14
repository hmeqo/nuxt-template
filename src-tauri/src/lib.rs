use tauri::Manager;

mod commands;
mod documents;
mod error;

/// mimalloc 只在发布构建的 Linux / Windows 上换掉系统分配器（macOS 用系统分配器更稳）。
#[cfg(all(not(debug_assertions), not(target_os = "macos")))]
#[global_allocator]
static ALLOC: mimalloc::MiMalloc = mimalloc::MiMalloc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        tauri_specta::Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![
            commands::app_info,
            commands::open_document,
            commands::open_path,
            commands::save_document,
            commands::save_document_as,
            commands::recent_documents,
            commands::open_external,
            commands::clear_recents,
            commands::quit
        ]);

    #[cfg(debug_assertions)]
    builder
        .export(
            specta_typescript::Typescript::default(),
            "../packages/tauri/lib/binding.ts",
        )
        .expect("Failed to export TypeScript bindings");

    tauri::Builder::default()
        // 单实例插件必须最先注册：第二次启动只聚焦已有窗口，不再开一个新进程。
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                        file_name: None,
                    }),
                ])
                .build(),
        )
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
