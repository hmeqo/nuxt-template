<script setup lang="ts">
import { ArrowRight, Clock, FileUp, ShieldCheck, UserPlus, UserRound, Users } from '@lucide/vue'
import type { Component } from 'vue'
import type { UserResp } from '@ws/apisdk/types'

definePageMeta({
  title: '仪表盘',
  layout: 'default',
  auth: 'authenticated',
})

const authState = useAuthState()
const authPerms = useAuthPerms()

const user = computed(() => authState.user())
const perms = computed(() => authPerms.perms.value)

const RECENT_PAGE_SIZE = 5

// 最近注册要等 total 回来才会发请求，这之前也算「加载中」，否则会先闪一下空态
const recentSettled = ref(false)
// 最近注册最后一次请求的页码，重试时按同一页重新发
const recentPage = ref(1)

const notifyOverviewError = (error: unknown) => apiErrorToast('概览数据加载失败', error)

// per_page=1 只为拿 total
const {
  data: totalData,
  loading: totalLoading,
  error: totalError,
  send: loadTotal,
} = useRequest(() => Apis.users.list({ params: { per_page: 1 } }), {
  immediate: true,
}).onError(({ error }) => {
  recentSettled.value = true
  notifyOverviewError(error)
})

// 拿到 total 后翻到最后一页，取最新注册的用户
const {
  data: recentData,
  loading: recentLoading,
  error: recentError,
  send: loadRecent,
} = useRequest((page: number) => Apis.users.list({ params: { page, per_page: RECENT_PAGE_SIZE } }), {
  immediate: false,
})
  .onSuccess(() => {
    recentSettled.value = true
  })
  .onError(({ error }) => {
    recentSettled.value = true
    notifyOverviewError(error)
  })

const recentPending = computed(() => recentLoading.value || !recentSettled.value)

watch(
  totalData,
  (res) => {
    if (!res) return
    recentPage.value = Math.max(1, Math.ceil(res.total / RECENT_PAGE_SIZE))
    fire(loadRecent(recentPage.value))
  },
  { immediate: true },
)

const total = computed(() => totalData.value?.total ?? 0)
const recentUsers = computed(() =>
  [...(recentData.value?.users ?? [])].sort((a, b) => b.id - a.id).slice(0, RECENT_PAGE_SIZE),
)

const recentColumns: TableColumn<UserResp>[] = [
  { key: 'username', label: '用户名' },
  { key: 'id', label: 'ID', width: 'w-20', numeric: true },
  {
    key: 'created_at',
    label: '创建时间',
    width: 'w-48',
    align: 'end',
    text: (item) => formatDateTime(item.created_at, { seconds: false }),
  },
]

/**
 * 最近注册段的失败态：total 拿不到时它根本发不出请求，所以两个错误都算这一段的。
 * 失败时这段渲染错误行（apiErrorText 原文 + 下一步），不落到空态。
 */
const recentFailed = computed(() => recentError.value ?? totalError.value)

/** 重试那次失败的请求：total 挂了就先补 total（成功后 watch 会自动带出最近注册），否则重发最近注册这一页 */
function retryRecent() {
  if (totalError.value) fire(loadTotal())
  else fire(loadRecent(recentPage.value))
}

// 趋势线要全部注册时间，per_page=100 一次拿够；拿不到就按「没有数据」画空态，不编造曲线
const TREND_DAYS = 14
const { data: trendData } = useRequest(() => Apis.users.list({ params: { per_page: 100 } }), { immediate: true })
const registrationSpark = computed(() =>
  dailyBins(
    (trendData.value?.users ?? []).map((item) => item.created_at),
    TREND_DAYS,
  ).map((bin) => bin.value),
)

const { data: filesData, loading: filesLoading } = useRequest(() => Apis.files.list({ params: { per_page: 100 } }), {
  immediate: true,
})
const records = computed(() => filesData.value?.files ?? [])

const stats = computed<
  { label: string; value: string; hint: string; icon: Component; loading: boolean; spark?: number[] }[]
