<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    email: z.email({ message: '请输入有效的邮箱地址' }),
    password: z.string({ message: '请输入密码' }).min(6, { message: '密码至少需要6个字符' }),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values)
})
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <UiCard class="mx-auto max-w-sm w-full">
      <UiCardHeader>
        <UiCardTitle class="text-2xl">登录</UiCardTitle>
        <UiCardDescription>输入您的邮箱以登录账户</UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <form class="grid gap-4" @submit="onSubmit">
          <UiFormField v-slot="{ componentField }" name="email">
            <UiFormItem>
              <UiFormLabel>邮箱</UiFormLabel>
              <UiFormControl>
                <UiInput type="email" placeholder="m@example.com" v-bind="componentField" />
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
                <UiInput type="password" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiButton type="submit" class="w-full">登录</UiButton>
          <UiButton variant="outline" class="w-full">使用 Google 登录</UiButton>
        </form>
        <div class="mt-4 text-center text-sm">
          还没有账户?
          <a href="#" class="underline">注册</a>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
