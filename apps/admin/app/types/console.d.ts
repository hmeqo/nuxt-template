export interface ConsoleNavItem {
  label: string
  to: string
  /** consoleIcon() 的图标名 */
  icon?: string
}

export interface ConsoleNavGroup {
  label?: string
  items: ConsoleNavItem[]
}

export interface ConsoleConfig {
  /** 侧栏与登录页展示的产品名 */
  name?: string
  nav?: ConsoleNavGroup[]
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    console?: ConsoleConfig
  }
}
