<script setup lang="ts">
import { LoaderCircle, Plus, Search } from '@lucide/vue'

/** 状态与边界：专门用来找问题（截断、空值、0/NaN、长列表、窄容器浮层、焦点环、disabled+loading、主题切换） */

const { darkMode } = useThemeMode()
const accent = useInkAccent()

const LONG_TEXT = '这是一个非常非常非常长的文件名称_2026年度第三季度财务汇总与审计报告_最终修订版_v12.pdf'
const UNBREAKABLE = 'averylongunbrokenhashstringwithnospaces0123456789abcdef0123456789abcdef'

interface ManyRow {
  id: number
  name: string
  size: number
}

const manyRows: ManyRow[] = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `文件 ${String(index + 1).padStart(2, '0')}.pdf`,
  size: 1024 * (index + 1) * 7,
}))

const manyColumns: TableColumn<ManyRow>[] = [
  { key: 'id', label: 'ID', width: 'w-16', numeric: true },
  { key: 'name', label: '名称' },
  { key: 'size', label: '大小', width: 'w-32', align: 'end', text: (row) => formatSize(row.size) },
]

const emptyValues = [
  { key: '未设置', value: undefined },
  { key: '空串', value: '' },
  { key: '正常', value: 'ok' },
]

const zeroSegments = [
  { key: 'a', label: 'A', value: 0, color: 'var(--series-1)' },
  { key: 'b', label: 'B', value: 0, color: 'var(--series-2)' },
]

const nan = Number.NaN
const focusRow = ref('')
</script>

