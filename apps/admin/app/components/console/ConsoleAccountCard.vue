<script setup lang="ts">
import { KeyRound, Pencil, UserCircle } from '@lucide/vue'
import type { ChangePasswordReq, UpdateUsernameReq } from '@ws/apisdk/types'

const authState = useAuthState()
const authPerms = useAuthPerms()

const user = computed(() => authState.user())

/** `*` 是通配权限，对人来说是「全部权限」；其余按标识符原样列出（等宽字体） */
const perms = computed(() => authPerms.perms.value)
const isSuperUser = computed(() => perms.value.includes('*'))
const permissionBadges = computed(() => (isSuperUser.value ? ['全部权限'] : perms.value))
const permissionMono = computed(() => !!perms.value.length && !isSuperUser.value)

const usernameOpen = ref(false)
const usernameForm = ref($initUpdateUsernameReq({ username: user.value?.username ?? '' }))

const { send: saveUsername, loading: savingUsername } = useRequest(
  (payload: UpdateUsernameReq) =>
    Apis.users.update_username({ pathParams: { id: user.value?.id ?? 0 }, data: payload }),
  { immediate: false },
)
  .onSuccess(({ data }) => {
    const state = authState.state()
    if (state) authState.login({ ...state, user: data })
    usernameForm.value.username = data.username
    usernameOpen.value = false
    toast({ title: '用户名已更新' })
  })
  .onError(({ error }) => apiErrorToast('更新失败', error))

function openUsername() {
  usernameForm.value.username = user.value?.username ?? ''
  usernameOpen.value = true
}

function submitUsername() {
  if (!user.value) return
  if (!usernameForm.value.username) return toast({ title: '用户名不能为空', variant: 'destructive' })
  fire(saveUsername(usernameForm.value))
}

const pwdOpen = ref(false)
const passwordForm = ref($initChangePasswordReq())
const passwordConfirm = ref('')

const { send: changePassword, loading: changingPassword } = useRequest(
  (payload: ChangePasswordReq) => Apis.auth.change_password({ data: payload }),
  { immediate: false },
)
  .onSuccess(() => {
    passwordForm.value = $initChangePasswordReq()
    passwordConfirm.value = ''
    pwdOpen.value = false
    toast({ title: '密码已修改' })
  })
  .onError(({ error }) => apiErrorToast('修改失败', error))

function openPassword() {
  passwordForm.value = $initChangePasswordReq()
  passwordConfirm.value = ''
  pwdOpen.value = true
}

function submitPassword() {
  if (!passwordForm.value.old_password || !passwordForm.value.new_password) {
    return toast({ title: '请填写当前密码与新密码', variant: 'destructive' })
  }
  if (passwordForm.value.new_password !== passwordConfirm.value) {
    return toast({ title: '两次输入的新密码不一致', variant: 'destructive' })
  }
  fire(changePassword(passwordForm.value))
}
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="flex items-center gap-2">
        <UserCircle class="size-3.5 text-ink-2" />
        账号
      </UiCardTitle>
      <UiCardDescription>当前登录账号信息</UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="space-y-4">
      <div class="flex items-center gap-3">
        <UiAvatar class="size-12">
          <UiAvatarFallback class="text-sm">{{ (user?.username ?? '?').slice(0, 2).toUpperCase() }}</UiAvatarFallback>
        </UiAvatar>
        <div class="min-w-0">
          <div class="truncate text-sm font-medium">{{ user?.username ?? '—' }}</div>
          <div class="truncate text-xs text-ink-2">
            ID: <span class="num">{{ user?.id ?? '—' }}</span> · 注册于 {{ formatDateTime(user?.created_at) }}
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <InkBadge
          v-for="perm in permissionBadges"
          :key="perm"
          :tone="isSuperUser ? 'brand' : 'neutral'"
          :class="permissionMono && 'mono'"
        >
          {{ perm }}
        </InkBadge>
        <InkBadge v-if="!permissionBadges.length">无权限</InkBadge>
      </div>

      <div class="flex flex-wrap gap-2 border-t pt-4">
        <UiButton variant="outline" @click="openUsername">
          <Pencil />
          修改用户名
        </UiButton>
        <UiButton variant="outline" @click="openPassword">
          <KeyRound />
          修改密码
        </UiButton>
      </div>
    </UiCardContent>
  </UiCard>

  <UiDialog v-model:open="usernameOpen">
    <UiDialogContent class="sm:max-w-sm">
      <UiDialogHeader>
        <UiDialogTitle>修改用户名</UiDialogTitle>
      </UiDialogHeader>
      <div class="space-y-3 py-2">
        <UiInput
          v-model="usernameForm.username"
          placeholder="3-20 个字符"
          autocomplete="username"
          :disabled="savingUsername"
          @keyup.enter="submitUsername()"
        />
      </div>
      <UiDialogFooter>
        <UiDialogClose as-child>
          <UiButton variant="outline">取消</UiButton>
        </UiDialogClose>
        <UiButton :disabled="savingUsername" @click="submitUsername()">
          {{ savingUsername ? '保存中…' : '确认修改' }}
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>

  <UiDialog v-model:open="pwdOpen">
    <UiDialogContent class="sm:max-w-sm">
      <UiDialogHeader>
        <UiDialogTitle>修改密码</UiDialogTitle>
      </UiDialogHeader>
      <div class="space-y-3 py-2">
        <UiInput
          v-model="passwordForm.old_password"
          type="password"
          placeholder="原密码"
          autocomplete="current-password"
        />
        <UiInput
          v-model="passwordForm.new_password"
          type="password"
          placeholder="新密码（8-32 个字符）"
          autocomplete="new-password"
        />
        <UiInput
          v-model="passwordConfirm"
          type="password"
          placeholder="确认新密码"
          autocomplete="new-password"
          @keyup.enter="submitPassword()"
        />
      </div>
      <UiDialogFooter>
        <UiDialogClose as-child>
          <UiButton variant="outline">取消</UiButton>
        </UiDialogClose>
        <UiButton :disabled="changingPassword" @click="submitPassword()">
          {{ changingPassword ? '修改中…' : '确认修改' }}
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
