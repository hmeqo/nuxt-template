<script setup lang="ts" generic="T extends object">
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Filter,
  RefreshCw,
  TriangleAlert,
} from '@lucide/vue'
import type { Component } from 'vue'
import { getCurrentInstance } from 'vue'
import { cn } from '../utils/cn'
import type { TableAction, TableColumn, TablePagination, TableSort } from '../utils/table'

/** 数据表：卡片壳 + 表头 + 行操作 + 骨架/失败/空态 + 分页页脚的固定样式，用法见 README「表格」。 */
const props = withDefaults(
  defineProps<{
    rows: readonly T[]
    columns: readonly TableColumn<T>[]
    rowKey: (row: T) => string | number
    /** 行操作：右键菜单与 `···` 共用；不传则不出操作列、右键也不弹菜单 */
    actions?: (row: T) => TableAction<T>[]
    /** 加载中：有数据时保留数据（刷新不该把已有行换成骨架），没数据才铺骨架行 */
    loading?: boolean
    /** 有值即渲染失败态，点重试 emit(`retry`) */
    error?: unknown
    errorTitle?: string
    errorText?: string
    emptyTitle?: string
    emptyDescription?: string
    emptyIcon?: Component
    pagination?: TablePagination
    skeletonRows?: number
    sort?: TableSort
    filters?: Record<string, string>
    class?: string
    /** 紧凑表头：表头格改 `h-auto px-4 py-2`（列多、信息密度高的列表用），行不变 */
    dense?: boolean
  }>(),
  {
    errorTitle: '加载失败',
    emptyTitle: '暂无数据',
    skeletonRows: 6,
  },
)

const emit = defineEmits<{
  'update:sort': [value: TableSort]
  'update:filters': [value: Record<string, string>]
  'update:page': [value: number]
  retry: []
}>()

defineSlots<{
  /** 卡片头部插槽：表头之上、卡片内（页头 + 工具栏放这里，仍在这张卡片里） */
  header: () => unknown
  [key: `cell-${string}`]: (props: { row: T; column: TableColumn<T> }) => unknown
  'empty-action': () => unknown
}>()

const hasActions = computed(() => typeof props.actions === 'function')
const colCount = computed(() => props.columns.length + (hasActions.value ? 1 : 0))
const showSkeleton = computed(() => Boolean(props.loading) && props.rows.length === 0)

const instance = getCurrentInstance()

/**
 * 表头能力是**接线才出现**：绑了 `v-model:sort` 才有排序按钮、绑了 `v-model:filters` 才有筛选漏斗
 * （`sortable` / `filter` 只声明「这一列支持」，不代表页面真的处理了——没接线就不该摆出来）。
 */
const wired = computed(() => {
  const raw = instance?.vnode.props ?? {}
  return {
    sort: 'sort' in raw || 'onUpdate:sort' in raw,
    filters: 'filters' in raw || 'onUpdate:filters' in raw,
  }
})

const openFilter = ref<string>()

/** 筛选框的输入值：父级只在提交时才收到，免得每个字符都发一次请求 */
const drafts = ref<Record<string, string>>({ ...props.filters })
watch(
  () => props.filters,
  (next) => {
    drafts.value = { ...next }
  },
  { deep: true },
)

function filterActive(key: string) {
  return Boolean(props.filters?.[key])
}

function applyFilter(key: string) {
  commitFilter(key)
  openFilter.value = undefined
}

/** 选项筛选：点已选项即取消；面板里点一下就生效，不用再按「应用」 */
function pickFilter(key: string, value: string) {
  drafts.value[key] = drafts.value[key] === value ? '' : value
  applyFilter(key)
}

function resetFilter(key: string) {
  drafts.value[key] = ''
  commitFilter(key)
  openFilter.value = undefined
}

function sortOf(key: string) {
  return props.sort?.key === key ? props.sort.order : null
}

function toggleSort(key: string) {
  const order = sortOf(key)
  emit('update:sort', order === null ? { key, order: 'asc' } : order === 'asc' ? { key, order: 'desc' } : null)
}

function ariaSort(key: string, sortable?: boolean) {
  if (!sortable) return undefined
  const order = sortOf(key)
  return order === 'asc' ? 'ascending' : order === 'desc' ? 'descending' : 'none'
}

function commitFilter(key: string) {
  const value = (drafts.value[key] ?? '').trim()
  if (value === (props.filters?.[key] ?? '')) return
  emit('update:filters', { ...props.filters, [key]: value })
}

function clearFilter(key: string) {
  drafts.value[key] = ''
  commitFilter(key)
}

