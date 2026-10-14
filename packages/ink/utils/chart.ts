/**
 * 把坐标系上限抬到 1/2/2.5/5×10ⁿ 档位，并给出等距刻度（含 0）。
 * 直接拿最大值当上限的话，刻度会变成 0/0.37/0.74 这种没法读的数字。
 */
export function niceScale(max: number, segments = 4): { max: number; ticks: number[] } {
  if (!(max > 0)) return { max: 1, ticks: [0] }
  const rough = max / segments
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? 10 * magnitude
  const top = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let t = 0; t <= top + step / 2; t += step) ticks.push(Number(t.toPrecision(12)))
  return { max: top, ticks }
}
