<script setup lang="ts">
import { Download, FileUp, Inbox, Plus, TrendingUp, Users } from '@lucide/vue'

/** 组合件（`Ink*`）：每个组件至少一个真实示例，含加载 / 失败 / 空等状态 */

interface DemoRow {
  id: number
  name: string
  state: 'attached' | 'draft'
  size: number
  updated: string
}

const ROWS: DemoRow[] = [
  { id: 1, name: '月度报表.pdf', state: 'attached', size: 2411520, updated: '2026-09-28T10:24:00Z' },
  { id: 2, name: '产品截图.png', state: 'draft', size: 819200, updated: '2026-09-29T08:02:00Z' },
  { id: 3, name: '数据备份.zip', state: 'attached', size: 15728640, updated: '2026-09-30T21:41:00Z' },
  { id: 4, name: '会议纪要.docx', state: 'draft', size: 51200, updated: '2026-10-01T13:15:00Z' },
  { id: 5, name: '品牌规范.pdf', state: 'attached', size: 6291456, updated: '2026-10-02T09:00:00Z' },
]

const COLUMNS: TableColumn<DemoRow>[] = [
  { key: 'name', label: '名称', sortable: true, filter: { placeholder: '名称包含…' } },
  {
    key: 'state',
    label: '状态',
    width: 'w-24',
    text: (row) => (row.state === 'attached' ? '已附加' : '草稿'),
  },
  { key: 'size', label: '大小', width: 'w-36', align: 'end' },
  { key: 'updated', label: '更新时间', width: 'w-40', numeric: true, sortable: true },
]

const maxSize = Math.max(...ROWS.map((row) => row.size))

const sort = ref<TableSort>(null)
const filters = ref<Record<string, string>>({})
const lastAction = ref('')

const filteredRows = computed(() => ROWS.filter((row) => !filters.value.name || row.name.includes(filters.value.name)))

function rowActions(row: DemoRow): TableAction<DemoRow>[] {
  return [
    { key: 'download', label: '下载', icon: Download, run: () => (lastAction.value = `下载 ${row.name}`) },
    {
      key: 'delete',
      label: '删除',
      icon: FileUp,
      variant: 'destructive',
      run: () => (lastAction.value = `删除 ${row.name}`),
    },
  ]
}

/** 失败态用真实 Error，才能验重试按钮 */
const demoError = new Error('演示失败：后端不可达')

function succeed() {
  toast({ title: '保存成功', description: '普通 toast（default）' })
}

function fail() {
  toast({ title: '保存失败', description: '错误 toast（destructive）', variant: 'destructive' })
}

const promptResult = ref('')

async function confirmOne() {
  promptResult.value = `1 个动作 → ${await askConfirm({ title: '只有一个确认', description: '点「知道了」关闭。', actions: [{ label: '知道了', value: 'ok' }] })}`
}

async function confirmTwo() {
  promptResult.value = `2 个动作 → ${await askConfirm({ title: '确认操作', description: '默认的取消 / 确认。' })}`
}

async function confirmThree() {
  promptResult.value = `3 个动作 → ${await askConfirm({
    title: '保存还是放弃？',
    description: '三个动作：取消 / 不保存 / 保存。',
    actions: [
      { label: '取消', value: 'cancel' },
      { label: '不保存', value: 'discard', variant: 'outline' },
      { label: '保存', value: 'save', variant: 'destructive' },
    ],
  })}`
}

const tabs = ref('day')

const spark = [4, 8, 6, 12, 9, 15, 11, 18, 14, 21, 17, 24]
const sparkFlat = [0, 0, 0, 0, 0, 0]

const buckets = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((label) => ({ label }))
const chartSeries = [
  { key: 'attached', label: '已附加', color: 'var(--series-1)', values: [12, 18, 9, 22, 16, 7, 14] },
  { key: 'draft', label: '草稿', color: 'var(--series-2)', values: [5, 8, 12, 6, 11, 4, 9] },
]
const hiddenSeries = ref<string[]>([])
const visibleSeries = computed(() => chartSeries.filter((item) => !hiddenSeries.value.includes(item.key)))
const legend = chartSeries.map((item) => ({
  key: item.key,
  label: item.label,
  color: item.color,
  value: `${item.values.reduce((sum, value) => sum + value, 0)} 条`,
}))

