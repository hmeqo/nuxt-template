<script setup lang="ts">
import { SlidersHorizontal, UserCircle, Bell, Paintbrush } from '@lucide/vue'

definePageMeta({
  layout: 'default',
})

const tabs = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'account', label: 'Account', icon: UserCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Paintbrush },
]

const activeTab = ref('general')
</script>

<template>
  <div class="space-y-6">
    <AppPageHeader title="Settings" description="Manage your application preferences." />

    <!-- Tabs -->
    <div class="flex gap-1 border-b">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
        :class="activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="size-4" />
        {{ tab.label }}
        <span
          v-if="activeTab === tab.id"
          class="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
        />
      </button>
    </div>

    <!-- Tab content -->
    <div v-if="activeTab === 'general'" class="max-w-lg space-y-6">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Language & Region</UiCardTitle>
          <UiCardDescription>Set your preferred language and regional format.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div class="space-y-2">
            <UiLabel>Language</UiLabel>
            <UiInput type="text" value="English" disabled />
          </div>
          <div class="space-y-2">
            <UiLabel>Timezone</UiLabel>
            <UiInput type="text" value="UTC+8" disabled />
          </div>
        </UiCardContent>
      </UiCard>

      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Data Management</UiCardTitle>
          <UiCardDescription>Control how your data is stored and used.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <UiLabel>Auto-save</UiLabel>
              <p class="text-xs text-muted-foreground">Automatically save changes as you work.</p>
            </div>
            <UiSwitch :default-value="true" />
          </div>
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <UiLabel>Telemetry</UiLabel>
              <p class="text-xs text-muted-foreground">Help us improve by sending usage data.</p>
            </div>
            <UiSwitch :default-value="false" />
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <div v-if="activeTab === 'account'" class="max-w-lg space-y-6">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Profile</UiCardTitle>
          <UiCardDescription>Update your personal information.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div class="space-y-2">
            <UiLabel>Display Name</UiLabel>
            <UiInput type="text" value="Admin User" />
          </div>
          <div class="space-y-2">
            <UiLabel>Email</UiLabel>
            <UiInput type="email" value="admin@example.com" />
          </div>
          <UiButton>Save Changes</UiButton>
        </UiCardContent>
      </UiCard>
    </div>

    <div v-if="activeTab === 'notifications'" class="max-w-lg space-y-6">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Notification Preferences</UiCardTitle>
          <UiCardDescription>Choose what updates you receive.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <UiLabel>Email Notifications</UiLabel>
              <p class="text-xs text-muted-foreground">Receive notifications via email.</p>
            </div>
            <UiSwitch :default-value="true" />
          </div>
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <UiLabel>Push Notifications</UiLabel>
              <p class="text-xs text-muted-foreground">Receive push notifications on your device.</p>
            </div>
            <UiSwitch :default-value="true" />
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <div v-if="activeTab === 'appearance'" class="max-w-lg space-y-6">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Theme</UiCardTitle>
          <UiCardDescription>Customize the look and feel.</UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <UiLabel>Dark Mode</UiLabel>
              <p class="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
            </div>
            <UiSwitch :default-value="true" />
          </div>
          <div class="space-y-2">
            <UiLabel>Font Size</UiLabel>
            <UiInput type="number" value="14" />
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
