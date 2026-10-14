<script setup lang="ts">
import { LoaderCircle, Lock, User } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const props = defineProps<{
  subtitle?: string
  footer?: string
}>()

const { name } = useConsoleNav()
const form = ref($initLoginReq())

const formSchema = toTypedSchema(
  z.object({
    username: z.string({ message: '请输入用户名' }).min(1, { message: '用户名不能为空' }),
    password: z.string({ message: '请输入密码' }).min(1, { message: '密码不能为空' }),
  }),
)

const { send: login, loading } = useRequest(() => Apis.auth.login({ data: form.value }), { immediate: false })
  .onSuccess(({ data }) => {
    useAuthState().login(data)
    toast({ title: '登录成功' })
    navigateTo(getHomeUrl())
  })
  .onError(({ error }) => {
    apiErrorToast('登录失败', error)
  })
</script>

<template>
  <div class="relative w-full max-w-95">
    <div class="ambient" />

    <div class="relative">
      <div class="mb-8 flex items-center justify-center gap-2.5">
        <InkBrand class="h-9 w-9" />
        <span class="text-[22px] font-semibold tracking-[-0.02em]">{{ name }}</span>
      </div>

      <div class="rounded-2xl border border-line-2 bg-panel/80 p-7 shadow-(--shadow-3) backdrop-blur">
        <div class="mb-6">
          <h2 class="text-[22px] font-semibold tracking-[-0.02em]">登录</h2>
          <p class="mt-1 text-sm text-ink-3">{{ props.subtitle || '请输入您的账号信息' }}</p>
        </div>

        <UiForm class="space-y-4" :validation-schema="formSchema" @submit="fire(login())">
          <UiFormField v-slot="{ componentField }" name="username">
            <UiFormItem class="space-y-2">
              <UiFormLabel>用户名</UiFormLabel>
              <UiFormControl>
                <div class="relative">
                  <User class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-3" />
                  <UiInput
                    v-bind="componentField"
                    v-model="form.username"
                    placeholder="输入用户名"
                    autocomplete="username"
                    class="h-7.5 pl-9"
                  />
                </div>
              </UiFormControl>
              <UiFormMessage class="text-xs text-bad" />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem class="space-y-2">
              <UiFormLabel>密码</UiFormLabel>
              <UiFormControl>
                <div class="relative">
                  <Lock class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-3" />
                  <UiInput
                    v-bind="componentField"
                    v-model="form.password"
                    type="password"
                    placeholder="输入密码"
                    autocomplete="current-password"
                    class="h-7.5 pl-9"
                  />
                </div>
              </UiFormControl>
              <UiFormMessage class="text-xs text-bad" />
            </UiFormItem>
          </UiFormField>

          <UiButton type="submit" class="w-full" :disabled="loading">
            <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />
            {{ loading ? '登录中...' : '登录' }}
          </UiButton>
        </UiForm>
      </div>

      <p v-if="props.footer" class="mt-6 text-center text-xs text-ink-3">{{ props.footer }}</p>
    </div>
  </div>
</template>
