<script setup lang="ts">
import { isVNode } from 'vue'
import { useToast } from '../composables/use-toast'

const { toasts } = useToast()
</script>

<template>
  <InkToastProvider>
    <InkToast v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="grid gap-1">
        <InkToastTitle v-if="toast.title">
          {{ toast.title }}
        </InkToastTitle>
        <template v-if="toast.description">
          <InkToastDescription v-if="isVNode(toast.description)">
            <component :is="toast.description" />
          </InkToastDescription>
          <InkToastDescription v-else>
            {{ toast.description }}
          </InkToastDescription>
        </template>
        <InkToastClose />
      </div>
      <component :is="toast.action" />
    </InkToast>
    <InkToastViewport />
  </InkToastProvider>
</template>
