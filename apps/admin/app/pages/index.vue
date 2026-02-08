<script setup lang="ts">
const { darkMode } = useThemeMode()

// 统计数据
const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: 'i-lucide-dollar-sign' },
  { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', icon: 'i-lucide-users' },
  { title: 'Sales', value: '+12,234', change: '+19% from last month', icon: 'i-lucide-credit-card' },
  { title: 'Active Now', value: '+573', change: '+201 since last hour', icon: 'i-lucide-activity' },
]

// 最近销售
const recentSales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', initials: 'OM' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', initials: 'JL' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', initials: 'IN' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initials: 'WK' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', initials: 'SD' },
]

// 团队成员
const teamMembers = [
  { name: 'John Doe', email: 'john@example.com', role: 'Owner', initials: 'JD' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Member', initials: 'JS' },
]

// Cookie 设置
const cookieSettings = [
  {
    id: 'necessary',
    label: 'Strictly Necessary',
    description: 'These cookies are essential in order to use the website and use its features.',
    defaultChecked: true,
  },
  {
    id: 'functional',
    label: 'Functional Cookies',
    description: 'These cookies allow the website to provide personalized functionality.',
    defaultChecked: false,
  },
  {
    id: 'performance',
    label: 'Performance Cookies',
    description: 'These cookies help to improve the performance of the website.',
    defaultChecked: false,
  },
]

// API 响应示例
const apiResponse = `{
  "status": "success",
  "data": {
    "user": {
      "id": "usr_8f7d6e5c",
      "username": "admin",
      "role": "super_admin",
      "last_login": "2026-02-08T02:15:32Z"
    },
    "stats": {
      "requests": 152847,
      "avg_time": "45ms",
      "success_rate": "99.97%"
    }
  }
}`

// 系统日志
const systemLogs = [
  { time: '02:29:15', level: 'info', message: 'Server started on port 3000' },
  { time: '02:28:42', level: 'debug', message: 'Cache hit: user:profile:12345' },
  { time: '02:28:10', level: 'warn', message: 'High memory usage: 87%' },
  { time: '02:27:55', level: 'error', message: 'DB connection timeout' },
]

// 复制功能
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

// 日志级别颜色
function getLogLevelColor(level: string) {
  switch (level) {
    case 'error':
      return 'text-red-500'
    case 'warn':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    case 'debug':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <!-- Header -->
    <header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
      <nav
        class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <a href="#" class="flex items-center gap-2 text-lg font-semibold md:text-base">
          <div class="h-6 w-6 bg-primary rounded-full" />
          <span class="sr-only">Acme Inc</span>
        </a>
        <a href="#" class="text-foreground transition-colors hover:text-foreground">Dashboard</a>
        <a href="#" class="text-muted-foreground transition-colors hover:text-foreground">Orders</a>
        <a href="#" class="text-muted-foreground transition-colors hover:text-foreground">Products</a>
        <a href="#" class="text-muted-foreground transition-colors hover:text-foreground">Customers</a>
        <a href="#" class="text-muted-foreground transition-colors hover:text-foreground">Analytics</a>
      </nav>
      <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div class="ml-auto flex-1 sm:flex-initial">
          <div class="relative">
            <div class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground i-lucide-search" />
            <UiInput
              type="search"
              placeholder="Search products..."
              class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
        <UiSwitch v-model="darkMode" />
        <UiButton as-child variant="secondary" size="sm">
          <NuxtLink to="/login">Sign In</NuxtLink>
        </UiButton>
      </div>
    </header>

    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <!-- 统计卡片 -->
      <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <UiCard v-for="stat in stats" :key="stat.title">
          <UiCardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <UiCardTitle class="text-sm font-medium">{{ stat.title }}</UiCardTitle>
            <div :class="[stat.icon, 'h-4 w-4 text-muted-foreground']" />
          </UiCardHeader>
          <UiCardContent>
            <div class="text-2xl font-bold">{{ stat.value }}</div>
            <p class="text-xs text-muted-foreground">{{ stat.change }}</p>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- 概览图表 + 最近销售 -->
      <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <UiCard class="xl:col-span-2">
          <UiCardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <UiCardTitle>Overview</UiCardTitle>
              <UiCardDescription>Monthly revenue overview.</UiCardDescription>
            </div>
          </UiCardHeader>
          <UiCardContent>
            <div class="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
              Chart Placeholder
            </div>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardHeader>
            <UiCardTitle>Recent Sales</UiCardTitle>
            <UiCardDescription>You made 265 sales this month.</UiCardDescription>
          </UiCardHeader>
          <UiCardContent class="grid gap-8">
            <div v-for="sale in recentSales" :key="sale.email" class="flex items-center gap-4">
              <div class="hidden h-9 w-9 sm:flex rounded-full bg-primary/10 items-center justify-center">
                <span class="text-xs font-medium">{{ sale.initials }}</span>
              </div>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">{{ sale.name }}</p>
                <p class="text-sm text-muted-foreground">{{ sale.email }}</p>
              </div>
              <div class="ml-auto font-medium">{{ sale.amount }}</div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- 团队成员 + Cookie 设置 -->
      <div class="grid gap-4 md:gap-8 lg:grid-cols-3">
        <UiCard>
          <UiCardHeader>
            <UiCardTitle>Team Members</UiCardTitle>
            <UiCardDescription>Invite your team members to collaborate.</UiCardDescription>
          </UiCardHeader>
          <UiCardContent class="grid gap-6">
            <div v-for="member in teamMembers" :key="member.email" class="flex items-center justify-between space-x-4">
              <div class="flex items-center space-x-4">
                <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span class="text-xs">{{ member.initials }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium leading-none">{{ member.name }}</p>
                  <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                </div>
              </div>
              <UiButton variant="outline" size="sm">{{ member.role }}</UiButton>
            </div>
          </UiCardContent>
        </UiCard>

        <UiCard class="col-span-2">
          <UiCardHeader>
            <UiCardTitle>Cookie Settings</UiCardTitle>
            <UiCardDescription>Manage your cookie settings here.</UiCardDescription>
          </UiCardHeader>
          <UiCardContent class="grid gap-6">
            <div
              v-for="setting in cookieSettings"
              :key="setting.id"
              class="flex items-center justify-between space-x-2"
            >
              <UiLabel :for="setting.id" class="flex flex-col space-y-1">
                <span>{{ setting.label }}</span>
                <span class="font-normal leading-snug text-muted-foreground">{{ setting.description }}</span>
              </UiLabel>
              <UiSwitch :id="setting.id" :default-checked="setting.defaultChecked" />
            </div>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- 开发者工具区域 -->
      <div class="grid gap-4 md:gap-8 lg:grid-cols-2">
        <!-- API 响应展示 -->
        <UiCard>
          <UiCardHeader class="flex flex-row items-center justify-between">
            <div>
              <UiCardTitle class="flex items-center gap-2">
                <div class="i-lucide-code-2 h-4 w-4" />
                API Response
              </UiCardTitle>
              <UiCardDescription>Sample JSON response from /api/user</UiCardDescription>
            </div>
            <UiButton variant="ghost" size="icon" @click="copyToClipboard(apiResponse)">
              <div class="i-lucide-copy h-4 w-4" />
            </UiButton>
          </UiCardHeader>
          <UiCardContent>
            <pre class="font-mono text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto leading-relaxed">{{
              apiResponse
            }}</pre>
          </UiCardContent>
        </UiCard>

        <!-- 系统日志 -->
        <UiCard>
          <UiCardHeader>
            <UiCardTitle class="flex items-center gap-2">
              <div class="i-lucide-terminal h-4 w-4" />
              System Logs
            </UiCardTitle>
            <UiCardDescription>Recent application logs</UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <div class="font-mono text-xs bg-muted/50 p-4 rounded-lg space-y-2">
              <div v-for="log in systemLogs" :key="log.time" class="flex gap-3">
                <span class="text-muted-foreground shrink-0">{{ log.time }}</span>
                <span :class="[getLogLevelColor(log.level), 'uppercase shrink-0 w-12']">{{ log.level }}</span>
                <span class="text-foreground">{{ log.message }}</span>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </main>
  </div>
</template>
