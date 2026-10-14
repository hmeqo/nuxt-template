<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: 'anonymous',
  title: '登录',
})
</script>

<template>
  <ConsoleLoginCard subtitle="使用管理员账号登录" footer="遇到问题请联系系统管理员" />
</template>
