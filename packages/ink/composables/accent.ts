export type InkAccent = 'silver' | 'omp'

export interface InkAccentOption {
  value: InkAccent
  label: string
  /** 色板预览的 CSS background */
  swatch: string
}

export const INK_ACCENTS: InkAccentOption[] = [
  { value: 'silver', label: '银色', swatch: 'linear-gradient(100deg, #fafafa, #a1a1aa)' },
  { value: 'omp', label: 'OMP', swatch: 'linear-gradient(100deg, #5ad8e6, #ed4abf)' },
]

/**
 * 强调色偏好：cookie 存（服务端可读，首帧就一致）；
 * 由 `runtime/accent.ts` 插件写进 `html[data-accent]`，预设值定义在 `tailwind.css`。
 */
export const useInkAccent = defineCachedFn(() =>
  useCookie<InkAccent>('accent', {
    default: () => 'silver',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  }),
)
