import {
  commands,
  type AppInfo,
  type Document,
  type IpcError,
  type RecentDocument,
  type Result,
} from '@ws/tauri/lib/binding'

export interface WorkspaceTab {
  id: string
  /** 未保存的新建文档没有路径 */
  path: string | null
  title: string
  text: string
  /** 上次落盘的内容，用来判脏 */
  saved: string
  size: number
  modifiedMs: number | null
}

export interface CursorPosition {
  line: number
  column: number
}

const tabs = ref<WorkspaceTab[]>([])
const activeId = ref<string | null>(null)
const recents = ref<RecentDocument[]>([])
const appInfo = ref<AppInfo | null>(null)
const cursor = ref<CursorPosition>({ line: 1, column: 1 })

const active = computed(() => tabs.value.find((tab) => tab.id === activeId.value) ?? null)
const dirty = computed(() => !!active.value && active.value.text !== active.value.saved)

let untitled = 0
let started = false

/**
 * 桌面壳的工作区（模块级单例，布局和页面共用同一份）。
 * 读写都在 Rust 侧，这里只排队标签页、判脏、以及把错误翻成提示。
 */
export function useWorkspace() {
  if (started) return workspace
  started = true

  onMounted(loadWorkspace)
  useDragDrop((paths) => {
    for (const path of paths) void openPath(path)
  })

  return workspace
}

const workspace = {
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
}

async function loadWorkspace() {
  if (!isTauri) return

  try {
    appInfo.value = await commands.appInfo()
    await refreshRecents()
  } catch (error) {
    report(error)
  }
}

async function refreshRecents() {
  recents.value = await commands.recentDocuments()
}

async function clearRecents() {
  if (!requireDesktop()) return

  try {
    await ipc(() => commands.clearRecents())
    recents.value = []
  } catch (error) {
    report(error)
  }
}

async function openFile() {
  if (!requireDesktop()) return

  try {
    const document = await ipc(() => commands.openDocument())
    // 用户在系统选择器里点了取消
    if (!document) return

    adopt(document)
    await refreshRecents()
  } catch (error) {
    report(error)
  }
}

async function openPath(path: string) {
  if (!requireDesktop()) return

  try {
    adopt(await ipc(() => commands.openPath(path)))
    await refreshRecents()
  } catch (error) {
    report(error)
  }
}

function newTab() {
  untitled += 1

  const tab: WorkspaceTab = {
    id: `untitled-${untitled}`,
    path: null,
    title: `未命名 ${untitled}`,
    text: '',
    saved: '',
    size: 0,
    modifiedMs: null,
  }

  tabs.value.push(tab)
  activeId.value = tab.id
}

function selectTab(id: string) {
  activeId.value = id
}

/** 返回是否真的落盘（「保存并关闭」要靠它决定能不能关）。 */
async function save(): Promise<boolean> {
  const tab = active.value
  if (!tab) return false
  if (!requireDesktop()) return false

  const path = tab.path
  if (!path) return saveAs()

  return persist(tab, () => commands.saveDocument(path, tab.text))
}

async function saveAs(): Promise<boolean> {
  const tab = active.value
  if (!tab) return false
  if (!requireDesktop()) return false

  return persist(tab, () => commands.saveDocumentAs(tab.text, tab.path ? tab.title : null))
}

/** 存盘共用的收尾：取回文档（可能来自「另存为」的新文件名）、刷新最近列表。 */
async function persist(tab: WorkspaceTab, run: () => Promise<Result<Document | null, IpcError>>) {
  try {
    const document = await ipc(run)
    // 系统保存对话框里点了取消
    if (!document) return false

    applyDocument(tab, document)
    await refreshRecents()
    return true
  } catch (error) {
    report(error)
    return false
  }
}

async function closeTab(id: string) {
  const tab = tabs.value.find((item) => item.id === id)
  if (!tab) return

  if (tab.text !== tab.saved) {
    activeId.value = id

    const answer = await askConfirm({
      title: `要保存「${tab.title}」的修改吗？`,
      description: '不保存就会丢掉这次的改动。',
      actions: [
        { label: '取消', value: 'cancel', variant: 'outline' },
        { label: '不保存', value: 'discard', variant: 'destructive' },
        { label: '保存', value: 'save', variant: 'default' },
      ],
    })

    if (answer === 'cancel') return
    if (answer === 'save' && !(await save())) return
  }

  const index = tabs.value.indexOf(tab)
  tabs.value.splice(index, 1)

  if (activeId.value === tab.id) {
    activeId.value = (tabs.value[index - 1] ?? tabs.value[index] ?? tabs.value.at(-1))?.id ?? null
  }
}

async function quit() {
  if (!isTauri) return
  await commands.quit()
}

/** 同一路径只留一个标签页：再打开就是重新读一遍内容。 */
function adopt(document: Document) {
  const existing = tabs.value.find((tab) => tab.path !== null && tab.path === document.path)

  if (existing) {
    applyDocument(existing, document)
    activeId.value = existing.id
    return
  }

  const tab: WorkspaceTab = {
    id: `doc:${document.path}`,
    path: document.path,
    title: document.name,
    text: document.text,
    saved: document.text,
    size: document.size,
    modifiedMs: document.modifiedMs,
  }

  tabs.value.push(tab)
  activeId.value = tab.id
}

function applyDocument(tab: WorkspaceTab, document: Document) {
  tab.path = document.path
  tab.title = document.name
  tab.text = document.text
  tab.saved = document.text
  tab.size = document.size
  tab.modifiedMs = document.modifiedMs
}

function report(error: unknown) {
  toast({
    title: '操作失败',
    description: error instanceof Error ? error.message : String(error),
    variant: 'destructive',
  })
}
