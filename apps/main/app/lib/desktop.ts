import type { Component } from 'vue'

/** 快捷键声明：`mod` = Ctrl/⌘，`⇧` = Shift，末段是按键。展示与键盘派发共用同一份。 */
export type Shortcut = string

export type DesktopMenuEntry =
  | { separator: true }
  | {
      id: string
      label: string
      shortcut?: Shortcut
      icon?: Component
      disabled?: boolean
      checked?: boolean
    }

export type DesktopMenuAction = Extract<DesktopMenuEntry, { id: string }>

export interface DesktopMenu {
  label: string
  items: DesktopMenuEntry[]
}

/** 文档标签页：`id` 与文档路径无关，未保存的新建文档也有 id。 */
export interface DesktopTab {
  id: string
  title: string
  dirty?: boolean
  path?: string | null
}

export function isSeparator(entry: DesktopMenuEntry): entry is { separator: true } {
  return 'separator' in entry
}

export function menuActions(menus: DesktopMenu[]): DesktopMenuAction[] {
  return menus.flatMap((menu) => menu.items.filter((entry): entry is DesktopMenuAction => !isSeparator(entry)))
}

const IS_MAC = import.meta.client && /mac/i.test(navigator.userAgent)

/** `mod+⇧S` → `Ctrl+⇧S` / `⌘⇧S`；只负责显示。 */
export function shortcutLabel(shortcut: Shortcut): string {
  return shortcut.replace(/^mod\+/, IS_MAC ? '⌘' : 'Ctrl+')
}

export function shortcutMatches(shortcut: Shortcut, event: KeyboardEvent): boolean {
  const parts = shortcut.split('+')
  const key = parts.at(-1) ?? ''

  if (parts.includes('mod') !== (event.metaKey || event.ctrlKey)) return false
  if (parts.includes('⇧') !== event.shiftKey) return false
  if (event.altKey) return false

  return event.key.toLowerCase() === key.toLowerCase()
}
