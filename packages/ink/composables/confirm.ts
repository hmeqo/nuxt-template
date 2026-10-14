import { reactive } from 'vue'

export interface ConfirmAction {
  label: string
  value: string
  /** 默认按钮排最后；destructive 只用于丢失数据的动作 */
  variant?: 'default' | 'outline' | 'destructive'
}

interface ConfirmState {
  open: boolean
  title: string
  description: string
  actions: ConfirmAction[]
  resolve?: (value: string) => void
}

const state = reactive<ConfirmState>({ open: false, title: '', description: '', actions: [] })

export function useConfirmState() {
  return state
}

const DEFAULT_ACTIONS: ConfirmAction[] = [
  { label: '取消', value: 'cancel' },
  { label: '确认', value: 'confirm' },
]

/**
 * 应用内确认框（webview 的原生 `confirm()` 在桌面端不可靠）。
 * 返回被点击动作的 `value`；Esc / 点遮罩 / 关闭视为 `cancel`。
 * 名字避开 DOM 全局 `confirm`：重名时 TS 会解析到 `window.confirm`。
 */
export function askConfirm(options: {
  title: string
  description?: string
  actions?: ConfirmAction[]
}): Promise<string> {
  const { promise, resolve } = Promise.withResolvers<string>()
  Object.assign(state, options, { open: true, actions: options.actions ?? DEFAULT_ACTIONS, resolve })

  return promise
}

export function answerConfirm(value: string) {
  state.open = false
  state.resolve?.(value)
  state.resolve = undefined
}
