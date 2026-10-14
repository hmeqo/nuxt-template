<script setup lang="ts">
import { KeyRound, LoaderCircle, Pencil, RefreshCw, Trash2, UserPlus, Users, X } from '@lucide/vue'
import type { CreateUserReq, UserResp } from '@ws/apisdk/types'

definePageMeta({
  title: '用户',
  layout: 'default',
  auth: 'authenticated',
})

const sort = ref<TableSort>(null)
/** 键 = 列 key；空串 = 不筛 */
const filters = ref<Record<string, string>>({})

/**
 * 后端目前只认 page/per_page/username，多出来的 sort/order 会被忽略（`#[serde(default)]`），
 * 等它接上排序就是现成的，前端不用再动。
 */
const queryParams = computed(() => ({
  ...(filters.value.username ? { username: filters.value.username } : {}),
  ...(sort.value ? { sort: sort.value.key, order: sort.value.order } : {}),
}))

const {
  data: users,
  page,
  total,
  pageCount,
  loading,
  error: listError,
  refresh,
} = usePagination(
  (current, size) => Apis.users.list({ params: { page: current, per_page: size, ...queryParams.value } }),
  {
    data: (res) => res.users,
    total: (res) => res.total,
    initialPageSize: 10,
    // 排序或筛选一变，回到第 1 页重新请求
    watchingStates: [sort, filters],
  },
).onFetchError(({ error }) => {
  apiErrorToast('账号列表加载失败', error)
})

/** 刷新（列表已有数据）时按钮上的图标才转，首次加载由表格里的骨架行承担 */
const busy = computed(() => loading.value && users.value.length > 0)

/**
 * 失败信息由表格的失败态承担（apiErrorText 原文 + 下一步），toast 只是旁路提示。
 */
function retryList() {
  fire(refresh())
}

const filtering = computed(() => Boolean(filters.value.username))

const columns: TableColumn<UserResp>[] = [
  { key: 'id', label: 'ID', width: 'w-20', numeric: true, skeleton: 'w-8', sortable: true, cellClass: 'text-ink-2' },
  {
    key: 'username',
    label: '用户名',
    sortable: true,
    filter: { placeholder: '如 de 或 admin' },
    cellClass: 'font-medium',
  },
  {
    key: 'created_at',
    label: '创建时间',
    width: 'w-44',
    numeric: true,
    skeleton: 'w-28',
    sortable: true,
    cellClass: 'text-ink-2',
    text: (user) => formatDateTime(user.created_at, { seconds: false }),
  },
  {
    key: 'updated_at',
    label: '更新时间',
    width: 'w-44',
    numeric: true,
    skeleton: 'w-28',
    sortable: true,
    cellClass: 'text-ink-2',
    text: (user) => formatDateTime(user.updated_at, { seconds: false }),
  },
]

const pagination = computed(() => ({
  page: page.value,
  pageCount: pageCount.value ?? 1,
  total: total.value ?? 0,
  unit: '个账号',
}))

const emptyTitle = computed(() => (filtering.value ? '没有匹配的账号' : '还没有账号'))
const emptyDescription = computed(() =>
  filtering.value
    ? `没有用户名包含「${filters.value.username}」的账号。换个关键词，或新建一个账号。`
    : '新建一个账号后，就能用它登录后台，也会出现在这里。',
)

function clearFilters() {
  filters.value = { ...filters.value, username: '' }
}

/* ---------- 新建 / 编辑 ---------- */

const dialogOpen = ref(false)
const editingUser = ref<UserResp>()
const form = ref($initCreateUserReq())
const formError = ref('')

function openCreate() {
  editingUser.value = undefined
  form.value = $initCreateUserReq()
  formError.value = ''
  dialogOpen.value = true
}

function openRename(user: UserResp) {
  editingUser.value = user
  form.value = $initCreateUserReq({ username: user.username })
  formError.value = ''
  dialogOpen.value = true
}

const { send: createUser, loading: creating } = useRequest(
  (payload: CreateUserReq) => Apis.users.create({ data: payload }),
  { immediate: false },
)
  .onSuccess(({ data }) => {
    toast({ title: `已创建用户 ${data.username}`, description: `ID：${data.id}` })
    dialogOpen.value = false
    refresh()
  })
  .onError(({ error }) => {
    formError.value = apiErrorText(error)
    apiErrorToast('创建失败', error)
  })

