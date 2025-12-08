<script setup lang="ts">
const error = useError()
</script>

<template>
  <div v-if="error">{{ error }}</div>
</template>
