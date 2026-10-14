import type { UnlistenFn } from '@tauri-apps/api/event'
import type { Window as TauriWindow } from '@tauri-apps/api/window'

/** 当前窗口：按需动态引入，浏览器里不加载 @tauri-apps/api */
let currentWindow: Promise<TauriWindow | undefined> | undefined

function getWindow(): Promise<TauriWindow | undefined> {
  if (!isTauri) return Promise.resolve(undefined)
  currentWindow ??= import('@tauri-apps/api/window').then(({ getCurrentWindow }) => getCurrentWindow())
  return currentWindow
}

/**
 * 组件在订阅返回前就卸载的情况也要退订干净，别留悬挂监听。
 */
function onWindowEvent(subscribe: (win: TauriWindow) => Promise<UnlistenFn>) {
  let disposed = false
  let unlisten: UnlistenFn | undefined

  onMounted(async () => {
    const win = await getWindow()
    if (!win) return

    const stop = await subscribe(win)
    if (disposed) {
      stop()
      return
    }

    unlisten = stop
  })

  onBeforeUnmount(() => {
    disposed = true
    unlisten?.()
    unlisten = undefined
  })
}

/** 窗口按钮：浏览器里全是 no-op，调用点不必再判断 isTauri。 */
export function useWindowControls() {
  const isMaximized = ref(false)

  // 拖动/缩放会连续触发 resize，去抖后再读一次真实状态
  const syncMaximized = useDebounceFn(async () => {
    const win = await getWindow()
    if (win) isMaximized.value = await win.isMaximized()
  }, 50)

  onWindowEvent(async (win) => {
    const stop = await win.onResized(syncMaximized)
    isMaximized.value = await win.isMaximized()
    return stop
  })

  async function minimize() {
    const win = await getWindow()
    await win?.minimize()
  }

  async function toggleMaximize() {
    const win = await getWindow()
    await win?.toggleMaximize()
  }

  async function close() {
    const win = await getWindow()
    await win?.close()
  }

  async function setTitle(title: string) {
    const win = await getWindow()
    await win?.setTitle(title)
  }

  return { isMaximized, minimize, toggleMaximize, close, setTitle }
}

/** 接收拖进窗口的文件路径：浏览器里是 no-op。 */
export function useDragDrop(handler: (paths: string[]) => void) {
  onWindowEvent((win) =>
    win.onDragDropEvent((event) => {
      if (event.payload.type === 'drop') handler(event.payload.paths)
    }),
  )
}
