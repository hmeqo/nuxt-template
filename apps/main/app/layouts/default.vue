<script setup lang="ts">
import {
  Clock,
  FileOutput,
  FilePlus,
  FolderOpen,
  Info,
  Link,
  Minus,
  Moon,
  PanelLeft,
  PanelRight,
  Power,
  RotateCcw,
  Save,
  Square,
  Sun,
  TextWrap,
  X,
  ZoomIn,
  ZoomOut,
} from '@lucide/vue'
import { commands } from '@ws/tauri/lib/binding'
import { menuActions, shortcutMatches, type DesktopMenu, type DesktopMenuAction, type DesktopTab } from '~/lib/desktop'

/**
 * 文档状态在 `useWorkspace()`（模块级单例），页面里读的是同一份。
 */
const appConfig = useAppConfig()
const { darkMode } = useThemeMode()
const { minimize, toggleMaximize, close, setTitle } = useWindowControls()

const {
  tabs,
  active,
  activeId,
  dirty,
  recents,
  appInfo,
  cursor,
  openFile,
  openPath,
  newTab,
  selectTab,
  save,
  saveAs,
  closeTab,
  clearRecents,
  quit,
} = useWorkspace()

const sidebar = useCookieState<boolean>('desktop-sidebar', { default: () => true })
const dock = useCookieState<boolean>('desktop-dock', { default: () => true })
const { wrap, fontSize } = useEditorPrefs()

const showAppearance = ref(true)
const showEditor = ref(true)
const showApp = ref(true)

const fontSizeOptions = [
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '16', label: '16' },
]

/** 「应用」面板的行；信息来自 Rust，浏览器里拿不到就整块换成提示 */
const appRows = computed(() => {
  const info = appInfo.value
  if (!info) return []

  return [
    { key: '名称', value: info.name },
    { key: '版本', value: info.version },
    { key: '标识', value: info.identifier },
    { key: '运行时', value: `Tauri ${info.tauriVersion}` },
    { key: '平台', value: `${info.os}/${info.arch}` },
  ]
})

const appName = computed(() => appConfig.app?.name ?? 'App')

/** 标签条只关心标题/脏标记，正文留在工作区里，别把整份文本传进 chrome。 */
const tabViews = computed<DesktopTab[]>(() =>
  tabs.value.map((tab) => ({
    id: tab.id,
    title: tab.title,
    path: tab.path,
    dirty: tab.text !== tab.saved,
  })),
)

/** 菜单定义也是快捷键表：`shortcut` 只写一次，展示和键盘派发都读它。 */
const menus = computed<DesktopMenu[]>(() => {
  const hasDocument = !!active.value

  return [
    {
      label: '文件',
      items: [
        { id: 'file.new', label: '新建', shortcut: 'mod+N', icon: FilePlus },
        { id: 'file.open', label: '打开…', shortcut: 'mod+O', icon: FolderOpen },
        { separator: true },
        { id: 'file.save', label: '保存', shortcut: 'mod+S', icon: Save, disabled: !hasDocument },
        { id: 'file.saveAs', label: '另存为…', shortcut: 'mod+⇧S', icon: FileOutput, disabled: !hasDocument },
        { separator: true },
        { id: 'file.close', label: '关闭标签页', shortcut: 'mod+W', icon: X, disabled: !hasDocument },
        { separator: true },
        { id: 'file.quit', label: '退出', shortcut: 'mod+Q', icon: Power },
      ],
    },
    {
      label: '视图',
      items: [
        { id: 'view.sidebar', label: '侧栏', shortcut: 'mod+B', icon: PanelLeft, checked: sidebar.value },
        { id: 'view.dock', label: '面板', shortcut: 'mod+J', icon: PanelRight, checked: dock.value },
        { separator: true },
        { id: 'view.wrap', label: '自动换行', icon: TextWrap, checked: wrap.value },
        { separator: true },
        { id: 'view.fontUp', label: '增大字号', shortcut: 'mod+=', icon: ZoomIn },
        { id: 'view.fontDown', label: '减小字号', shortcut: 'mod+-', icon: ZoomOut },
        { id: 'view.fontReset', label: '默认字号', shortcut: 'mod+0', icon: RotateCcw },
        { separator: true },
        { id: 'view.theme', label: darkMode.value ? '切到浅色' : '切到深色', icon: darkMode.value ? Sun : Moon },
      ],
    },
    {
      label: '窗口',
      items: [
        { id: 'window.minimize', label: '最小化', shortcut: 'mod+M', icon: Minus },
        { id: 'window.maximize', label: '最大化 / 还原', icon: Square },
        { separator: true },
        { id: 'window.close', label: '关闭窗口', icon: X },
      ],
    },
    {
      label: '帮助',
      items: [
        { id: 'help.about', label: `关于 ${appName.value}`, icon: Info },
        { id: 'help.homepage', label: '项目主页', icon: Link },
      ],
    },
  ]
})