function toggleSeries(key: string) {
  hiddenSeries.value = hiddenSeries.value.includes(key)
    ? hiddenSeries.value.filter((item) => item !== key)
    : [...hiddenSeries.value, key]
}

const breakdownItems = [
  { key: 'pdf', label: 'PDF', color: 'var(--series-1)', note: '1,949 个', cells: ['2.4 MB', '42%'] },
  { key: 'image', label: '图片', color: 'var(--series-2)', note: '803 个', cells: ['1.2 MB', '21%'] },
  { key: 'zip', label: '压缩包', color: 'var(--series-3)', note: '412 个', cells: ['900 KB', '16%'] },
  { key: 'other', label: '其他', color: 'var(--series-other)', note: '310 个', cells: ['1.1 MB', '21%'] },
]
const breakdownColumns = [
  { align: 'right' as const, tone: 'ink-2' as const },
  { align: 'right' as const, tone: 'ink-1' as const },
]

const shareSegments = [
  { key: 'pdf', label: 'PDF', value: 42, color: 'var(--series-1)' },
  { key: 'image', label: '图片', value: 21, color: 'var(--series-2)' },
  { key: 'zip', label: '压缩包', value: 16, color: 'var(--series-3)' },
  { key: 'other', label: '其他', value: 21, color: 'var(--series-other)' },
]

const keyValues = [
  { key: '文件 ID', value: 'f_9a12c4' },
  { key: 'MIME', value: 'application/pdf' },
  { key: '大小', value: '2.4 MB' },
  { key: '缺失值', value: undefined },
]

