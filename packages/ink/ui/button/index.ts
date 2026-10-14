import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

// 图标尺寸归按钮管：`[&_svg:not([class*=size-])]` 让 default/icon 里的 svg = 16px、sm = 14px、xs = 12px。
// 在按钮里的图标上写 size-* 会顶掉这条规则，同一个「新建用户」就会在不同页面一个 14 一个 16——别写。
export const buttonVariants = cva(
  'focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/18 aria-invalid:border-bad aria-invalid:ring-[3px] aria-invalid:ring-bad/20 rounded-lg border border-transparent bg-clip-padding text-[13px] font-medium gap-1.5 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*=size-])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-ink-1 text-ink-inverse [a]:hover:bg-ink-1/88',
        outline: 'border-line-2 bg-raised text-ink-1 hover:border-line-3 aria-expanded:border-line-3',
        secondary: 'border-line-1 bg-raised text-ink-1 hover:border-line-2 hover:bg-hover',
        ghost: 'text-ink-2 hover:bg-hover hover:text-ink-1 aria-expanded:bg-hover aria-expanded:text-ink-1',
        destructive: 'border-bad/30 bg-bad-soft text-bad hover:bg-bad-soft/80',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[30px] gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: 'h-6 gap-1 rounded-lg px-2 text-[12px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*=size-])]:size-3',
        sm: 'h-[26px] gap-1.5 rounded-lg px-2.5 text-[12.5px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*=size-])]:size-3.5',
        lg: 'h-[34px] gap-1.5 rounded-lg px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        icon: 'size-[30px] p-0',
        'icon-xs': 'size-6 p-0 [&_svg:not([class*=size-])]:size-3',
        'icon-sm': 'size-[26px] p-0',
        'icon-lg': 'size-[34px] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
