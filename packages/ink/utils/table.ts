import type { Component } from 'vue'

/**
 * `<InkDataTable>` 的类型：列定义、行操作、排序与筛选状态。
 *
 * 排序和筛选在这里只是**状态**（`TableSort` / `Record<列key, 值>`），组件不发请求，
 * 父级把拿到的值拼进自己的查询参数——后端认什么字段名由调用方决定。
 */

/** 表头排序：`null` = 不排序（只有 `sortable` 的列会产生） */
export type TableSort = { key: string; order: 'asc' | 'desc' } | null

export interface TableColumnFilterOption {
  value: string
  label: string
}

/** 表头筛选控件：漏斗按钮 → 面板（输入框；带 `options` 时改成选项列表，点一下即生效） */
export interface TableColumnFilter {
  placeholder?: string
  options?: readonly TableColumnFilterOption[]
}

export interface TableColumn<T> {
  /** 列标识：排序、筛选、单元格插槽（`#cell-<key>`）都按它取 */
  key: string
  label: string
  /** Tailwind 宽度类（如 `w-20`）；不传按内容自适应 */
  width?: string
  /** 数字列：套 `.num`（等宽 + 表格数字） */
  numeric?: boolean
  align?: 'end'
  /** 表头出排序按钮：点击循环 升 → 降 → 不排。页面**绑了 `v-model:sort`** 才真的渲染 */
  sortable?: boolean
  /** 表头出筛选漏斗：面板里是输入框 + 清除/应用。页面**绑了 `v-model:filters`** 才真的渲染 */
  filter?: TableColumnFilter
  /** 单元格文本；不传取 `row[key]`，要自定义内容就用 `#cell-<key>` 插槽 */
  text?: (row: T) => string | number | null | undefined
  cellClass?: string
  /** 骨架屏这一列的宽度类，默认 `w-24` */
  skeleton?: string
}

export interface TableAction<T> {
  key: string
  label: string
  icon?: Component
  variant?: 'default' | 'destructive'
  run: (row: T) => void
}

export interface TablePagination {
  page: number
  pageCount: number
  total: number
  /** 计数单位，默认「条」 */
  unit?: string
}
