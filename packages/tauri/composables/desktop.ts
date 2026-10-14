/** 桌面端提示的通知器：宿主启动时注册一次（通常是 toast），包本身不依赖宿主 UI。 */
type DesktopNotifier = (message: { title: string; description: string }) => void

let notifier: DesktopNotifier | undefined

export function setDesktopNotifier(fn: DesktopNotifier) {
  notifier = fn
}

/** 只有桌面壳里才有的能力：浏览器里提示一次并返回 false，调用点写 `if (!requireDesktop()) return` */
export function requireDesktop(): boolean {
  if (isTauri) return true

  notifier?.({
    title: '仅桌面端可用',
    description: '文件读写走 Tauri 命令，浏览器里没有这个能力。',
  })

  return false
}
