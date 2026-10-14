/**
 * 分类图表的色盘：`--series-1..10` + `--series-other`，独立策展，不由品牌色推导。
 * 单序列/双序列用 `--series-1/2` 就够，不走这里。
 * 顺序是设计的一部分（按「任意前缀都尽量可分」解出来的），别重排——重排会把近色挪进前几档。
 * 一张图别超过 5–6 档，长尾并进 `--series-other`。明暗各一套步值，强调色预设只调**顺序**。
 */

const SERIES_COUNT = 10

export const OTHER_COLOR = 'var(--series-other)'

/** 第 `index` 个分类的色（超出十档就循环） */
export function seriesColor(index: number): string {
  const step = ((index % SERIES_COUNT) + SERIES_COUNT) % SERIES_COUNT
  return `var(--series-${step + 1})`
}

/**
 * 按权重分配稳定色：权重降序、同权重按 key 升序。
 * 颜色由排名决定而不是数组顺序，所以同一分类在页面上各图里始终同色。
 */
export function buildColorLookup(items: readonly { key: string; weight: number }[]): Map<string, string> {
  const ranked = [...items].sort((a, b) => b.weight - a.weight || a.key.localeCompare(b.key))
  return new Map(ranked.map((item, index) => [item.key, seriesColor(index)]))
}
