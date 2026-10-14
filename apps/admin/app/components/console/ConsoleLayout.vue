<script setup lang="ts">
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from '@lucide/vue'

/**
 *
 * 折叠态用 cookie（服务端可读，首帧一致）。
 */
const route = useRoute()
const authState = useAuthState()
const { darkMode } = useThemeMode()
const { name, activeItem } = useConsoleNav()

const collapsed = useCookieState<boolean>('sidebar-collapsed', { default: () => false })

const mobileOpen = ref(false)
const scrolled = ref(false)
const handleVisible = ref(false)

onMounted(() => {
  onWindowScroll()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll)
  window.removeEventListener('pointermove', onPointerMove)
})

/** 水平 / 垂直「靠近」阈值（px）：只认靠近把手，才不至于鼠标在侧栏里走一圈就一直亮着 */
const HANDLE_GAP_X = 44
const HANDLE_GAP_Y = 80

function onPointerMove(event: PointerEvent) {
  const edge = collapsed.value ? 60 : 224
  // 把手中心 = 面板中心：顶栏 52 与下边距 8 的中点偏移
  const centerY = (window.innerHeight + 52 - 8) / 2
  handleVisible.value =
    Math.abs(event.clientX - edge) <= HANDLE_GAP_X && Math.abs(event.clientY - centerY) <= HANDLE_GAP_Y
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
    window.scrollTo(0, 0)
  },
)

const { send: logout } = useRequest(() => Apis.auth.logout(), { immediate: false }).onSuccess(() => {
  authState.logout()
  navigateTo(getLoginUrl())
})

function toggleSidebar() {
  collapsed.value = !collapsed.value
}

function openMobile() {
  mobileOpen.value = true
}

function closeMobile() {
  mobileOpen.value = false
}

function toggleTheme() {
  darkMode.value = !darkMode.value
}

function onWindowScroll() {
  scrolled.value = window.scrollY > 0
}
</script>

