<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { answerConfirm, useConfirmState } from '../composables/confirm'

const state = useConfirmState()

function onKeydown(event: KeyboardEvent) {
  if (!state.open) return

  if (event.key === 'Escape') {
    answerConfirm('cancel')
    event.preventDefault()
  } else if (event.key === 'Enter') {
    const fallback = state.actions[state.actions.length - 1]
    if (fallback) answerConfirm(fallback.value)
    event.preventDefault()
  }
}

watch(
  () => state.open,
  (open) => {
    if (open) window.addEventListener('keydown', onKeydown, true)
    else window.removeEventListener('keydown', onKeydown, true)
  },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, true))
</script>

<template>
  <div
    v-if="state.open"
    class="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-6"
    @click.self="answerConfirm('cancel')"
  >
    <div class="w-full max-w-sm rounded-lg border border-line-2 bg-raised p-4 shadow-(--shadow-3)">
      <p class="text-[13px] font-medium text-ink-1">{{ state.title }}</p>
      <p v-if="state.description" class="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{{ state.description }}</p>

      <div class="mt-4 flex items-center justify-end gap-2">
        <UiButton
          v-for="action in state.actions"
          :key="action.value"
          size="sm"
          :variant="action.variant ?? 'outline'"
          @click="answerConfirm(action.value)"
        >
          {{ action.label }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