<template>
  <div class="space-y-8">
    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">超长文本截断</p>
      <div class="grid gap-3 lg:grid-cols-2">
        <div class="rounded-xl border border-line-1 bg-card p-4">
          <p class="mb-1 text-[12px] text-ink-3">w-48 + truncate（单行省略号）</p>
          <p class="w-48 truncate text-[13px] text-ink-1" data-edge="truncate">{{ LONG_TEXT }}</p>
        </div>
        <div class="rounded-xl border border-line-1 bg-card p-4">
          <p class="mb-1 text-[12px] text-ink-3">w-48 + 无 truncate（应溢出而非撑破）</p>
          <p class="w-48 overflow-hidden text-[13px] whitespace-nowrap text-ink-1" data-edge="overflow">
            {{ LONG_TEXT }}
          </p>
        </div>
        <div class="rounded-xl border border-line-1 bg-card p-4">
          <p class="mb-1 text-[12px] text-ink-3">不可断长串 + wrap-anywhere</p>
          <p class="w-48 text-[13px] text-ink-1 wrap-anywhere">{{ UNBREAKABLE }}</p>
        </div>
        <div class="rounded-xl border border-line-1 bg-card p-4">
          <p class="mb-1 text-[12px] text-ink-3">KeyValue 里的长值</p>
          <InkKeyValue :items="[{ key: '文件', value: LONG_TEXT }]" />
        </div>
      </div>
    </div>

    <div class="grid gap-3 lg:grid-cols-3">
      <div class="rounded-xl border border-line-1 bg-card p-4">
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">空值应为 —</p>
        <InkKeyValue :items="emptyValues" />
        <p class="mt-2 text-[12px] text-ink-3">formatDateTime(undefined) = {{ formatDateTime() }}</p>
        <p class="text-[12px] text-ink-3">formatSize(0) = {{ formatSize(0) }}</p>
      </div>
      <div class="rounded-xl border border-line-1 bg-card p-4">
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">0 与 NaN</p>
        <div class="grid gap-2">
          <InkProgress :value="0" :max="100" />
          <InkProgress :value="nan" :max="100" />
          <InkMeter :value="0" :max="0" :format="formatSize" />
          <InkMeter :value="nan" :max="100" :format="formatSize" />
          <InkSparkline :values="[nan, nan, nan]" />
          <div class="h-1" />
          <InkShareBar :segments="zeroSegments" />
        </div>
      </div>
      <div class="rounded-xl border border-line-1 bg-card p-4">
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">全 0 图表应显示「暂无数据」</p>
        <InkBarChart
          :buckets="[{ label: 'A' }, { label: 'B' }, { label: 'C' }]"
          :series="[{ key: 'zero', label: '零', color: 'var(--series-1)', values: [0, 0, 0] }]"
          :height="140"
        />
        <InkStatGrid class="mt-2">
          <InkStat label="零值指标" :value="0" />
          <InkStat label="空趋势" :value="0" :spark="[0, 0, 0]" />
        </InkStatGrid>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">几十行的列表（40 行，看表头/滚动/斑马）</p>
      <div class="max-h-96 overflow-y-auto">
        <InkDataTable :rows="manyRows" :columns="manyColumns" :row-key="(row) => row.id" dense />
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">窄容器（w-40）里的浮层：popover / dropdown / tooltip</p>
      <div class="w-40 rounded-xl border border-dashed border-line-3 p-2" data-edge="narrow">
        <div class="grid gap-2">
          <UiPopover>
            <UiPopoverTrigger as-child>
              <UiButton variant="outline" size="sm" class="w-full">popover</UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-72">
              <p class="text-[13px] text-ink-2">在 w-40 容器里打开，看浮层如何避让 / 溢出视口。</p>
            </UiPopoverContent>
          </UiPopover>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiButton variant="outline" size="sm" class="w-full">dropdown</UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent>
              <UiDropdownMenuItem>很长的菜单项名称会怎样截断</UiDropdownMenuItem>
              <UiDropdownMenuItem>第二项</UiDropdownMenuItem>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
          <InkTooltip content="很长的 tooltip 文案，用来验证在窄容器旁的换行与位置">
            <UiButton variant="ghost" size="sm" class="w-full">tooltip</UiButton>
          </InkTooltip>
        </div>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">Tab 焦点环：依次 Tab 过这一排</p>
      <div class="flex flex-wrap items-center gap-3 rounded-xl border border-line-1 bg-card p-4" tabindex="0">
        <UiButton data-focusable="button">按钮</UiButton>
        <UiButton variant="outline" data-focusable="button-outline">描边按钮</UiButton>
        <UiInput class="w-40" placeholder="输入框" data-focusable="input" @focus="focusRow = 'input'" />
        <UiInput class="w-40" placeholder="禁用输入" disabled />
        <UiSwitch v-model="darkMode" data-focusable="switch" />
        <a href="#edge-cases" class="text-[13px] text-brand underline-offset-4 hover:underline" data-focusable="link">
          链接
        </a>
        <UiBadge variant="brand" data-focusable="badge">不可聚焦的 badge</UiBadge>
        <InkSegmented
          v-model="focusRow"
          :options="[
            { value: 'a', label: '甲' },
            { value: 'b', label: '乙' },
          ]"
          aria-label="焦点示例"
        />
        <span class="inline-flex items-center gap-1.5 text-[12px] text-ink-3">
          <Search class="size-3.5" />
          焦点：{{ focusRow || '无' }}
        </span>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">禁用与 loading 共存</p>
      <div class="flex flex-wrap items-center gap-3 rounded-xl border border-line-1 bg-card p-4">
        <UiButton disabled data-edge="disabled">
          <LoaderCircle class="animate-spin" />
          加载中（禁用）
        </UiButton>
        <UiButton variant="outline" disabled>禁用描边</UiButton>
        <UiButton variant="destructive" disabled>禁用危险</UiButton>
        <UiButton size="sm" disabled>
          <Plus />
          新建
        </UiButton>
      </div>
      <div class="mt-3">
        <p class="mb-1 text-[12px] text-ink-3">DataTable：loading 且已有数据时保留数据（刷新不该换成骨架）</p>
        <InkDataTable
          :rows="manyRows.slice(0, 4)"
          :columns="manyColumns"
          :row-key="(row) => row.id"
          :loading="true"
          dense
        />
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">明暗切换瞬间的对比</p>
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <UiButton variant="outline" size="sm" data-edge="toggle-theme" @click="darkMode = !darkMode">
            切换明暗（当前 {{ darkMode ? 'dark' : 'light' }}）
          </UiButton>
          <span class="text-[12px] text-ink-3">强调色：{{ accent }}（在页面顶部切换）</span>
        </div>
        <div class="grid gap-2 sm:grid-cols-4">
          <div class="rounded-lg border border-line-1 bg-chassis p-3">
            <p class="text-[13px] text-ink-1">chassis / ink-1</p>
            <p class="text-[12px] text-ink-2">chassis / ink-2</p>
            <p class="text-[12px] text-ink-3">chassis / ink-3</p>
            <p class="text-[12px] text-ink-4">chassis / ink-4</p>
          </div>
          <div class="rounded-lg border border-line-1 bg-panel p-3">
            <p class="text-[13px] text-ink-1">panel / ink-1</p>
            <p class="text-[12px] text-ink-2">panel / ink-2</p>
            <p class="text-[12px] text-ink-3">panel / ink-3</p>
            <p class="text-[12px] text-ink-4">panel / ink-4</p>
          </div>
          <div class="rounded-lg border border-line-1 bg-card p-3">
            <p class="text-[13px] text-ink-1">card / ink-1</p>
            <p class="text-[12px] text-ink-2">card / ink-2</p>
            <p class="text-[12px] text-ink-3">card / ink-3</p>
            <p class="text-[12px] text-ink-4">card / ink-4</p>
          </div>
          <div class="rounded-lg border border-line-1 bg-raised p-3">
            <p class="text-[13px] text-ink-1">raised / ink-1</p>
            <p class="text-[12px] text-ink-2">raised / ink-2</p>
            <p class="text-[12px] text-ink-3">raised / ink-3</p>
            <p class="text-[12px] text-ink-4">raised / ink-4</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 rounded-lg border border-line-1 bg-card p-3">
          <InkBadge tone="ok">ok</InkBadge>
          <InkBadge tone="warn">warn</InkBadge>
          <InkBadge tone="bad">bad</InkBadge>
          <InkBadge tone="brand">brand</InkBadge>
          <span class="text-[12px] text-ink-3">状态色在两套主题下的可读性对照</span>
        </div>
      </div>
    </div>
  </div>
</template>
