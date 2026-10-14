import type { FileResp } from '@ws/apisdk/types'

export interface DailyBin {
  /** 本地日期键 `YYYY-M-D`，仅用于分箱 */
  key: string
  /** 轴标签，形如 `9/28` */
  label: string
  value: number
}

export interface TypeBreakdown {
  label: string
  value: number
  /** 该类型的体积合计（字节） */
  bytes: number
  /** 占比，形如 `32%` */
  hint: string
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

/** 最近 `days` 天的日键 + 轴标签，末位是今天；`dailyBins` / `dailyStateBins` 共用 */
function windowDays(days: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1) + i)
    return { key: dayKey(date), label: `${date.getMonth() + 1}/${date.getDate()}` }
  })
}

/**
 *
 * 落在窗口外或无法解析的时间戳直接丢掉；没有数据的那天保留 0，柱图才知道桶的完整跨度。
 */
export function dailyBins(dates: readonly (string | Date | null | undefined)[], days = 14): DailyBin[] {
  const bins: DailyBin[] = windowDays(days).map((day) => ({ ...day, value: 0 }))

  const index = new Map(bins.map((bin, i) => [bin.key, i]))
  for (const raw of dates) {
    if (!raw) continue
    const date = raw instanceof Date ? raw : new Date(raw)
    if (Number.isNaN(date.getTime())) continue
    const at = index.get(dayKey(date))
    if (at !== undefined) bins[at]!.value++
  }

  return bins
}

export interface DailyStateBin {
  label: string
  attached: number
  draft: number
}

/**
 * 只有 `state === 'attached'` 算已附加，其余（含未来可能出现的新状态）都归草稿。
 */
export function dailyStateBins(records: readonly FileResp[], days = 14): DailyStateBin[] {
  const window = windowDays(days)
  const bins: DailyStateBin[] = window.map((day) => ({ label: day.label, attached: 0, draft: 0 }))
  const index = new Map(window.map((day, i) => [day.key, i]))

  for (const record of records) {
    const date = new Date(record.created_at)
    if (Number.isNaN(date.getTime())) continue
    const at = index.get(dayKey(date))
    if (at === undefined) continue
    if (record.state === 'attached') bins[at]!.attached++
    else bins[at]!.draft++
  }

  return bins
}

/** 按扩展名（拿不到就用 MIME 子类型）聚合文件记录，多的排前面 */
export function fileTypeBreakdown(records: readonly FileResp[]): TypeBreakdown[] {
  const groups = new Map<string, { count: number; bytes: number }>()
  for (const record of records) {
    const dot = record.original_name.lastIndexOf('.')
    const ext = dot > 0 ? record.original_name.slice(dot + 1) : ''
    const label = (ext || record.mime_type.split('/')[1] || '未知').toUpperCase()
    const group = groups.get(label) ?? { count: 0, bytes: 0 }
    group.count++
    group.bytes += record.size
    groups.set(label, group)
  }

  return [...groups]
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .map(([label, { count, bytes }]) => ({
      label,
      value: count,
      bytes,
      hint: `${Math.round((count / records.length) * 100)}%`,
    }))
}

/** 长尾并组那条的 label；配色时要把这条排除在分类色档位之外（它走 `--series-other`） */
export const OTHER_LABEL = '其他'

/**
 * 把长尾分类并成一条「其他」：前 `limit` 类（调用方已按条数降序）保留，其余合并。
 * 分类色盘只有 10 档，而且 Atlassian/Cloudscape 都建议一张图里别超过 5–6 个分类色；
 * 「其他」走 `--series-other`（不占分类色档位），条数/体积求和、占比按合并后的条数重算。
 */
export function rollupFileTypes(items: readonly TypeBreakdown[], limit = 5): TypeBreakdown[] {
  if (items.length <= limit) return [...items]

  const tail = items.slice(limit)
  const count = tail.reduce((sum, item) => sum + item.value, 0)
  const bytes = tail.reduce((sum, item) => sum + item.bytes, 0)
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return [
    ...items.slice(0, limit),
    { label: OTHER_LABEL, value: count, bytes, hint: `${Math.round((count / total) * 100)}%` },
  ]
}
