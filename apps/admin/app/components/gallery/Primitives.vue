<script setup lang="ts">
import {
  Bell,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  Download,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  User,
} from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

/** 14 组基础件（`Ui*`）：每组至少一个可用示例，带上主要变体 / 尺寸 / 状态 */

const BUTTON_VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const
const BUTTON_SIZES = ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const
const BADGE_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'success',
  'warn',
  'bad',
  'brand',
  'ghost',
  'link',
] as const

const isIconSize = (size: string) => size.startsWith('icon')

/** 头像用内联 SVG：headless 里不依赖网络，也能稳定渲染出「图片」这一支 */
const avatarImage = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23008d96"/%3E%3Ctext x="32" y="45" font-size="34" text-anchor="middle" fill="white" font-family="sans-serif"%3EA%3C/text%3E%3C/svg%3E`

/** 三行尺寸互不相同，才看得出数字列的等宽与右对齐 */
const TABLE_ROWS = [
  { name: '报表.pdf', state: '就绪', size: 2411520 },
  { name: '头像.png', state: '就绪', size: 819200 },
  { name: '备份.zip', state: '草稿', size: 15728640 },
]

const switchOn = ref(true)
const switchOff = ref(false)
const switchDisabled = ref(true)
const ctxChecked = ref(true)
const ctxRadio = ref('asc')
const menuChecked = ref([true, false])
const menuRadio = ref('compact')
const dialogOpen = ref(false)
const description = ref('用于说明这一字段的用途，展示态的次要文字。')

const schema = toTypedSchema(
  z.object({
    email: z.string({ message: '请输入邮箱' }).min(1, { message: '邮箱不能为空' }).email({ message: '邮箱格式不正确' }),
    display: z.string({ message: '请输入显示名' }).min(2, { message: '显示名至少 2 个字符' }),
  }),
)

const submitted = ref('')

