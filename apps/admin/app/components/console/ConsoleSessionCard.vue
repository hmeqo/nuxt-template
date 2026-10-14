<script setup lang="ts">
import { ShieldCheck } from '@lucide/vue'

/** 登录态由后端滑动续期（剩余不足半个 TTL 时自动续、并重发 cookie） */
const { data: sessions } = useRequest(() => Apis.auth.sessions(), { immediate: true }).onError(({ error }) =>
  apiErrorToast('会话信息加载失败', error),
)

const current = computed(() => sessions.value?.sessions.find((session) => session.current))
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="flex items-center gap-2">
        <ShieldCheck class="size-3.5 text-ink-2" />
        会话与安全
      </UiCardTitle>
      <UiCardDescription>登录状态随使用自动延长</UiCardDescription>
    </UiCardHeader>
    <UiCardContent>
      <div class="space-y-1">
        <p class="text-xs text-ink-3">到期时间</p>
        <p class="num text-sm">{{ current ? formatDateTime(current.expires_at) : '—' }}</p>
      </div>
    </UiCardContent>
  </UiCard>
</template>