const { send: renameUser, loading: renaming } = useRequest(
  (payload: { id: number; username: string }) =>
    Apis.users.update_username({ pathParams: { id: payload.id }, data: { username: payload.username } }),
  { immediate: false },
)
  .onSuccess(({ data }) => {
    toast({ title: `已重命名为 ${data.username}` })
    dialogOpen.value = false
    refresh()
  })
  .onError(({ error }) => {
    formError.value = apiErrorText(error)
    apiErrorToast('重命名失败', error)
  })

const submitting = computed(() => creating.value || renaming.value)

/** 用户名 3-20 个字符；新建时密码 8-32 个字符 */
const canSubmit = computed(() => {
  const username = form.value.username.trim()
  if (username.length < 3 || username.length > 20) return false
  if (editingUser.value) return true
  return form.value.password.length >= 8 && form.value.password.length <= 32
})

function submit() {
  const username = form.value.username.trim()
  if (username.length < 3 || username.length > 20) {
    formError.value = '用户名需为 3-20 个字符'
    return
  }

  if (editingUser.value) {
    if (username === editingUser.value.username) {
      dialogOpen.value = false
      return
    }
    formError.value = ''
    fire(renameUser({ id: editingUser.value.id, username }))
    return
  }

  if (form.value.password.length < 8 || form.value.password.length > 32) {
    formError.value = '密码需为 8-32 个字符'
    return
  }
  formError.value = ''
  fire(createUser({ username, password: form.value.password }))
}

/* ---------- 删除 ---------- */

const deletingUser = ref<UserResp>()

const { send: deleteUser, loading: deleting } = useRequest((id: number) => Apis.users.delete_({ pathParams: { id } }), {
  immediate: false,
})
  .onSuccess(() => {
    toast({ title: `已删除用户 ${deletingUser.value?.username ?? ''}` })
    // 删掉的是当前页最后一条时回退一页（触发重新请求），否则刷新当前页
    if (users.value.length === 1 && page.value > 1) page.value--
    else refresh()
  })
  .onError(({ error }) => apiErrorToast('删除失败', error))

async function openDelete(user: UserResp) {
  if (deleting.value) return

  const answer = await askConfirm({
    title: '删除用户',
    description: `确定删除用户「${user.username}」？此操作不可撤销。`,
    actions: [
      { label: '取消', value: 'cancel' },
      { label: '删除', value: 'confirm', variant: 'destructive' },
    ],
  })
  if (answer !== 'confirm') return

  deletingUser.value = user
  fire(deleteUser(user.id))
}

/* ---------- 重置密码 ---------- */

const resetUser = ref<UserResp>()
const resetOpen = ref(false)
const resetForm = ref($initResetPasswordReq())
const resetConfirm = ref('')
const resetError = ref('')

function openReset(user: UserResp) {
  resetUser.value = user
  resetForm.value = $initResetPasswordReq()
  resetConfirm.value = ''
  resetError.value = ''
  resetOpen.value = true
}

const canReset = computed(
  () =>
    resetForm.value.new_password.length >= 8 &&
    resetForm.value.new_password.length <= 32 &&
    resetForm.value.new_password === resetConfirm.value,
)

const { send: resetPassword, loading: resetting } = useRequest(
  (payload: { id: number; password: string }) =>
    Apis.users.reset_password({ pathParams: { id: payload.id }, data: { new_password: payload.password } }),
  { immediate: false },
)
  .onSuccess(() => {
    toast({ title: `已重置「${resetUser.value?.username ?? ''}」的密码` })
    resetOpen.value = false
  })
  .onError(({ error }) => {
    resetError.value = apiErrorText(error)
    apiErrorToast('重置失败', error)
  })

function submitReset() {
  if (!resetUser.value) return

  const password = resetForm.value.new_password
  if (password.length < 8 || password.length > 32) {
    resetError.value = '密码需为 8-32 个字符'
    return
  }
  if (password !== resetConfirm.value) {
    resetError.value = '两次输入的密码不一致'
    return
  }

  resetError.value = ''
  fire(resetPassword({ id: resetUser.value.id, password }))
}

/** 行操作：只写这一份，`InkDataTable` 同时挂到右键菜单和行尾 `···` 上 */
function rowActions(user: UserResp): TableAction<UserResp>[] {
  return [
    { key: 'rename', label: '编辑', icon: Pencil, variant: 'default', run: () => openRename(user) },
    {
      key: 'reset',
      label: '重置密码',
      icon: KeyRound,
      variant: 'default',
      run: () => openReset(user),
    },
    { key: 'delete', label: '删除', icon: Trash2, variant: 'destructive', run: () => openDelete(user) },
  ]
}
</script>