function onSubmit(values: Record<string, unknown>) {
  submitted.value = JSON.stringify(values)
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">button：全 variant × size</p>
      <div class="space-y-2 overflow-x-auto">
        <div v-for="variant in BUTTON_VARIANTS" :key="variant" class="flex flex-wrap items-center gap-2">
          <code class="w-20 flex-none text-[11.5px] text-ink-3">{{ variant }}</code>
          <UiButton
            v-for="size in BUTTON_SIZES"
            :key="size"
            :variant="variant"
            :size="size"
            data-ui="button"
            :title="`${variant} / ${size}`"
          >
            <Star v-if="isIconSize(size)" />
            <template v-else>{{ size }}</template>
          </UiButton>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <UiButton data-ui="button" disabled>禁用</UiButton>
        <UiButton data-ui="button" variant="outline">
          <Plus />
          图标 + 文字
        </UiButton>
        <UiButton data-ui="button" variant="destructive">
          <Trash2 />
          删除
        </UiButton>
        <UiButton as-child variant="link">
          <a href="#primitives" data-ui="button-link">as-child 链接</a>
        </UiButton>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">badge：全 variant</p>
      <div class="flex flex-wrap items-center gap-2">
        <UiBadge v-for="variant in BADGE_VARIANTS" :key="variant" :variant="variant" data-ui="badge">
          {{ variant }}
        </UiBadge>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">card：header / action / content / footer</p>
      <div class="grid gap-3 lg:grid-cols-2">
        <UiCard>
          <UiCardHeader>
            <UiCardTitle>卡片标题</UiCardTitle>
            <UiCardDescription>卡片说明文字，放在标题下方。</UiCardDescription>
            <UiCardAction>
              <UiButton size="sm" variant="outline">
                <Pencil />
                编辑
              </UiButton>
            </UiCardAction>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-[13px] text-ink-2">正文内容区，放字段、表格或图表。</p>
          </UiCardContent>
          <UiCardFooter>
            <UiButton size="sm">保存</UiButton>
            <UiButton size="sm" variant="ghost">取消</UiButton>
          </UiCardFooter>
        </UiCard>
        <UiCard size="sm">
          <UiCardHeader>
            <UiCardTitle>紧凑卡片</UiCardTitle>
            <UiCardDescription>size="sm"。没有 action 与 footer。</UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-[13px] text-ink-2">只有标题与内容。</p>
          </UiCardContent>
        </UiCard>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">input / label / form：真实校验错误态</p>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="space-y-3 rounded-xl border border-line-1 bg-card p-4">
          <div class="grid gap-2">
            <UiLabel for="gallery-plain">label + input</UiLabel>
            <UiInput id="gallery-plain" model-value="普通输入" />
          </div>
          <div class="grid gap-2">
            <UiLabel for="gallery-disabled">禁用</UiLabel>
            <UiInput id="gallery-disabled" model-value="不可编辑" disabled />
          </div>
          <div class="grid gap-2">
            <UiLabel for="gallery-invalid">校验错误（aria-invalid）</UiLabel>
            <UiInput id="gallery-invalid" model-value="错的" aria-invalid="true" />
          </div>
        </div>

        <UiForm
          class="grid gap-4 rounded-xl border border-line-1 bg-card p-4"
          :validation-schema="schema"
          @submit="onSubmit"
        >
          <!-- 这一格故意挂载即校验：初始值不合法，错误态立刻可见 -->
          <UiFormField v-slot="{ componentField }" name="email" validate-on-mount>
            <UiFormItem>
              <UiFormLabel>邮箱（挂载即校验，故意报错）</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="email" placeholder="name@example.com" />
              </UiFormControl>
              <UiFormDescription>用来看 FormMessage / aria-invalid 的错误样式。</UiFormDescription>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="display" :initial-value="'示例用户'">
            <UiFormItem>
              <UiFormLabel>显示名</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" placeholder="至少 2 个字符" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <div class="flex items-center gap-2">
            <UiButton type="submit">提交</UiButton>
            <code v-if="submitted" class="truncate text-[11.5px] text-ink-3">{{ submitted }}</code>
          </div>
        </UiForm>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">switch：尺寸 / 状态</p>
      <div class="flex flex-wrap items-center gap-5">
        <label class="flex items-center gap-2 text-[13px] text-ink-2">
          <UiSwitch v-model="switchOn" />
          开（default）
        </label>
        <label class="flex items-center gap-2 text-[13px] text-ink-2">
          <UiSwitch v-model="switchOff" />
          关（default）
        </label>
        <label class="flex items-center gap-2 text-[13px] text-ink-2">
          <UiSwitch v-model="switchOn" size="sm" />
          开（sm）
        </label>
        <label class="flex items-center gap-2 text-[13px] text-ink-3">
          <UiSwitch v-model="switchDisabled" disabled />
          禁用
        </label>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">table：静态 3 行</p>
      <div class="rounded-xl border border-line-1 bg-card">
        <UiTable>
          <UiTableCaption>示例数据，仅用于观感检查</UiTableCaption>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead>名称</UiTableHead>
              <UiTableHead>状态</UiTableHead>
              <UiTableHead class="text-right">大小</UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <UiTableRow v-for="row in TABLE_ROWS" :key="row.name">
              <UiTableCell class="font-medium text-ink-1">{{ row.name }}</UiTableCell>
              <UiTableCell>
                <UiBadge :variant="row.state === '就绪' ? 'success' : 'secondary'">{{ row.state }}</UiBadge>
              </UiTableCell>
              <UiTableCell class="num text-right text-ink-2">{{ formatSize(row.size) }}</UiTableCell>
            </UiTableRow>
          </UiTableBody>
        </UiTable>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">dialog / dropdown-menu / context-menu / popover / tooltip</p>
      <div class="flex flex-wrap items-center gap-3">
        <UiDialog v-model:open="dialogOpen">
          <UiDialogTrigger as-child>
            <UiButton variant="outline" data-ui="dialog-trigger">打开 dialog</UiButton>
          </UiDialogTrigger>
          <UiDialogContent class="sm:max-w-sm">
            <UiDialogHeader>
              <UiDialogTitle>对话框标题</UiDialogTitle>
              <UiDialogDescription>这是对话框说明，用来验证遮罩、圆角与按钮排布。</UiDialogDescription>
            </UiDialogHeader>
            <div class="grid gap-2">
              <UiLabel for="gallery-dialog-input">字段</UiLabel>
              <UiInput id="gallery-dialog-input" v-model="description" />
            </div>
            <UiDialogFooter>
              <UiDialogClose as-child>
                <UiButton variant="outline" data-ui="button">取消</UiButton>
              </UiDialogClose>
              <UiButton data-ui="button">保存</UiButton>
            </UiDialogFooter>
          </UiDialogContent>
        </UiDialog>

        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton variant="outline" data-ui="dropdown-trigger">
              打开 dropdown
              <ChevronDown />
            </UiButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent class="w-56">
            <UiDropdownMenuLabel>账户</UiDropdownMenuLabel>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuItem>
              <User />
              个人资料
              <UiDropdownMenuShortcut>⌘P</UiDropdownMenuShortcut>
            </UiDropdownMenuItem>
            <UiDropdownMenuItem>
              <Settings />
              设置
            </UiDropdownMenuItem>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuCheckboxItem v-model="menuChecked[0]">
              <Check />
              按名称排序
            </UiDropdownMenuCheckboxItem>
            <UiDropdownMenuCheckboxItem v-model="menuChecked[1]">
              <Check />
              显示隐藏项
            </UiDropdownMenuCheckboxItem>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuRadioGroup v-model="menuRadio">
              <UiDropdownMenuRadioItem value="compact">紧凑</UiDropdownMenuRadioItem>
              <UiDropdownMenuRadioItem value="cozy">宽松</UiDropdownMenuRadioItem>
            </UiDropdownMenuRadioGroup>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuItem variant="destructive">
              <LogOut />
              退出登录
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>

        <UiContextMenu>
          <UiContextMenuTrigger
            class="flex h-9 w-40 items-center justify-center rounded-lg border border-dashed border-line-3 text-[12.5px] text-ink-3"
            data-ui="context-trigger"
          >
            右键这里
          </UiContextMenuTrigger>
          <UiContextMenuContent class="w-52">
            <UiContextMenuLabel>行操作</UiContextMenuLabel>
            <UiContextMenuSeparator />
            <UiContextMenuItem>
              <Copy />
              复制
            </UiContextMenuItem>
            <UiContextMenuCheckboxItem v-model="ctxChecked">
              <Check />
              显示隐藏文件
            </UiContextMenuCheckboxItem>
            <UiContextMenuSeparator />
            <UiContextMenuRadioGroup v-model="ctxRadio">
              <UiContextMenuRadioItem value="asc">升序</UiContextMenuRadioItem>
              <UiContextMenuRadioItem value="desc">降序</UiContextMenuRadioItem>
            </UiContextMenuRadioGroup>
          </UiContextMenuContent>
        </UiContextMenu>

        <UiPopover>
          <UiPopoverTrigger as-child>
            <UiButton variant="outline" data-ui="popover-trigger">打开 popover</UiButton>
          </UiPopoverTrigger>
          <UiPopoverContent class="w-72">
            <div class="grid gap-2">
              <p class="text-[13px] font-medium text-ink-1">浮层内容</p>
              <UiInput placeholder="浮层里的输入框" />
              <UiButton size="sm">应用</UiButton>
            </div>
          </UiPopoverContent>
        </UiPopover>

        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton variant="ghost" size="icon">
              <Bell />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>UiTooltip 基础件</UiTooltipContent>
        </UiTooltip>
        <InkTooltip content="InkTooltip 组合件">
          <UiButton variant="ghost" size="icon">
            <Download />
          </UiButton>
        </InkTooltip>
      </div>
    </div>

    <div>
      <p class="mb-2 text-[12.5px] font-medium text-ink-2">avatar：图片 / fallback / 尺寸 / group / badge</p>
      <div class="flex flex-wrap items-end gap-4">
        <UiAvatar size="sm">
          <UiAvatarImage :src="avatarImage" alt="示例头像" />
          <UiAvatarFallback>SM</UiAvatarFallback>
        </UiAvatar>
        <UiAvatar>
          <UiAvatarImage :src="avatarImage" alt="示例头像" />
          <UiAvatarFallback>DF</UiAvatarFallback>
        </UiAvatar>
        <UiAvatar size="lg">
          <UiAvatarImage :src="avatarImage" alt="示例头像" />
          <UiAvatarFallback>LG</UiAvatarFallback>
          <UiAvatarBadge />
        </UiAvatar>
        <UiAvatar>
          <UiAvatarImage src="/definitely-missing-avatar.png" alt="坏图" />
          <UiAvatarFallback>NA</UiAvatarFallback>
        </UiAvatar>
        <UiAvatarGroup>
          <UiAvatar>
            <UiAvatarFallback>甲</UiAvatarFallback>
          </UiAvatar>
          <UiAvatar>
            <UiAvatarFallback>乙</UiAvatarFallback>
          </UiAvatar>
          <UiAvatar>
            <UiAvatarFallback>丙</UiAvatarFallback>
          </UiAvatar>
          <UiAvatarGroupCount>+3</UiAvatarGroupCount>
        </UiAvatarGroup>
        <span class="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
          <Mail class="size-3.5" />
          坏图应回落到 fallback
        </span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 text-[12px] text-ink-3">
      <CreditCard class="size-3.5" />
      <Search class="size-3.5" />
      <span
        >以上覆盖 14 组基础件：avatar / badge / button / card / context-menu / dialog / dropdown-menu / form / input /
        label / popover / switch / table / tooltip。</span
      >
    </div>
  </div>
</template>
