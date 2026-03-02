<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from '~/components/ui/toast'
import type { LoginRequest } from '~/types'

definePageMeta({
  middleware: ['login'],
  layout: false,
})

const form = ref<LoginRequest>({
  username: '',
  password: '',
})

const formSchema = toTypedSchema(
  z.object({
    username: z.string({ message: '请输入用户名' }).min(1, { message: '用户名不能为空' }),
    password: z.string({ message: '请输入密码' }).min(1, { message: '密码至少需要1个字符' }),
  }),
)

const { send: login, loading } = useRequest(() => Apis.auth.login({ data: form.value }), { immediate: false })

const onSubmit = async () => {
  try {
    const result = await login()
    useAuthState().login(result.state)
    toast({ title: '登录成功' })
    navigateTo(getHomeUrl())
  } catch (error) {
    toast({ title: '登录失败', description: '用户名或密码错误', variant: 'destructive' })
  }
}
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <UiCard class="mx-auto max-w-sm w-full">
      <UiCardHeader>
        <UiCardTitle class="text-2xl">登录</UiCardTitle>
        <UiCardDescription>输入您的用户名和密码以登录账户</UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <UiForm class="grid gap-4" :validation-schema="formSchema" @submit="onSubmit">
          <UiFormField v-slot="{ componentField }" name="username">
            <UiFormItem>
              <UiFormLabel>用户名</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" v-model="form.username" type="text" placeholder="请输入用户名" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem>
              <div class="flex items-center">
                <UiFormLabel>密码</UiFormLabel>
                <a href="#" class="ml-auto inline-block text-sm underline">忘记密码?</a>
              </div>
              <UiFormControl>
                <UiInput v-bind="componentField" v-model="form.password" type="password" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiButton type="submit" class="w-full" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</UiButton>
          <UiButton variant="outline" class="w-full">使用 Google 登录</UiButton>
        </UiForm>
        <div class="mt-4 text-center text-sm">
          还没有账户?
          <a href="#" class="underline">注册</a>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
