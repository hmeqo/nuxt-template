<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '组件画廊',
})

// 仅开发环境：生产构建里这个页面必须不存在（setup 里抛 404）
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const { colorMode, colorModePreference } = useThemeMode()
const accent = useInkAccent()

const SECTIONS = [
  { id: 'tokens', label: '令牌' },
  { id: 'primitives', label: '基础件' },
  { id: 'composites', label: '组合件' },
  { id: 'edge-cases', label: '边界' },
]

/**
 * 截图流程会直接改 `html` 的 `class` / `data-accent`（绕过 Vue），
 */
const htmlDark = ref(false)
const htmlAccent = ref('silver')

function syncHtml() {
  htmlDark.value = document.documentElement.classList.contains('dark')
  htmlAccent.value = document.documentElement.dataset.accent ?? 'silver'
}

let observer: MutationObserver | undefined

onMounted(() => {
  syncHtml()
  observer = new MutationObserver(syncHtml)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent'] })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="space-y-8">
    <InkPageHeader
      title="组件画廊"
      description="开发环境专用：把每个 Ink 组合件、Ui 基础件与设计令牌逐一亮出来，用来目检明暗与强调色下的观感。"
    />

    <nav
      class="sticky top-14 z-30 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line-1 bg-overlay px-3 py-2 shadow-(--shadow-1) backdrop-blur"
      data-gallery="toc"
    >
      <span class="text-[12px] font-medium text-ink-3">目录</span>
      <a
        v-for="section in SECTIONS"
        :key="section.id"
        :href="`#${section.id}`"
        class="rounded-md px-2 py-1 text-[12.5px] text-ink-2 transition-colors hover:bg-hover hover:text-ink-1"
        data-toc="section"
      >
        {{ section.label }}
      </a>
      <span class="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-3">
        <span data-readout="theme">
          主题：html.dark={{ htmlDark }}（偏好 {{ colorModePreference }} / 当前 {{ colorMode }}）
        </span>
        <span data-readout="accent">强调：{{ accent }}（html 上 {{ htmlAccent }}）</span>
      </span>
    </nav>

    <section id="tokens" class="scroll-mt-28 space-y-3" data-section="tokens">
      <h2 class="text-[18px] font-semibold tracking-[-0.02em] text-ink-1">令牌</h2>
      <GalleryTokens />
    </section>

    <section id="primitives" class="scroll-mt-28 space-y-3" data-section="primitives">
      <h2 class="text-[18px] font-semibold tracking-[-0.02em] text-ink-1">基础件（Ui*）</h2>
      <GalleryPrimitives />
    </section>

    <section id="composites" class="scroll-mt-28 space-y-3" data-section="composites">
      <h2 class="text-[18px] font-semibold tracking-[-0.02em] text-ink-1">组合件（Ink*）</h2>
      <GalleryComposites />
    </section>

    <section id="edge-cases" class="scroll-mt-28 space-y-3" data-section="edge-cases">
      <h2 class="text-[18px] font-semibold tracking-[-0.02em] text-ink-1">状态与边界</h2>
      <GalleryEdgeCases />
    </section>
  </div>
</template>
