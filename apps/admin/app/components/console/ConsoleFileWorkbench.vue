<script setup lang="ts">
import { Copy, Download, ExternalLink, FileText, FileUp, Link2, LoaderCircle, RefreshCw, Upload, X } from '@lucide/vue'
import type { FileResp, UploadForm } from '@ws/apisdk/types'

const props = defineProps<{
  /** 服务端文件列表，由页面拉取后传入 */
  records: readonly FileResp[]
  loading?: boolean
  error?: unknown
}>()

const emit = defineEmits<{ refresh: [] }>()

const fileRef = ref<HTMLInputElement | null>(null)
const picked = ref<File | null>(null)
const pending = ref('')

function pick(event: Event) {
  const input = event.target as HTMLInputElement
  picked.value = input.files?.[0] ?? null
  input.value = '' // 允许重复选择同一个文件
}

/** 同一批记录里的最大体积，Meter 的基准 */
const maxSize = computed(() => Math.max(1, ...props.records.map((file) => file.size)))

const sort = ref<TableSort>(null)
const filters = ref<Record<string, string>>({})

/** 排序键 → 取值函数；最多 100 行且不分页，在本地排 */
const SORT_KEYS: Record<string, (file: FileResp) => string | number> = {
  file: (file) => file.original_name.toLowerCase(),
  size: (file) => file.size,
  created: (file) => Date.parse(file.created_at),
}

/** 名称筛选同时认 sha256 前缀：贴一段哈希就能定位 */
const visible = computed(() => {
  const name = (filters.value.file ?? '').trim().toLowerCase()
  const state = filters.value.state ?? ''
  const rows = props.records.filter(
    (file) =>
      (!name || file.original_name.toLowerCase().includes(name) || file.hash.startsWith(name)) &&
      (!state || file.state === state),
  )
  const of = sort.value ? SORT_KEYS[sort.value.key] : undefined
  if (!of) return rows
  const direction = sort.value?.order === 'desc' ? -1 : 1
  return [...rows].sort((a, b) => {
    const left = of(a)
    const right = of(b)
    const diff =
      typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
    return diff * direction
  })
})

const filtering = computed(() => Boolean(filters.value.file || filters.value.state))

const columns: TableColumn<FileResp>[] = [
  { key: 'file', label: '文件', sortable: true, filter: { placeholder: '名称或哈希包含…' }, skeleton: 'w-40' },
  {
    key: 'state',
    label: '状态',
    width: 'w-24',
    skeleton: 'w-12',
    filter: {
      options: [
        { value: 'attached', label: '已附加' },
        { value: 'draft', label: '草稿' },
      ],
    },
  },
  { key: 'size', label: '大小', width: 'w-36', numeric: true, align: 'end', sortable: true },
  {
    key: 'created',
    label: '创建时间',
    width: 'w-36',
    numeric: true,
    align: 'end',
    sortable: true,
    text: (file) => formatDateTime(file.created_at, { seconds: false }),
  },
  { key: 'actions', label: '操作', width: 'w-24', align: 'end' },
]

/** 列表只画 24px，按 2x 取最小档 */
const LIST_THUMB_SIZE = 64

/** 「打开」用查看档：1920 宽窗口里 1:1 */
const OPEN_THUMB_SIZE = 2048

/** 缩略图取不到（坏图 / 派生失败）就记下来，退回图标，别让浏览器画出裂图 */
const thumbFailed = ref(new Set<string>())

/** 后端只对栅格图给 `thumbnail_url`（值就是 `{url}?size=256`），这里按需换成列表档位 */
function thumbUrl(file: FileResp) {
  if (!file.thumbnail_url || thumbFailed.value.has(file.id)) return undefined
  return `${file.url}?size=${LIST_THUMB_SIZE}`
}

function openUrl(file: FileResp) {
  return `${file.url}?size=${OPEN_THUMB_SIZE}`
}

async function run(label: string, request: () => Promise<void>) {
  pending.value = label
  try {
    await request()
  } catch (error) {
    apiErrorToast(`${label}失败`, error)
  } finally {
    pending.value = ''
  }
}

/** 上传：字段名与后端一致（multipart 的 file），显式构造 FormData 让二进制原样发出 */
const upload = () =>
  run('上传', async () => {
    if (!picked.value) throw new Error('请先选择文件')
    const form = new FormData()
    form.append('file', picked.value, picked.value.name)
    const uploaded = await Apis.files.upload({ data: form as unknown as UploadForm })
    picked.value = null
    toast({ title: '上传成功', description: uploaded.original_name })
    emit('refresh')
  })

const attach = (file: FileResp) =>
  run('附加', async () => {
    await Apis.files.attach({ pathParams: { id: file.id } })
    emit('refresh')
  })

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    toast({ title: '链接已复制' })
  } catch {
    toast({ title: '复制失败', description: '浏览器拒绝了剪贴板访问，请手动复制链接。', variant: 'destructive' })
  }
}
</script>

