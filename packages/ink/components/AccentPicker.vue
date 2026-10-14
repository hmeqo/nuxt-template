<script setup lang="ts">
const accent = useInkAccent()
</script>

<template>
  <InkSegmented v-model="accent" :options="INK_ACCENTS" aria-label="强调色" />
</template>