/** id → 动作；`menus` 里出现的每个 id 都得在这里落地。 */
const menuHandlers: Record<string, () => unknown> = {
  'file.new': newTab,
  'file.open': openFile,
  'file.save': save,
  'file.saveAs': saveAs,
  'file.close': () => (activeId.value ? closeTab(activeId.value) : undefined),
  'file.quit': quit,
  'view.sidebar': () => (sidebar.value = !sidebar.value),
  'view.dock': () => (dock.value = !dock.value),
  'view.wrap': () => (wrap.value = !wrap.value),
  'view.fontUp': () => (fontSize.value = Math.min(24, fontSize.value + 1)),
  'view.fontDown': () => (fontSize.value = Math.max(10, fontSize.value - 1)),
  'view.fontReset': () => (fontSize.value = 13),
  'view.theme': () => (darkMode.value = !darkMode.value),
  'window.minimize': minimize,
  'window.maximize': toggleMaximize,
  'window.close': close,
  'help.about': showAbout,
  'help.homepage': openHomepage,
}

const shortcutTargets = computed(() =>
  menuActions(menus.value).filter(
    (entry): entry is DesktopMenuAction & { shortcut: string } => !!entry.shortcut && !entry.disabled,
  ),
)

function runMenu(id: string) {
  void menuHandlers[id]?.()
}

function onKeydown(event: KeyboardEvent) {
  const target = shortcutTargets.value.find((entry) => shortcutMatches(entry.shortcut, event))
  if (!target) return

  event.preventDefault()
  runMenu(target.id)
}

function showAbout() {
  const info = appInfo.value

  return askConfirm({
    title: `关于 ${appName.value}`,
    description: info
      ? `版本 ${info.version}\n标识 ${info.identifier}\n运行时 Tauri ${info.tauriVersion}\n平台 ${info.os}/${info.arch}`
      : '还没从 Rust 侧取到应用信息（浏览器里没有这个命令）。',
    actions: [{ label: '好', value: 'ok', variant: 'default' }],
  })
}

async function openHomepage() {
  const homepage = appConfig.app?.homepage
  if (!isTauri || !homepage) return

  await ipc(() => commands.openExternal(homepage))
}

watchEffect(() => {
  const title = active.value ? `${dirty.value ? '• ' : ''}${active.value.title} — ${appName.value}` : appName.value
  void setTitle(title)
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <DesktopShell
    v-model:sidebar="sidebar"
    v-model:dock="dock"
    :app-name="appName"
    :menus="menus"
    :tabs="tabViews"
    :active-id="activeId"
    @menu-select="runMenu"
    @tab-select="selectTab"
    @tab-close="closeTab"
    @tab-create="newTab"
  >
    <template #sidebar>
      <div class="flex h-8 shrink-0 items-center gap-2 pr-2 pl-3 select-none">
        <span class="flex-1 text-[11px] font-medium tracking-[0.04em] text-ink-3 uppercase">最近打开</span>
        <button
          v-if="recents.length"
          type="button"
          class="rounded px-1 text-[11px] text-ink-4 transition-colors hover:text-ink-1"
          @click="clearRecents"
        >
          清空
        </button>
      </div>

      <div class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
        <button
          v-for="item in recents"
          :key="item.path"
          type="button"
          class="flex flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-line-1"
          @click="openPath(item.path)"
        >
          <span class="truncate text-[12.5px] text-ink-1">{{ item.name }}</span>
          <span class="truncate font-mono text-[11px] text-ink-4">{{ item.path }}</span>
        </button>

        <InkEmptyState
          v-if="!recents.length"
          :icon="Clock"
          title="还没有打开过文件"
          description="从「文件 → 打开」选一个，或把文件直接拖进窗口。"
        >
          <template #action>
            <UiButton size="sm" variant="outline" @click="openFile">打开文件…</UiButton>
          </template>
        </InkEmptyState>
      </div>
    </template>

    <slot />

    <template #dock>
      <DesktopPanel v-model:open="showAppearance" title="外观">
        <InkThemePicker />
        <InkAccentPicker />
      </DesktopPanel>

      <DesktopPanel v-model:open="showEditor" title="编辑器">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[12.5px] text-ink-2">字号</span>
          <InkSegmented
            :model-value="String(fontSize)"
            :options="fontSizeOptions"
            aria-label="字号"
            @update:model-value="fontSize = Number($event)"
          />
        </div>

        <div class="flex items-center justify-between gap-2">
          <span class="text-[12.5px] text-ink-2">自动换行</span>
          <UiSwitch v-model="wrap" size="sm" aria-label="自动换行" />
        </div>
      </DesktopPanel>

      <DesktopPanel v-model:open="showApp" title="应用">
        <dl v-if="appRows.length" class="flex flex-col gap-1.5 text-[12.5px]">
          <div v-for="row in appRows" :key="row.key" class="flex items-baseline justify-between gap-3">
            <dt class="text-ink-3">{{ row.key }}</dt>
            <dd class="truncate font-mono text-[11.5px] text-ink-2">{{ row.value }}</dd>
          </div>
        </dl>
        <p v-else class="text-[12.5px] text-ink-4">仅在桌面端可用。</p>
      </DesktopPanel>
    </template>

    <template #status>
      <span class="truncate">
        {{ active?.path ?? (active ? '未命名文档' : '没有打开的文档') }}
      </span>
      <span v-if="dirty" class="text-warn">未保存</span>
      <span v-if="active" class="num">{{ formatSize(active.size) }}</span>
    </template>

    <template #status-end>
      <span v-if="active" class="num">行 {{ cursor.line }}，列 {{ cursor.column }}</span>
      <span v-if="appInfo" class="num">{{ appInfo.name }} {{ appInfo.version }}</span>
      <span v-if="appInfo" class="num">{{ appInfo.os }}/{{ appInfo.arch }}</span>
    </template>
  </DesktopShell>
</template>
