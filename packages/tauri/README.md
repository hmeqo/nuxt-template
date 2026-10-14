# @ws/tauri

Tauri 桌面壳的平台胶水层：窗口控制、拖拽区、IPC 包装，以及 `src-tauri` 生成的类型化命令绑定。
界面骨架（菜单栏 / 标签条 / 停靠面板 / 状态栏）在宿主应用里，见 `apps/main/app/components/desktop`。

## 用法

`nuxt.config.ts` 注册模块，组件与组合式函数即自动导入：

```ts
modules: ['@ws/tauri']
```

| 导出                     | 说明                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `<TauriWindowControls>`  | 最小化 / 最大化 / 关闭；浏览器里不渲染                                                         |
| `<TauriDragRegion>`      | 顶栏拖拽区；双击最大化由 Tauri 内建 `drag.js` 负责，别再自己挂 `dblclick`                      |
| `isTauri`                | 是否跑在桌面壳里                                                                               |
| `useWindowControls()`    | `isMaximized` + `minimize` / `toggleMaximize` / `close` / `setTitle`；浏览器里全是 no-op       |
| `useDragDrop(handler)`   | 文件拖进窗口时回调路径                                                                         |
| `requireDesktop()`       | 只有桌面端才有的能力：浏览器里提示一次并返回 `false`，调用点写 `if (!requireDesktop()) return` |
| `setDesktopNotifier(fn)` | 注册提示函数（通常是宿主的 toast），启动时调一次                                               |
| `ipc(run)`               | 拆 tauri-specta 的 `Result`：成功取 `data`，失败抛 `Error(error.message)`                      |

命令绑定由 Rust 生成，前端显式导入：

```ts
import { commands } from '@ws/tauri/lib/binding'

const info = await commands.appInfo()
const doc = await ipc(() => commands.openDocument())
```

## 加一个命令

1. 在 `src-tauri/src/commands.rs` 写 `#[tauri::command] #[specta::specta]`；会失败的返回 `Result<T, IpcError>`，不能失败的直接返回 `T`（前端就别套 `ipc()`）。
2. 注册进 `src-tauri/src/lib.rs` 的 `collect_commands![…]`。
3. 跑一次 debug 应用（`cargo run` 或 `pnpm exec tauri dev`），`lib/binding.ts` 会被重写。