function cellText(column: TableColumn<T>, row: T) {
  if (column.text) return column.text(row)
  const value = (row as Record<string, unknown>)[column.key]
  return value === null || value === undefined ? '' : String(value)
}

function cellClass(column: TableColumn<T>) {
  return cn(column.width, column.numeric && 'num', column.align === 'end' && 'text-right', column.cellClass)
}
</script>

<template>
  <UiCard :class="cn('gap-0 py-0', props.class)">
    <slot name="header" />
    <div class="overflow-x-auto">
      <UiTable>
        <UiTableHeader>
          <UiTableRow class="border-line-1 hover:bg-transparent">
            <UiTableHead
              v-for="column in columns"
              :key="column.key"
              :class="[column.width, column.align === 'end' && 'text-right', dense && 'h-auto px-4 py-2']"
              :aria-sort="ariaSort(column.key, column.sortable)"
            >
              <div class="flex items-center gap-1.5" :class="column.align === 'end' && 'justify-end'">
                <span>{{ column.label }}</span>

                <button
                  v-if="wired.sort && column.sortable"
                  type="button"
                  class="inline-flex size-5 items-center justify-center rounded transition-colors hover:bg-hover"
                  :class="sortOf(column.key) ? 'text-ink-1' : 'text-ink-3 hover:text-ink-1'"
                  :aria-label="`排序${column.label}`"
                  @click="toggleSort(column.key)"
                >
                  <ArrowUp v-if="sortOf(column.key) === 'asc'" class="size-3.5" />
                  <ArrowDown v-else-if="sortOf(column.key) === 'desc'" class="size-3.5" />
                  <ArrowUpDown v-else class="size-3.5" />
                </button>

                <UiPopover
                  v-if="wired.filters && column.filter"
                  :open="openFilter === column.key"
                  @update:open="(open: boolean) => (openFilter = open ? column.key : undefined)"
                >
                  <UiPopoverTrigger as-child>
                    <button
                      type="button"
                      class="inline-flex size-5 items-center justify-center rounded transition-colors hover:bg-hover"
                      :class="filterActive(column.key) ? 'text-brand' : 'text-ink-3 hover:text-ink-1'"
                      :aria-label="`筛选${column.label}`"
                    >
                      <Filter class="size-3.5" :class="filterActive(column.key) && 'fill-current'" />
                    </button>
                  </UiPopoverTrigger>
                  <UiPopoverContent align="start" class="w-56 space-y-2">
                    <p class="text-[11px] font-medium text-ink-2">按{{ column.label }}筛选</p>
                    <div v-if="column.filter.options" class="-mx-1 flex flex-col">
                      <button
                        v-for="option in column.filter.options"
                        :key="option.value"
                        type="button"
                        class="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors hover:bg-hover"
                        :class="drafts[column.key] === option.value ? 'text-ink-1' : 'text-ink-2'"
                        @click="pickFilter(column.key, option.value)"
                      >
                        {{ option.label }}
                        <Check v-if="drafts[column.key] === option.value" class="size-3.5" />
                      </button>
                    </div>
                    <template v-else>
                      <UiInput
                        v-model="drafts[column.key]"
                        :placeholder="column.filter.placeholder ?? '输入后回车'"
                        @keyup.enter="applyFilter(column.key)"
                      />
                      <p
                        v-if="filterActive(column.key) && (drafts[column.key] ?? '').trim() !== filters?.[column.key]"
                        class="text-[11px] text-ink-3"
                      >
                        当前生效：{{ filters?.[column.key] }}
                      </p>
                    </template>
                    <div class="flex items-center justify-between pt-0.5">
                      <UiButton size="xs" variant="ghost" @click="resetFilter(column.key)">清除</UiButton>
                      <UiButton size="xs" @click="applyFilter(column.key)">应用</UiButton>
                    </div>
                  </UiPopoverContent>
                </UiPopover>
              </div>
            </UiTableHead>
            <UiTableHead v-if="hasActions" class="w-14 text-right" :class="dense && 'h-auto px-4 py-2'">
              <span class="sr-only">操作</span>
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>

        <UiTableBody>
          <template v-if="showSkeleton">
            <UiTableRow v-for="n in skeletonRows" :key="`skeleton-${n}`">
              <UiTableCell v-for="column in columns" :key="column.key">
                <div class="skeleton h-3" :class="column.skeleton ?? 'w-24'" />
              </UiTableCell>
              <UiTableCell v-if="hasActions">
                <div class="skeleton ml-auto size-6.5 rounded-lg" />
              </UiTableCell>
            </UiTableRow>
          </template>

          <UiTableRow v-else-if="error">
            <UiTableCell :colspan="colCount" class="py-8">
              <div class="flex flex-col items-center gap-3 text-center">
                <TriangleAlert class="size-6 text-ink-4" />
                <div class="min-w-0">
                  <p class="text-[13px] font-medium">{{ errorTitle }}</p>
                  <p v-if="errorText" class="mt-1 text-xs text-ink-3">接口返回：{{ errorText }}</p>
                  <p class="mt-1 text-xs text-ink-3">
                    可以点「重试」重新加载；如果一直失败，说明后端接口暂时不可用，稍后再试。
                  </p>
                </div>
                <UiButton :disabled="loading" @click="emit('retry')">
                  <RefreshCw :class="loading && 'animate-spin'" />
                  {{ loading ? '重试中…' : '重试' }}
                </UiButton>
              </div>
            </UiTableCell>
          </UiTableRow>

          <UiTableRow v-else-if="!rows.length">
            <UiTableCell :colspan="colCount" class="p-0">
              <InkEmptyState
                v-bind="emptyIcon ? { icon: emptyIcon } : {}"
                :title="emptyTitle"
                :description="emptyDescription"
              >
                <template #action>
                  <slot name="empty-action" />
                </template>
              </InkEmptyState>
            </UiTableCell>
          </UiTableRow>

          <!-- 右键整行 = 打开同一份行操作；行尾 `···` 是它的显式入口（触屏/键盘用） -->
          <template v-else>
            <UiContextMenu v-for="row in rows" :key="rowKey(row)">
              <UiContextMenuTrigger as-child>
                <UiTableRow>
                  <UiTableCell v-for="column in columns" :key="column.key" :class="cellClass(column)">
                    <slot :name="`cell-${column.key}`" :row="row" :column="column">
                      {{ cellText(column, row) }}
                    </slot>
                  </UiTableCell>
                  <UiTableCell v-if="hasActions" class="text-right">
                    <UiDropdownMenu>
                      <UiDropdownMenuTrigger as-child>
                        <UiButton variant="ghost" size="icon-sm" aria-label="操作">
                          <Ellipsis />
                        </UiButton>
                      </UiDropdownMenuTrigger>
                      <UiDropdownMenuContent align="end" class="w-32">
                        <UiDropdownMenuItem
                          v-for="action in actions?.(row) ?? []"
                          :key="action.key"
                          :variant="action.variant"
                          @click="action.run(row)"
                        >
                          <component :is="action.icon" v-if="action.icon" />
                          {{ action.label }}
                        </UiDropdownMenuItem>
                      </UiDropdownMenuContent>
                    </UiDropdownMenu>
                  </UiTableCell>
                </UiTableRow>
              </UiContextMenuTrigger>

              <UiContextMenuContent v-if="hasActions" class="w-32">
                <UiContextMenuItem
                  v-for="action in actions?.(row) ?? []"
                  :key="action.key"
                  :variant="action.variant"
                  @click="action.run(row)"
                >
                  <component :is="action.icon" v-if="action.icon" />
                  {{ action.label }}
                </UiContextMenuItem>
              </UiContextMenuContent>
            </UiContextMenu>
          </template>
        </UiTableBody>
      </UiTable>
    </div>

    <UiCardFooter v-if="pagination && rows.length && !error" class="flex-wrap justify-between gap-2">
      <span>
        共 <span class="num text-ink-1">{{ pagination.total }}</span> {{ pagination.unit ?? '条' }}
      </span>
      <div class="flex items-center gap-2">
        <InkTooltip content="上一页" side="top">
          <UiButton
            variant="outline"
            size="icon"
            :disabled="pagination.page <= 1 || loading"
            @click="emit('update:page', pagination.page - 1)"
          >
            <ChevronLeft />
            <span class="sr-only">上一页</span>
          </UiButton>
        </InkTooltip>
        <span class="num text-ink-2">{{ pagination.page }} / {{ pagination.pageCount || 1 }}</span>
        <InkTooltip content="下一页" side="top">
          <UiButton
            variant="outline"
            size="icon"
            :disabled="pagination.page >= (pagination.pageCount || 1) || loading"
            @click="emit('update:page', pagination.page + 1)"
          >
            <ChevronRight />
            <span class="sr-only">下一页</span>
          </UiButton>
        </InkTooltip>
      </div>
    </UiCardFooter>
  </UiCard>
</template>