<template>
  <div class="space-y-5">
    <InkPageHeader title="用户" description="本机注册的账号，可用来登录后台。">
      <template #action>
        <UiButton @click="openCreate">
          <UserPlus />
          新建用户
        </UiButton>
      </template>
    </InkPageHeader>

    <div class="flex flex-wrap items-center gap-2">
      <UiButton variant="outline" class="ml-auto" :disabled="loading" @click="refresh()">
        <RefreshCw :class="busy && 'animate-spin'" />
        刷新
      </UiButton>
    </div>

    <InkDataTable
      :rows="users"
      :columns="columns"
      :row-key="(user) => user.id"
      :actions="rowActions"
      :loading="loading"
      :error="listError"
      :error-text="listError ? apiErrorText(listError) : undefined"
      error-title="账号列表加载失败"
      :empty-title="emptyTitle"
      :empty-description="emptyDescription"
      :empty-icon="Users"
      :pagination="pagination"
      :sort="sort"
      :filters="filters"
      @update:sort="sort = $event"
      @update:filters="filters = $event"
      @update:page="page = $event"
      @retry="retryList()"
    >
      <template #empty-action>
        <div class="flex flex-wrap items-center justify-center gap-2">
          <UiButton v-if="filtering" variant="outline" @click="clearFilters()">
            <X />
            清空筛选
          </UiButton>
          <UiButton @click="openCreate">
            <UserPlus />
            新建用户
          </UiButton>
        </div>
      </template>
    </InkDataTable>

    <UiDialog v-model:open="dialogOpen">
      <UiDialogContent class="sm:max-w-sm">
        <UiDialogHeader>
          <UiDialogTitle>{{ editingUser ? '编辑用户' : '新建用户' }}</UiDialogTitle>
          <UiDialogDescription>
            {{
              editingUser
                ? `修改「${editingUser.username}」的用户名，改完即可用新用户名登录。`
                : '创建一个可以登录后台的本地账号。'
            }}
          </UiDialogDescription>
        </UiDialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-2">
            <UiLabel for="user-username">用户名</UiLabel>
            <UiInput
              id="user-username"
              v-model="form.username"
              maxlength="20"
              placeholder="3-20 个字符"
              @keyup.enter="submit()"
            />
          </div>

          <div v-if="!editingUser" class="space-y-2">
            <UiLabel for="user-password">密码</UiLabel>
            <UiInput
              id="user-password"
              v-model="form.password"
              type="password"
              maxlength="32"
              placeholder="8-32 个字符"
              autocomplete="new-password"
              @keyup.enter="submit()"
            />
          </div>

          <p v-if="formError" class="text-xs text-bad">{{ formError }}</p>
        </div>

        <UiDialogFooter>
          <UiDialogClose as-child>
            <UiButton variant="outline" :disabled="submitting">取消</UiButton>
          </UiDialogClose>
          <UiButton :disabled="submitting || !canSubmit" @click="submit()">
            <LoaderCircle v-if="submitting" class="size-4 animate-spin" />
            {{ editingUser ? '保存' : '创建' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>

    <UiDialog v-model:open="resetOpen">
      <UiDialogContent class="sm:max-w-sm">
        <UiDialogHeader>
          <UiDialogTitle>重置密码</UiDialogTitle>
          <UiDialogDescription>为「{{ resetUser?.username }}」设置新密码，旧密码立即失效。</UiDialogDescription>
        </UiDialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-2">
            <UiLabel for="reset-password">新密码</UiLabel>
            <UiInput
              id="reset-password"
              v-model="resetForm.new_password"
              type="password"
              maxlength="32"
              placeholder="8-32 个字符"
              autocomplete="new-password"
              @keyup.enter="submitReset()"
            />
          </div>

          <div class="space-y-2">
            <UiLabel for="reset-confirm">确认新密码</UiLabel>
            <UiInput
              id="reset-confirm"
              v-model="resetConfirm"
              type="password"
              maxlength="32"
              placeholder="再输入一次"
              autocomplete="new-password"
              @keyup.enter="submitReset()"
            />
          </div>

          <p v-if="resetError" class="text-xs text-bad">{{ resetError }}</p>
        </div>

        <UiDialogFooter>
          <UiDialogClose as-child>
            <UiButton variant="outline" :disabled="resetting">取消</UiButton>
          </UiDialogClose>
          <UiButton :disabled="resetting || !canReset" @click="submitReset()">
            <LoaderCircle v-if="resetting" class="size-4 animate-spin" />
            重置
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