<template>
  <InkDataTable
    :rows="visible"
    :columns="columns"
    :row-key="(file) => file.id"
    :loading="loading"
    :error="error"
    :error-text="error ? apiErrorText(error) : undefined"
    error-title="文件列表加载失败"
    :empty-title="filtering ? '没有匹配的文件' : '还没有文件'"
    :empty-description="filtering ? '换个关键词，或清空筛选再看。' : '选择一个文件上传后，记录会出现在这里'"
    :empty-icon="FileUp"
    :sort="sort"
    :filters="filters"
    dense
    @update:sort="sort = $event"
    @update:filters="filters = $event"
    @retry="emit('refresh')"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- 原生 input[type=file] 各浏览器渲染不一致，所以用同一个外壳自己画：左侧按钮段 + 文件名 -->
          <div
            class="flex h-7.5 w-64 max-w-full items-stretch overflow-hidden rounded-lg border border-line-2 bg-card text-[13px] transition-colors hover:border-line-3 focus-within:border-focus"
          >
            <button
              type="button"
              class="flex flex-none items-center gap-1.5 border-r border-line-2 bg-raised px-2.5 text-[12.5px] font-medium text-ink-1 transition-colors hover:bg-hover disabled:opacity-50"
              :disabled="!!pending"
              @click="fileRef?.click()"
            >
              <FileUp class="size-3.5" />
              选择文件
            </button>
            <span class="flex min-w-0 flex-1 items-center px-2.5" :class="picked ? 'text-ink-1' : 'text-ink-3'">
              <span class="truncate">{{ picked?.name || '未选择文件' }}</span>
            </span>
          </div>
          <input
            ref="fileRef"
            type="file"
            aria-label="选择要上传的文件"
            class="sr-only"
            :disabled="!!pending"
            @change="pick"
          />
          <UiButton :disabled="!!pending || !picked" @click="upload()">
            <LoaderCircle v-if="pending === '上传'" class="size-4 animate-spin" />
            <Upload v-else class="size-4" />
            上传
          </UiButton>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[12.5px] text-ink-3">
            共 <span class="num text-ink-1">{{ visible.length }}</span>
            <template v-if="filtering"> / {{ records.length }}</template>
            个文件
          </span>
          <InkTooltip content="重新拉取列表" side="top">
            <UiButton variant="outline" size="icon-sm" :disabled="loading" aria-label="刷新" @click="emit('refresh')">
              <RefreshCw :class="loading && 'animate-spin'" />
            </UiButton>
          </InkTooltip>
        </div>
      </div>
    </template>

    <template #empty-action>
      <UiButton v-if="filtering" variant="outline" @click="filters = {}">
        <X />
        清空筛选
      </UiButton>
    </template>

    <template #cell-file="{ row: file }">
      <div class="flex min-w-0 items-center gap-2.5">
        <img
          v-if="thumbUrl(file)"
          :src="thumbUrl(file)"
          alt=""
          class="size-6 flex-none rounded border border-line-1 object-cover"
          loading="lazy"
          @error="thumbFailed.add(file.id)"
        />
        <FileText v-else class="size-6 flex-none text-ink-3" />
        <p class="min-w-0 truncate font-medium text-ink-1" :title="file.original_name">
          {{ file.original_name }}
        </p>
        <span class="mono flex-none rounded border border-line-2 px-1 text-[11px] text-ink-3" :title="file.hash">
          {{ file.mime_type }}
        </span>
      </div>
    </template>

    <template #cell-state="{ row: file }">
      <InkBadge :tone="file.state === 'attached' ? 'ok' : 'neutral'">
        {{ file.state === 'attached' ? '已附加' : '草稿' }}
      </InkBadge>
    </template>

    <template #cell-size="{ row: file }">
      <InkMeter :value="file.size" :max="maxSize" :format="formatSize" />
    </template>

    <template #cell-actions="{ row: file }">
      <div class="flex items-center justify-end gap-1">
        <button
          v-if="file.state !== 'attached'"
          type="button"
          title="附加"
          class="inline-flex size-6.5 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-hover hover:text-ink-1 disabled:opacity-50"
          :disabled="!!pending"
          @click="attach(file)"
        >
          <Link2 class="h-4 w-4" />
        </button>
        <template v-else>
          <button
            type="button"
            title="复制链接"
            class="inline-flex size-6.5 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-hover hover:text-ink-1"
            @click="copyUrl(file.url)"
          >
            <Copy class="h-4 w-4" />
          </button>
          <a
            v-if="file.thumbnail_url"
            :href="openUrl(file)"
            target="_blank"
            rel="noreferrer"
            title="打开"
            class="inline-flex size-6.5 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-hover hover:text-ink-1"
          >
            <ExternalLink class="h-4 w-4" />
          </a>
          <a
            :href="file.url"
            download
            title="下载"
            class="inline-flex size-6.5 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-hover hover:text-ink-1"
          >
            <Download class="h-4 w-4" />
          </a>
        </template>
      </div>
    </template>
  </InkDataTable>
</template>