>(() => [
  // 用户总数来自列表接口：请求失败时降级为 —，不要拿 0 冒充「真的没有用户」
  {
    label: '用户总数',
    value: totalError.value ? '—' : String(total.value),
    hint: '全部注册账号',
    icon: Users,
    loading: totalLoading.value,
    spark: registrationSpark.value,
  },
  { label: '我的权限数', value: String(perms.value.length), hint: '当前账号持有', icon: ShieldCheck, loading: false },
  {
    label: '当前账号',
    value: user.value?.username ?? '—',
    hint: user.value ? `#${user.value.id}` : '未登录',
    icon: UserRound,
    loading: false,
  },
  {
    label: '本次上传',
    value: String(filesData.value?.total ?? 0),
    hint: '当前账号的文件',
    icon: FileUp,
    loading: filesLoading.value,
  },
])

/** 登录态由后端滑动续期 */
const { data: sessions } = useRequest(() => Apis.auth.sessions(), { immediate: true }).onError(({ error }) =>
  apiErrorToast('会话信息加载失败', error),
)

const currentSession = computed(() => sessions.value?.sessions.find((session) => session.current))

const sessionItems = computed(() => [
  { key: '到期时间', value: currentSession.value ? formatDateTime(currentSession.value.expires_at) : '—' },
  { key: '持有权限' },
])
</script>

<template>
  <div class="flex flex-col gap-5">
    <InkPageHeader title="仪表盘" description="账号、权限与本次上传的概览。">
      <template #action>
        <UiButton as-child variant="outline">
          <NuxtLink to="/files">
            <FileUp />
            上传文件
          </NuxtLink>
        </UiButton>
        <UiButton as-child>
          <NuxtLink to="/users">
            <UserPlus />
            新建用户
          </NuxtLink>
        </UiButton>
      </template>
    </InkPageHeader>

    <InkStatGrid>
      <InkStat
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :foot="stat.hint"
        :icon="stat.icon"
        :spark="stat.spark"
      >
        <template v-if="stat.loading" #value>
          <div class="skeleton h-6 w-16" />
        </template>
      </InkStat>
    </InkStatGrid>

    <ConsoleUploadTrendCard :records="records" />

    <InkDataTable
      :rows="recentUsers"
      :columns="recentColumns"
      :row-key="(item) => item.id"
      :loading="recentPending"
      :error="recentFailed"
      error-title="最近注册加载失败"
      :error-text="apiErrorText(recentFailed)"
      empty-title="还没有其他账号"
      empty-description="创建账号后，最新的注册记录会出现在这里，最多展示 5 条。"
      :empty-icon="Users"
      dense
      @retry="retryRecent()"
    >
      <template #header>
        <UiCardHeader>
          <UiCardTitle class="flex items-center gap-2">
            <Users class="size-3.5 text-ink-2" />
            最近注册
          </UiCardTitle>
          <UiCardDescription>最新加入的 5 个账号</UiCardDescription>
          <UiCardAction>
            <UiButton as-child variant="ghost" size="sm">
              <NuxtLink class="flex items-center" to="/users">
                查看全部
                <ArrowRight />
              </NuxtLink>
            </UiButton>
          </UiCardAction>
        </UiCardHeader>
      </template>

      <template #empty-action>
        <UiButton as-child variant="outline">
          <NuxtLink to="/users">去新建用户</NuxtLink>
        </UiButton>
      </template>
    </InkDataTable>

    <UiCard>
      <UiCardHeader>
        <UiCardTitle class="flex items-center gap-2">
          <Clock class="size-3.5 text-ink-2" />
          当前会话
        </UiCardTitle>
        <UiCardDescription>登录状态随使用自动延长。</UiCardDescription>
      </UiCardHeader>

      <UiCardContent>
        <InkKeyValue :items="sessionItems">
          <template #value="{ item }">
            <div v-if="item.key === '持有权限'" class="flex flex-wrap items-center gap-1.5">
              <UiBadge v-for="perm in perms.slice(0, 6)" :key="perm" variant="secondary" class="font-mono">
                {{ perm === '*' ? '全部权限' : perm }}
              </UiBadge>
              <UiBadge v-if="perms.length > 6" variant="outline">+{{ perms.length - 6 }}</UiBadge>
              <span v-if="!perms.length" class="text-[12px] text-ink-3">没有额外权限</span>
            </div>
            <template v-else>{{ item.value ?? '—' }}</template>
          </template>
        </InkKeyValue>
      </UiCardContent>
    </UiCard>
  </div>
</template>
