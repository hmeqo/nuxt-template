<script setup lang="ts">
/**
 * 侧栏内容（桌面侧栏与移动端抽屉共用）。
 * 折叠只做两件事：收窄 + 淡出文字。所有文字始终留在 DOM 里（`truncate` 不换行、
 * 占位不变所以不会上下跳），图标与头像左沿恒在同一 x（12px 内边距），所以折叠不会横向移动任何东西。
 *
 * 滚动归导航区（`nav` 上的 `flex-1 min-h-0 overflow-y-auto`）：外层的侧栏/抽屉壳自己不滚，
 * 所以窗口再矮也不会在侧栏上压出一条滚动条、更不会把底部账号块顶出视野——先挤导航、再滚导航，
 * 账号块永远钉在栏底。（这里不能用 `min-h-full` + `mt-auto` 撑：内层会和外壳一样高、又不能再缩，
 * 内容一超标（窗口矮或多几个导航项）整个侧栏就开始滚，账号块跟着滚出去。）
 */
const props = defineProps<{ collapsed?: boolean }>()

const emit = defineEmits<{ logout: [] }>()

const { groups, isActive } = useConsoleNav()

const rowClass = (active: boolean) => [
  'flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm font-[450] transition-colors',
  active ? 'bg-selected text-ink-1' : 'text-ink-3 hover:bg-hover hover:text-ink-1',
]

// 未激活图标用 ink-3（omp 同款）：激活时文字 ink-1 + 图标 brand，未激活时文字 ink-2 + 图标 ink-3，
// 三档拉开才看得出层级；图标跟文字同色的话，未激活项会和激活项一样亮。
const iconClass = (active: boolean) => ['h-4 w-4 flex-none transition-colors', active ? 'text-brand' : 'text-ink-3']

/** 折叠时立刻淡出；展开时等 rail 稍微出来（75ms）再淡入，100ms 淡完 —— 与 rail 的 200ms 同步收尾 */
const labelClass = computed(() => [
  'truncate whitespace-nowrap transition-opacity duration-100',
  props.collapsed ? 'opacity-0' : 'opacity-100 delay-75',
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-4.5">
    <nav class="flex min-h-0 flex-1 flex-col overflow-y-auto" :class="props.collapsed ? 'gap-0' : 'gap-4.5'">
      <template v-for="(group, index) in groups" :key="group.label ?? index">
        <!--
          分组标题：展开时是 12px 小标题；折叠时标题不占行高（否则两行之间会空出 60px），
          只留一条 1px 分隔线，整块 26px 高（上下各 13px）——比行高 32px 略紧，但明确是分组断点。
        -->
        <div v-if="group.label" class="relative px-2.5" :class="props.collapsed ? 'py-3.25' : 'pb-1.5'">
          <p
            class="text-[12px] font-medium whitespace-nowrap text-ink-3"
            :class="[labelClass, props.collapsed && 'h-0']"
          >
            {{ group.label }}
          </p>
          <!--
            折叠态的分隔线：用 SVG + `shape-rendering="crispEdges"`。
            普通 1px 元素在非整数缩放（125%/150%）下会被映射成「1 整行 + 1 行余晖」，看起来像 2px；
            crispEdges 让浏览器把描边吸附到设备像素，各缩放下都只剩 1 行。
            宽度必须显式给（svg 是替换元素，`left/right` 对 `width:auto` 无效 → 会退回 300px 内在宽度）。
            颜色取 line-2（9%）：line-1（6%）在纯黑上只有 1.13:1 看不见，line-4（22%）太抢。
          -->
          <svg
            v-if="props.collapsed"
            class="absolute top-1/2 left-2.5 h-px w-[calc(100%-1.25rem)]"
            shape-rendering="crispEdges"
            aria-hidden="true"
          >
            <rect x="0" y="0" width="100%" height="1" fill="var(--line-2)" shape-rendering="crispEdges" />
          </svg>
        </div>
        <div class="flex flex-col gap-px">
          <InkTooltip
            v-for="item in group.items"
            :key="item.to"
            :content="item.label"
            side="right"
            :disabled="!props.collapsed"
          >
            <NuxtLink :to="item.to" :class="rowClass(isActive(item.to))">
              <component :is="consoleIcon(item.icon)" :class="iconClass(isActive(item.to))" />
              <span :class="labelClass">{{ item.label }}</span>
            </NuxtLink>
          </InkTooltip>
        </div>
      </template>
    </nav>

    <!-- 底部：`设置` 行在账号卡上方（`设置` / `退出登录` 在下拉里也各有一行）；
         导航区吃 `flex-1`，所以这里不需要 `mt-auto` 也能贴在栏底 -->
    <ConsoleUserMenu :collapsed="props.collapsed" @logout="emit('logout')" />
  </div>
</template>
