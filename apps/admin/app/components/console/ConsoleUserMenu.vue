<script setup lang="ts">
import { ChevronsUpDown, LogOut, Settings, User } from '@lucide/vue'

/**
 * - `设置` 行照导航行的排版（同 `h-8` / `px-3` / 16px 图标列 / 同色 ink-3 + `bg-selected` 激活态），
 * - 账号卡（头像 + 用户名 + 展开箭头）是下拉触发器，铺满整行；用户名过长先截断，箭头永远贴右沿；
 *   头像 28px 比导航图标宽，两行本来就不同列 —— 靠 10px 的间隔断开分组，不让人误以为要互相对齐；
 * - 下拉里也留一份 `设置`；不写「已登录」这类废话状态。
 */
const props = defineProps<{ collapsed?: boolean }>()

const emit = defineEmits<{ logout: [] }>()

const authState = useAuthState()
const { isActive } = useConsoleNav()
const user = computed(() => authState.user())
</script>

<template>
  <div :class="props.collapsed ? 'flex w-10 flex-col items-center gap-2.5' : 'flex w-full flex-col gap-2.5'">
    <InkTooltip content="设置" side="right" :disabled="!props.collapsed">
      <NuxtLink
        to="/settings"
        class="flex h-8 w-full flex-none cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm font-[450] transition-colors"
        :class="isActive('/settings') ? 'bg-selected text-ink-1' : 'text-ink-3 hover:bg-hover hover:text-ink-1'"
      >
        <Settings class="h-4 w-4 flex-none transition-colors" :class="isActive('/settings') && 'text-brand'" />
        <span v-if="!props.collapsed" class="min-w-0 truncate">设置</span>
        <span v-else class="sr-only">设置</span>
      </NuxtLink>
    </InkTooltip>

    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <button
          type="button"
          class="group/console-user flex items-center text-left transition-colors outline-none hover:bg-hover focus-visible:ring-[3px] focus-visible:ring-focus/18"
          :class="
            props.collapsed
              ? 'size-8 flex-none justify-center rounded-full'
              : 'h-10 w-full min-w-0 gap-2.5 rounded-lg px-3'
          "
        >
          <span class="flex size-7 flex-none items-center justify-center rounded-full bg-raised ring-1 ring-line-1">
            <User class="h-3.5 w-3.5 text-ink-2" />
          </span>
          <span v-if="!props.collapsed" class="min-w-0 truncate text-sm font-medium text-ink-1">
            {{ user?.username || '用户' }}
          </span>
          <span v-if="!props.collapsed" class="flex-1" />
          <ChevronsUpDown
            v-if="!props.collapsed"
            class="size-3.5 flex-none text-ink-2 opacity-60 transition-opacity group-hover/console-user:opacity-100"
          />
          <span v-if="props.collapsed" class="sr-only">{{ user?.username || '用户' }}</span>
        </button>
      </UiDropdownMenuTrigger>

      <UiDropdownMenuContent side="right" align="end" :side-offset="8" class="w-52">
        <UiDropdownMenuLabel class="text-[12px] text-ink-3">{{ user?.username || '用户' }}</UiDropdownMenuLabel>
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="navigateTo('/settings')">
          <Settings />
          设置
        </UiDropdownMenuItem>
        <UiDropdownMenuItem variant="destructive" @click="emit('logout')">
          <LogOut />
          退出登录
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </div>
</template>
