<script setup lang="ts">
definePageMeta({
  layout: 'default',
  auth: 'authenticated',
  title: '设置',
})
</script>

<template>
  <div class="space-y-5">
    <InkPageHeader title="设置" description="管理账号、外观与会话安全" />

    <ConsoleAccountCard />
    <InkAppearanceCard />
    <ConsoleSessionCard />
  </div>
</template>