<template>
  <div class="relative flex min-h-dvh w-full flex-col">
    <div class="ambient" />

    <header
      class="glass fixed inset-x-0 top-0 z-40 flex h-13 items-center gap-3 border-b pl-4.5 pr-3.5 transition-colors"
      :class="scrolled ? 'border-line-1' : 'border-transparent'"
    >
      <InkTooltip content="打开菜单" side="bottom">
        <button
          type="button"
          class="-ml-1.5 inline-flex size-7.5 flex-none items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-hover hover:text-ink-1 lg:hidden"
          @click="openMobile()"
        >
          <Menu class="h-4 w-4" />
          <span class="sr-only">打开菜单</span>
        </button>
      </InkTooltip>

      <div class="flex min-w-0 items-center gap-2.5 lg:min-w-51.5">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-2.5">
          <InkBrand class="h-5.5 w-5.5" />
          <span class="truncate text-sm font-semibold tracking-[-0.01em]">{{ name }}</span>
          <span v-if="activeItem" class="text-[18px] font-light text-ink-4" aria-hidden="true">/</span>
          <span v-if="activeItem" class="truncate text-sm font-medium text-ink-1">{{ activeItem.label }}</span>
        </NuxtLink>
      </div>

      <div class="flex-1" />

      <InkTooltip content="切换主题" side="bottom">
        <button
          type="button"
          class="inline-flex size-7.5 flex-none items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-hover hover:text-ink-1"
          @click="toggleTheme()"
        >
          <Sun v-if="darkMode" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
          <span class="sr-only">切换主题</span>
        </button>
      </InkTooltip>
    </header>

    <!-- 桌面侧栏：外壳自己是 flex 列、不滚（`overflow-y-auto` 只作兜底），滚动归里面的导航区，
         否则窗口一矮就在侧栏上压出滚动条，还把底部账号块顶出视野 -->
    <aside
      class="fixed top-13 bottom-0 left-0 z-30 hidden flex-col overflow-y-auto p-2.5 pb-3.5 transition-[width] duration-200 lg:flex"
      :class="collapsed ? 'w-15' : 'w-56'"
    >
      <ConsoleSidebarContent :collapsed="collapsed" @logout="fire(logout())" />
    </aside>

    <!-- 内容区：面板直接在文档流里，整页滚动，内容会从玻璃顶栏下面滑过、被 blur 糊掉。
         移动端不套圆角面板：窄屏上「面板 + 卡片」就是两层卡片。 -->
    <main
      class="relative z-10 mt-13 grow overflow-clip transition-[margin-left] duration-200 lg:mr-2 lg:mb-2 lg:ml-2 lg:rounded-2xl lg:border lg:border-line-1 lg:bg-panel lg:shadow-(--shadow-1)"
      :class="collapsed ? 'lg:ml-15' : 'lg:ml-56'"
    >
      <div class="mx-auto max-w-[1560px] px-4 pt-5 pb-10 lg:px-7 lg:pt-6.5 lg:pb-12">
        <slot />
      </div>
    </main>

    <!-- 折叠把手：夹在侧栏和面板之间（中心压在侧栏右沿）、视口垂直居中、fixed 所以不随文档滚动。
         默认不显示，指针靠近或键盘聚焦才淡入；可见性走内联 style——同层 utility 的胜负由 CSS 顺序决定，
         写在 class 里会被静态类压掉（实测 .opacity-100 在 class 里但计算值仍是 0），内联没有这个坑。
         left 的过渡必须和侧栏 width 用**同一套 duration + 缓动**（这里都不覆盖，吃默认曲线），
         否则两条独立动画曲线不同，看起来就是把手追不上侧栏、在漂移。 -->
    <InkTooltip :content="collapsed ? '展开侧栏' : '收起侧栏'" side="right">
      <button
        type="button"
        class="fixed z-40 hidden size-6.5 items-center justify-center rounded-full border border-line-2 bg-overlay text-ink-3 shadow-(--shadow-2) backdrop-blur-[14px] backdrop-saturate-[1.6] transition-[left,opacity,color,background-color] duration-200 hover:bg-raised hover:text-ink-1 lg:inline-flex"
        :style="{
          left: `${collapsed ? 60 : 224}px`,
          top: 'calc(50dvh + 22px)',
          transform: 'translate(-50%, -50%)',
          opacity: handleVisible ? 1 : 0,
          pointerEvents: handleVisible ? 'auto' : 'none',
        }"
        @focus="handleVisible = true"
        @pointerenter="handleVisible = true"
        @click="toggleSidebar()"
      >
        <PanelLeftOpen v-if="collapsed" class="h-3.5 w-3.5" />
        <PanelLeftClose v-else class="h-3.5 w-3.5" />
        <span class="sr-only">{{ collapsed ? '展开侧栏' : '收起侧栏' }}</span>
      </button>
    </InkTooltip>

    <Teleport to="body">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-60 bg-black/50 backdrop-blur-[2px] lg:hidden"
        @click="mobileOpen = false"
      />
      <aside
        v-if="mobileOpen"
        class="fixed inset-y-0 left-0 z-70 flex w-65 flex-col border-r border-line-2 bg-overlay backdrop-blur-xl backdrop-saturate-150 lg:hidden"
      >
        <div class="flex h-13 flex-none items-center gap-2.5 px-4">
          <InkBrand class="h-5.5 w-5.5" />
          <span class="truncate text-sm font-semibold tracking-[-0.01em]">{{ name }}</span>
          <div class="flex-1" />
          <InkTooltip content="关闭菜单" side="left">
            <button
              type="button"
              class="-mr-1.5 inline-flex size-7.5 flex-none items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-hover hover:text-ink-1"
              @click="closeMobile()"
            >
              <X class="h-4 w-4" />
              <span class="sr-only">关闭菜单</span>
            </button>
          </InkTooltip>
        </div>
        <!-- 抽屉内容区：同样把滚动让给里面的导航区（见 ConsoleSidebarContent），账号块钉在抽屉底 -->
        <div class="flex min-h-0 flex-1 flex-col overflow-y-auto p-2.5 pb-3.5">
          <ConsoleSidebarContent @logout="fire(logout())" />
        </div>
      </aside>
    </Teleport>
  </div>
</template>
