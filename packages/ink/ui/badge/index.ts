import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'h-5 w-fit gap-1.25 rounded-full border border-transparent px-2 text-[11.5px] font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/18 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-ink-1 text-ink-inverse [a]:hover:bg-ink-1/88',
        secondary: 'border-line-1 bg-raised text-ink-2 [a]:hover:text-ink-1',
        outline: 'border-line-2 text-ink-2 [a]:hover:text-ink-1',
        destructive: 'bg-bad-soft text-bad',
        success: 'bg-ok-soft text-ok',
        warn: 'bg-warn-soft text-warn',
        bad: 'bg-bad-soft text-bad',
        brand: 'bg-brand-soft text-brand',
        ghost: 'text-ink-2 hover:bg-hover hover:text-ink-1',
        link: 'text-brand underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
