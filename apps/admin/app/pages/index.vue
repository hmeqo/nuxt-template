<script setup lang="ts">
const { darkMode } = useColorModeApi()

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: 'i-lucide-dollar-sign' },
  { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', icon: 'i-lucide-users' },
  { title: 'Sales', value: '+12,234', change: '+19% from last month', icon: 'i-lucide-credit-card' },
  { title: 'Active Now', value: '+573', change: '+201 since last hour', icon: 'i-lucide-activity' },
]

const recentSales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', initials: 'OM' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', initials: 'JL' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', initials: 'IN' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initials: 'WK' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', initials: 'SD' },
]

const teamMembers = [
  { name: 'John Doe', email: 'john@example.com', role: 'Owner', initials: 'JD' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Member', initials: 'JS' },
]

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
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
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
      <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <UiCard class="xl:col-span-2">
          <UiCardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <UiCardTitle>Overview</UiCardTitle>
              <UiCardDescription> Monthly revenue overview. </UiCardDescription>
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
            <UiCardDescription> You made 265 sales this month. </UiCardDescription>
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
                <span class="font-normal leading-snug text-muted-foreground">
                  {{ setting.description }}
                </span>
              </UiLabel>
              <UiSwitch :id="setting.id" :default-checked="setting.defaultChecked" />
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </main>
  </div>
</template>
