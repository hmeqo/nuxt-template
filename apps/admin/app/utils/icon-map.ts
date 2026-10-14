import type { Component } from 'vue'
import {
  Circle,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
} from '@lucide/vue'

const CONSOLE_ICONS: Record<string, Component> = {
  dashboard: LayoutDashboard,
  overview: Gauge,
  users: Users,
  user: UserRound,
  files: FolderOpen,
  upload: Upload,
  settings: Settings,
  security: ShieldCheck,
}

/** 把 app.config 里的图标名（可序列化）解析成组件 */
export function consoleIcon(name?: string): Component {
  return (name && CONSOLE_ICONS[name]) || Circle
}