const segmentedOptions = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'series', label: '分类色', swatch: 'var(--series-1)' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">DataTable：正常 / loading / error / 空态</p>
      <div class="space-y-3">
        <div data-datatable="normal">
          <InkDataTable
            :rows="filteredRows"
            :columns="COLUMNS"
            :row-key="(row) => row.id"
            :actions="rowActions"
            :sort="sort"
            :filters="filters"
            :empty-title="filters.name ? '没有匹配的文件' : '还没有文件'"
            empty-description="换一个关键词，或先上传一个文件。"
            :empty-icon="FileUp"
            @update:sort="sort = $event"
            @update:filters="filters = $event"
          >
            <template #header>
              <UiCardHeader>
                <UiCardTitle>文件（可排序 / 可筛选 / 有行操作）</UiCardTitle>
                <UiCardDescription>表头接了 v-model:sort 与 v-model:filters，右键行也有菜单。</UiCardDescription>
              </UiCardHeader>
              <p v-if="lastAction" class="px-4 pb-2 text-[12px] text-ink-3">最近行操作：{{ lastAction }}</p>
              <p v-else-if="sort" class="px-4 pb-2 text-[12px] text-ink-3">排序：{{ sort.key }} {{ sort.order }}</p>
            </template>
            <template #cell-state="{ row }">
              <InkBadge :tone="row.state === 'attached' ? 'ok' : 'neutral'">
                {{ row.state === 'attached' ? '已附加' : '草稿' }}
              </InkBadge>
            </template>
            <template #cell-size="{ row }">
              <InkMeter :value="row.size" :max="maxSize" :format="formatSize" />
            </template>
            <template #cell-updated="{ row }">
              <span class="text-ink-2">{{ formatDateTime(row.updated, { seconds: false }) }}</span>
            </template>
          </InkDataTable>
        </div>

        <div data-datatable="loading">
          <InkDataTable :rows="[]" :columns="COLUMNS" :row-key="(row) => row.id" :loading="true" dense />
        </div>

        <div data-datatable="error">
          <InkDataTable
            :rows="[]"
            :columns="COLUMNS"
            :row-key="(row) => row.id"
            :error="demoError"
            error-title="文件加载失败"
            error-text="演示失败：后端不可达"
            dense
          />
        </div>

        <div data-datatable="empty">
          <InkDataTable
            :rows="[]"
            :columns="COLUMNS"
            :row-key="(row) => row.id"
            :empty-icon="Inbox"
            empty-title="这里什么都没有"
            empty-description="空态说明文字，带一个操作。"
            dense
          >
            <template #empty-action>
              <UiButton size="sm">
                <Plus />
                新建
              </UiButton>
            </template>
          </InkDataTable>
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Toaster</p>
        <div class="flex flex-wrap items-center gap-2">
          <UiButton variant="outline" data-gallery="toast-ok" @click="succeed()">触发成功 toast</UiButton>
          <UiButton variant="destructive" data-gallery="toast-bad" @click="fail()">触发错误 toast</UiButton>
        </div>
      </div>
      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Prompt（askConfirm 1 / 2 / 3 个动作）</p>
        <div class="flex flex-wrap items-center gap-2">
          <UiButton variant="outline" data-gallery="confirm-1" @click="confirmOne()">1 个动作</UiButton>
          <UiButton variant="outline" data-gallery="confirm-2" @click="confirmTwo()">2 个动作</UiButton>
          <UiButton variant="outline" data-gallery="confirm-3" @click="confirmThree()">3 个动作</UiButton>
        </div>
        <p class="mt-2 text-[12px] text-ink-3">{{ promptResult || '（还没选过）' }}</p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">EmptyState</p>
        <div class="rounded-xl border border-line-1 bg-card">
          <InkEmptyState title="还没有数据" description="上传或新建后，这里会出现内容。">
            <template #action>
              <UiButton size="sm">
                <Plus />
                新建
              </UiButton>
            </template>
          </InkEmptyState>
        </div>
      </div>

      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Badge 全 tone</p>
        <div class="flex flex-wrap items-center gap-2 rounded-xl border border-line-1 bg-card p-4">
          <InkBadge tone="neutral">neutral</InkBadge>
          <InkBadge tone="outline">outline</InkBadge>
          <InkBadge tone="brand">brand</InkBadge>
          <InkBadge tone="ok">ok</InkBadge>
          <InkBadge tone="warn">warn</InkBadge>
          <InkBadge tone="bad">bad</InkBadge>
        </div>
      </div>

      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Meter</p>
        <div class="grid gap-2 rounded-xl border border-line-1 bg-card p-4">
          <div v-for="row in ROWS" :key="row.id" class="flex items-center gap-4 text-[12.5px]">
            <span class="min-w-0 flex-1 truncate text-ink-2">{{ row.name }}</span>
            <InkMeter class="w-40 flex-none" :value="row.size" :max="maxSize" :format="formatSize" />
          </div>
        </div>
      </div>

      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Progress</p>
        <div class="grid gap-3 rounded-xl border border-line-1 bg-card p-4">
          <InkProgress :value="12" :max="100" />
          <InkProgress :value="48" :max="100" />
          <InkProgress :value="86" :max="100" />
          <InkProgress :value="100" :max="100" />
          <p class="text-[12px] text-ink-3">0% 与 100% 是常见断点；空值块不能塌掉。</p>
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Sparkline</p>
        <div class="grid gap-3 rounded-xl border border-line-1 bg-card p-4">
          <InkSparkline :values="spark" />
          <InkSparkline :values="spark" color="var(--series-2)" :height="40" />
          <div>
            <p class="mb-1 text-[12px] text-ink-3">全 0：不应画出贴底假线</p>
            <InkSparkline :values="sparkFlat" />
          </div>
        </div>
      </div>

      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Stat + StatGrid</p>
        <InkStatGrid>
          <InkStat label="文件总数" :value="1284" foot="较上周 +12%">
            <template #foot>
              <InkBadge tone="ok">+12%</InkBadge>
            </template>
          </InkStat>
          <InkStat label="存储占用" value="2.4 GB" foot="上限 10 GB" :spark="spark" />
          <InkStat label="今日上传" :value="42" foot="含 7 个草稿" :icon="TrendingUp" />
        </InkStatGrid>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-line-1 bg-card p-4">
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">BarChart（堆叠）+ ChartLegend（可点隐藏）</p>
        <InkChartLegend :items="legend" :hidden="hiddenSeries" @toggle="toggleSeries" />
        <div class="mt-2">
          <InkBarChart :buckets="buckets" :series="visibleSeries" :height="200" :format-value="(v) => `${v} 条`" />
        </div>
      </div>

      <div class="space-y-4 rounded-xl border border-line-1 bg-card p-4">
        <div>
          <p class="mb-2 text-[12.5px] font-medium text-ink-2">ShareBar</p>
          <InkShareBar :segments="shareSegments" />
          <InkShareBar :segments="shareSegments" :height="14" class="mt-2" />
        </div>
        <div>
          <p class="mb-2 text-[12.5px] font-medium text-ink-2">Breakdown</p>
          <InkBreakdown section="按文件类型" :items="breakdownItems" :columns="breakdownColumns" />
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-line-1 bg-card p-4">
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">KeyValue（缺失值应为 —）</p>
        <InkKeyValue :items="keyValues" />
      </div>

      <div class="rounded-xl border border-line-1 bg-card p-4">
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">Segmented / Swatch / Brand / Tooltip</p>
        <div class="flex flex-wrap items-center gap-4">
          <InkSegmented v-model="tabs" :options="segmentedOptions" aria-label="时间范围" />
          <span class="inline-flex items-center gap-2 text-[12.5px] text-ink-2">
            <InkSwatch color="var(--series-1)" />
            <InkSwatch color="var(--series-2)" :size="12" />
            <InkSwatch color="linear-gradient(100deg, var(--brand-a), var(--brand-b))" :size="16" />
            Swatch
          </span>
          <span class="inline-flex items-end gap-2 text-ink-2">
            <InkBrand class="size-6" />
            <InkBrand class="size-9" />
            <InkBrand class="size-14" />
          </span>
          <InkTooltip content="这是 InkTooltip 的内容">
            <UiButton variant="outline" size="sm">悬停看 tooltip</UiButton>
          </InkTooltip>
          <UiTooltip>
            <UiTooltipTrigger as-child>
              <UiButton variant="ghost" size="sm">UiTooltip 基础件</UiButton>
            </UiTooltipTrigger>
            <UiTooltipContent side="bottom">基础件 tooltip</UiTooltipContent>
          </UiTooltip>
        </div>
        <p class="mt-3 text-[12px] text-ink-3">当前分段：{{ tabs }}</p>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">PageHeader（带右侧操作）</p>
      <div class="rounded-xl border border-line-1 bg-card p-4">
        <InkPageHeader title="页头标题" description="页头说明文字，右侧可以放操作按钮。">
          <template #action>
            <UiButton variant="outline" size="sm">
              <Download />
              导出
            </UiButton>
            <UiButton size="sm">
              <Plus />
              新建
            </UiButton>
          </template>
        </InkPageHeader>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">AppearanceCard / ThemePicker / AccentPicker</p>
        <InkAppearanceCard />
      </div>
      <div>
        <p class="mb-2 text-[12.5px] font-medium text-ink-2">ThemePicker / AccentPicker（并排）</p>
        <div class="flex flex-wrap items-center gap-4 rounded-xl border border-line-1 bg-card p-4">
          <InkThemePicker />
          <InkAccentPicker />
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 text-[12px] text-ink-3">
      <Users class="size-3.5" />
      <span
        >以上覆盖组合件：DataTable / Toaster / Prompt / EmptyState / Badge / Meter / Progress / Sparkline / BarChart /
        ChartLegend / Breakdown / ShareBar / Stat+StatGrid / KeyValue / PageHeader / Segmented / Swatch / Brand /
        ThemePicker / AccentPicker / AppearanceCard / Tooltip。</span
      >
    </div>
  </div>
</template>
