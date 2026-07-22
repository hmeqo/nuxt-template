<script setup lang="ts">
import { Clock, Eye, TrendingDown, Users } from '@lucide/vue'

definePageMeta({
  layout: 'default',
})

const metrics = [
  { label: 'Page Views', value: '84,521', change: '+12.5%', icon: Eye },
  { label: 'Unique Visitors', value: '32,418', change: '+8.2%', icon: Users },
  { label: 'Bounce Rate', value: '24.3%', change: '-3.1%', icon: TrendingDown },
  { label: 'Avg. Session', value: '4m 32s', change: '+11.7%', icon: Clock },
]

const topPages = [
  { path: '/dashboard', views: '12,483', bounce: '18.2%', avgTime: '5m 12s' },
  { path: '/settings', views: '8,247', bounce: '22.1%', avgTime: '3m 45s' },
  { path: '/analytics', views: '5,691', bounce: '15.8%', avgTime: '6m 02s' },
  { path: '/profile', views: '3,124', bounce: '28.4%', avgTime: '2m 18s' },
]
</script>

<template>
  <div class="space-y-6">
    <AppPageHeader title="Analytics" description="Track your application performance and usage." />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UiCard v-for="m in metrics" :key="m.label">
        <UiCardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <UiCardTitle class="text-sm font-medium text-muted-foreground">{{ m.label }}</UiCardTitle>
          <component :is="m.icon" class="size-4 text-muted-foreground/70" />
        </UiCardHeader>
        <UiCardContent>
          <div class="text-2xl font-bold tracking-tight">{{ m.value }}</div>
          <p class="text-xs mt-0.5" :class="m.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'">
            {{ m.change }}
          </p>
        </UiCardContent>
      </UiCard>
    </div>

    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Top Pages</UiCardTitle>
        <UiCardDescription>Most visited pages by traffic volume.</UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-3 font-medium text-muted-foreground">Page</th>
                <th class="pb-3 font-medium text-muted-foreground text-right">Views</th>
                <th class="pb-3 font-medium text-muted-foreground text-right">Bounce</th>
                <th class="pb-3 font-medium text-muted-foreground text-right">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in topPages" :key="p.path" class="border-b last:border-0">
                <td class="py-3 font-medium">{{ p.path }}</td>
                <td class="py-3 text-right tabular-nums">{{ p.views }}</td>
                <td class="py-3 text-right tabular-nums">{{ p.bounce }}</td>
                <td class="py-3 text-right tabular-nums text-muted-foreground">{{ p.avgTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
