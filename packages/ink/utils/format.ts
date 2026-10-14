/**
 * 数字格式化：轴刻度、表格、列表里凡是「给机器看的量」都走这里，别各页各写一份。
 */

/** 紧凑写法：1234 → `1.2K`，轴刻度与列表的绝对值列用 */
export function formatCompact(value: number): string {
  return value.toLocaleString(undefined, { notation: 'compact' })
}

/** 日期时间：空值给 `—`，解析不了就给原串；表格列传 `{ seconds: false }`，宽度才齐 */
export function formatDateTime(value?: string | Date | null, options?: { seconds?: boolean }): string {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  if (options?.seconds === false) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return date.toLocaleString('zh-CN')
}

/** 文件体积：`512 B` / `1.5 KB` / `2.4 MB` */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
