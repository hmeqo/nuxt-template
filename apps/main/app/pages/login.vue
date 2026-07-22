<script setup lang="ts">
import { Loader2, Globe } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from '~/components/uix/toast'

definePageMeta({
  layout: 'auth',
})

const form = ref($initLoginReq())

const formSchema = toTypedSchema(
  z.object({
    username: z.string({ message: '请输入用户名' }).min(1, { message: '用户名不能为空' }),
    password: z.string({ message: '请输入密码' }).min(1, { message: '密码至少需要1个字符' }),
  }),
)

const { send: login, loading } = useRequest(() => Apis.auth.login({ data: form.value }), { immediate: false })
  .onSuccess(({ data }) => {
    useAuthState().login(data)
    toast({ title: '登录成功' })
    navigateTo(getHomeUrl())
  })
  .onError(() => {
    toast({ title: '登录失败', description: '用户名或密码错误', variant: 'destructive' })
  })
</script>

<template>
  <UiCard class="mx-auto w-full max-w-sm">
    <UiCardHeader class="text-center">
      <div class="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">
        A
      </div>
      <UiCardTitle class="text-xl">Welcome back</UiCardTitle>
      <UiCardDescription>Sign in to your account to continue</UiCardDescription>
    </UiCardHeader>
    <UiCardContent>
      <UiForm class="grid gap-4" :validation-schema="formSchema" @submit="login">
        <UiFormField v-slot="{ componentField }" name="username">
          <UiFormItem>
            <UiFormLabel>Username</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" v-model="form.username" type="text" placeholder="Enter your username" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="password">
          <UiFormItem>
            <div class="flex items-center">
              <UiFormLabel>Password</UiFormLabel>
              <a href="#" class="ml-auto inline-block text-xs text-muted-foreground hover:text-foreground transition-colors">Forgot password?</a>
            </div>
            <UiFormControl>
              <UiInput v-bind="componentField" v-model="form.password" type="password" placeholder="Enter your password" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiButton type="submit" class="w-full" :disabled="loading">
          <Loader2 v-if="loading" class="size-4 mr-2 animate-spin" />
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </UiButton>
      </UiForm>
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <UiButton variant="outline" class="mt-4 w-full">
          <Globe class="size-4 mr-2" />
          Google
        </UiButton>
      </div>
      <p class="mt-6 text-center text-xs text-muted-foreground">
        Don't have an account?
        <a href="#" class="text-foreground underline underline-offset-4 hover:text-primary transition-colors">Sign up</a>
      </p>
    </UiCardContent>
  </UiCard>
</template>
