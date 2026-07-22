<script setup lang="ts">
import { Download, Plus, ChevronDown, DollarSign, Users, ShoppingCart, Activity } from '@lucide/vue'

definePageMeta({
  layout: 'default',
})

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, trend: 'up' },
  { title: 'Subscriptions', value: '2,350', change: '+180.1%', icon: Users, trend: 'up' },
  { title: 'Sales', value: '12,234', change: '+19%', icon: ShoppingCart, trend: 'up' },
  { title: 'Active Now', value: '573', change: '+201', icon: Activity, trend: 'up' },
]

const recentActivity = [
  { user: 'Olivia Martin', action: 'purchased', target: 'Pro Plan', amount: '$1,999.00', time: '2m ago', initials: 'OM' },
  { user: 'Jackson Lee', action: 'upgraded to', target: 'Enterprise', amount: '$399.00', time: '15m ago', initials: 'JL' },
  { user: 'Isabella Nguyen', action: 'subscribed to', target: 'Basic Plan', amount: '$29.00', time: '1h ago', initials: 'IN' },
  { user: 'William Kim', action: 'purchased', target: 'Pro Plan', amount: '$1,999.00', time: '2h ago', initials: 'WK' },
  { user: 'Sofia Davis', action: 'subscribed to', target: 'Starter', amount: '$9.00', time: '3h ago', initials: 'SD' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const chartData = [3200, 4100, 3800, 5100, 4800, 6200, 5900, 7300, 6800, 8400, 7800, 9200]
const chartRef = ref<HTMLElement | null>(null)
const maxVal = Math.max(...chartData)
</script>

<template>
  <div class="space-y-6">
    <AppPageHeader title="Dashboard" description="Your business overview at a glance.">
      <template #actions>
        <UiButton variant="outline" size="sm">
          <Download class="size-4 mr-2" />
          Export
        </UiButton>
        <UiButton size="sm">
          <Plus class="size-4 mr-2" />
          New Report
        </UiButton>
      </template>
    </AppPageHeader>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UiCard
        v-for="stat in stats"
        :key="stat.title"
        class="transition-all duration-200 hover:shadow-md"
      >
        <UiCardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <UiCardTitle class="text-sm font-medium text-muted-foreground">{{ stat.title }}</UiCardTitle>
          <div class="flex size-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <component :is="stat.icon" class="size-4" />
          </div>
        </UiCardHeader>
        <UiCardContent>
          <div class="text-2xl font-bold tracking-tight">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground mt-0.5">
            <span class="text-emerald-500 font-medium">{{ stat.change }}</span>
            from last month
          </p>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Chart + Recent Activity -->
    <div class="grid gap-6 lg:grid-cols-7">
      <UiCard class="lg:col-span-4">
        <UiCardHeader>
          <div class="flex items-center justify-between">
            <div>
              <UiCardTitle>Revenue Overview</UiCardTitle>
              <UiCardDescription>Monthly revenue for the current year</UiCardDescription>
            </div>
            <UiDropdownMenu>
              <UiDropdownMenuTrigger as-child>
                <UiButton variant="ghost" size="sm">
                  <ChevronDown class="size-4" />
                </UiButton>
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent align="end">
                <UiDropdownMenuItem>This Year</UiDropdownMenuItem>
                <UiDropdownMenuItem>Last Year</UiDropdownMenuItem>
              </UiDropdownMenuContent>
            </UiDropdownMenu>
          </div>
        </UiCardHeader>
        <UiCardContent>
          <div ref="chartRef" class="relative h-64 w-full">
            <svg
              class="h-full w-full"
              viewBox="0 0 600 240"
              preserveAspectRatio="none"
            >
              <line v-for="i in 4" :key="i" x1="0" :y1="i * 48" x2="600" :y2="i * 48" stroke="currentColor" class="text-border" stroke-width="1" />
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="oklch(0.488 0.243 264.376)" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="oklch(0.488 0.243 264.376)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path
                :d="'M' + chartData.map((v, i) => `${(i / (chartData.length - 1)) * 600},${240 - (v / maxVal) * 200}`).join(' L ') + ' L 600,240 L 0,240 Z'"
                fill="url(#chart-gradient)"
              />
              <path
                :d="'M' + chartData.map((v, i) => `${(i / (chartData.length - 1)) * 600},${240 - (v / maxVal) * 200}`).join(' L ')"
                fill="none"
                stroke="oklch(0.488 0.243 264.376)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                v-for="(v, i) in chartData"
                :key="i"
                :cx="(i / (chartData.length - 1)) * 600"
                :cy="240 - (v / maxVal) * 200"
                r="3"
                fill="oklch(0.488 0.243 264.376)"
                class="hover:r-5 transition-all"
              />
            </svg>
            <div class="flex justify-between mt-2 px-1">
              <span v-for="m in months" :key="m" class="text-[10px] text-muted-foreground">{{ m }}</span>
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <UiCard class="lg:col-span-3">
        <UiCardHeader>
          <UiCardTitle>Recent Activity</UiCardTitle>
          <UiCardDescription>Latest transactions and updates</UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <div class="space-y-5">
            <div
              v-for="item in recentActivity"
              :key="item.time"
              class="flex items-center gap-3"
            >
              <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-xs font-medium text-primary">
                {{ item.initials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate">
                  <span class="text-foreground">{{ item.user }}</span>
                  <span class="text-muted-foreground font-normal"> {{ item.action }} </span>
                  <span class="text-foreground">{{ item.target }}</span>
                </p>
                <p class="text-xs text-muted-foreground">{{ item.time }}</p>
              </div>
              <span class="text-sm font-medium tabular-nums shrink-0">{{ item.amount }}</span>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
