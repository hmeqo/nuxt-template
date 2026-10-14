<script setup lang="ts">
/**
 * 解析值只能客户端读（`getComputedStyle`），并且用 `MutationObserver` 盯 `html` 的
 * `class` / `data-accent`——外部脚本直接改这两个属性时 Vue 不知情，靠重读才能让截图跟上。
 */
const SURFACES = ['--chassis', '--panel', '--card', '--raised', '--overlay']
const LINES = ['--line-1', '--line-2', '--line-3', '--line-4']
const INKS = ['--ink-1', '--ink-2', '--ink-3', '--ink-4', '--ink-inverse']
const BRANDS = ['--brand', '--brand-a', '--brand-b', '--brand-soft', '--focus']
const STATUS = ['--ok', '--ok-soft', '--warn', '--warn-soft', '--bad', '--bad-soft', '--live']
const INTERACTIVE = ['--hover', '--selected']
const SERIES = [...Array(10).keys()].map((index) => `--series-${index + 1}`).concat('--series-other')

const GROUPS = [
  { label: '表面', tokens: SURFACES },
  { label: '发丝线', tokens: LINES },
  { label: '正文', tokens: INKS },
  { label: '强调', tokens: BRANDS },
  { label: '状态', tokens: STATUS },
  { label: '交互叠加', tokens: INTERACTIVE },
  { label: '分类色', tokens: SERIES },
]

const ALL_TOKENS = GROUPS.flatMap((group) => group.tokens)
/** alpha 台阶：底色块 + 上面叠一块，才看得出 6% / 9% / 14% / 22% 的差 */
const OVERLAY_TOKENS = [...INTERACTIVE, ...LINES]
const OVERLAY_BASES = ['--panel', '--raised']

const values = ref<Record<string, string>>({})

function readTokens() {
  const style = getComputedStyle(document.documentElement)
  const next: Record<string, string> = {}
  for (const token of ALL_TOKENS) next[token] = style.getPropertyValue(token).trim()
  values.value = next
}

let observer: MutationObserver | undefined

onMounted(() => {
  readTokens()
  observer = new MutationObserver(readTokens)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent', 'style'] })
})

onBeforeUnmount(() => observer?.disconnect())

/** 分类色查表：权重降序稳定分配，证明 seriesColor / buildColorLookup 在真实渲染里可用 */
const lookup = buildColorLookup([
  { key: 'alpha', weight: 40 },
  { key: 'beta', weight: 30 },
  { key: 'gamma', weight: 20 },
  { key: 'delta', weight: 10 },
])
</script>

<template>
  <div class="space-y-6">
    <!-- 表面梯级：chassis → panel → card → raised，逐层嵌套才看得出抬升关系 -->
    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">表面梯级（逐层嵌套）</p>
      <div class="rounded-xl border border-line-1 bg-chassis p-3">
        <div class="rounded-lg bg-panel p-3">
          <p class="text-xs text-ink-3">panel</p>
          <div class="mt-2 rounded-lg bg-card p-3">
            <p class="text-xs text-ink-3">card</p>
            <div class="mt-2 rounded-lg bg-raised p-3">
              <p class="text-xs text-ink-3">raised</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 inline-flex items-center gap-2 rounded-lg bg-overlay px-2.5 py-1.5 text-xs text-ink-2">
        <InkSwatch color="var(--overlay)" :size="12" />
        overlay（叠在任意表面上）
      </div>
    </div>

    <!-- alpha 台阶：同一底上叠不同 alpha，另有一排真实 1px 发丝线 -->
    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">叠加与发丝线（底色块 + 上面叠一块）</p>
      <div class="space-y-2">
        <div v-for="base in OVERLAY_BASES" :key="base" class="flex flex-wrap items-center gap-2">
          <code class="w-20 flex-none text-[12px] text-ink-3">{{ base }}</code>
          <div
            v-for="token in OVERLAY_TOKENS"
            :key="`${base}-${token}`"
            class="relative h-9 w-24 overflow-hidden rounded-md"
            :style="{ background: `var(${base})` }"
            :data-token-overlay="`${base}/${token}`"
          >
            <span class="absolute inset-0" :style="{ background: `var(${token})` }" />
            <span class="absolute inset-x-1 bottom-0.5 text-[10px] text-ink-2">{{ token }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 rounded-lg bg-panel px-2 py-2">
          <span class="text-[12px] text-ink-3">真实 1px 线</span>
          <span v-for="token in LINES" :key="token" class="flex items-center gap-1.5 px-2">
            <span class="text-[11px] text-ink-3">{{ token }}</span>
            <span class="block h-px w-10" :style="{ background: `var(${token})` }" />
          </span>
        </div>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">分类色（seriesColor / buildColorLookup）</p>
      <div class="flex flex-wrap items-end gap-1.5">
        <div v-for="index in 10" :key="index" class="w-16">
          <span
            class="block h-9 rounded-md border border-line-1"
            :style="{ background: seriesColor(index - 1) }"
            :data-series="index"
          />
          <span class="mt-1 block text-[11px] whitespace-nowrap text-ink-3">--series-{{ index }}</span>
        </div>
        <div class="w-16">
          <span
            class="block h-9 rounded-md border border-line-1"
            :style="{ background: 'var(--series-other)' }"
            data-series="other"
          />
          <span class="mt-1 block text-[11px] whitespace-nowrap text-ink-3">--series-other</span>
        </div>
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <span class="text-[12px] text-ink-3">查表：</span>
        <span
          v-for="[key, color] in [...lookup]"
          :key="key"
          class="inline-flex items-center gap-1.5 text-xs text-ink-2"
        >
          <InkSwatch :color="color" :size="12" />
          {{ key }}
        </span>
      </div>
    </div>

    <!-- 全量 token 清单 -->
    <div v-for="group in GROUPS" :key="group.label">
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">{{ group.label }}</p>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="token in group.tokens"
          :key="token"
          class="flex items-center gap-2.5 rounded-lg border border-line-1 bg-card px-2.5 py-2"
        >
          <span
            class="size-7 flex-none rounded-md border border-line-2"
            :style="{ background: `var(${token})` }"
            aria-hidden="true"
          />
          <span class="flex min-w-0 flex-col">
            <code class="truncate text-[11.5px] text-ink-1" :data-token="token">{{ token }}</code>
            <code class="truncate text-[11px] text-ink-3" :data-value="token">{{ values[token] || '—' }}</code>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
