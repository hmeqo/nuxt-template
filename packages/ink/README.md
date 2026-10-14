# @ws/ink

`omp stats` 那套视觉的组件套件：纯黑机身 + 内嵌面板 + alpha 发丝边。**一个包 = 一种风格**，将来别的风格另开一个包（例如大屏 UI），互不干扰。

## 用法

```ts
// nuxt.config.ts
modules: ['@ws/ink'],
css: [
  '~/assets/css/tailwind.css',   // 里层 @import '@ws/ink/tailwind.css'（令牌 + 色阶 + accent 预设 + base 层）
  '~/assets/css/utilities.css',  // 里层 @import '@ws/ink/utilities.css'（.hairline / .glass / .num / .mono / .skeleton）
],
```

## 表格

`<InkDataTable>` 是一整套固定样式：卡片壳、表头、行操作、骨架/失败/空态、分页页脚，页面只给「列」和「行操作」。

```vue
<InkDataTable
  :rows="users"
  :columns="columns"
  :row-key="(user) => user.id"
  :actions="rowActions"
  :pagination="pagination"
  v-model:sort="sort"
  v-model:filters="filters"
/>
```

排序和筛选**不发请求**：`v-model:sort` 给 `{ key, order } | null`，`v-model:filters` 给 `{ 列key: 值 }`，由页面决定后端字段名（后端认什么就传什么）。

卡片的标题与工具栏走 `#header` 插槽：内容落在表头之上、**同一张卡片里**（传 `UiCardHeader` + 一段工具栏即可，别在外面再套一层 `UiCard`）。列多、信息密度高时加 `dense`，表头格从默认收成 `h-auto px-4 py-2`（行不变）：

```vue
<InkDataTable :rows="users" :columns="columns" :row-key="(u) => u.id" dense>
  <template #header>
    <UiCardHeader>
      <UiCardTitle>最近注册</UiCardTitle>
      <UiCardAction>…</UiCardAction>
    </UiCardHeader>
    <div class="px-4 pb-3"><!-- 工具栏 --></div>
  </template>
</InkDataTable>
```

表头能力是**接线才出现**：列里的 `sortable` / `filter` 只声明「这一列支持」，页面绑了对应的 `v-model` 才真的渲染按钮——没接线就不摆出点了没反应的控件。**列名本身只是文字**（不可点），排序和筛选各是一个独立按钮（同一形状、同一默认色）：默认比表头文字再淡一档（`text-ink-3` vs 表头 `ink-2`），悬停/激活才转 `ink-1`，筛选有生效值时常驻品牌色 + 实心漏斗。排序按钮点击循环升 → 降 → 不排，`aria-sort` 落在 `<th>` 上；筛选按钮开面板（标题 + 输入框 + 清除/应用），列上给了 `filter.options` 就换成选项列表（点一下即生效，再点取消）。

单元格默认取 `row[key]` 或 `col.text(row)`，要自定义内容用 `#cell-<key>` 插槽；空态的操作按钮用 `#empty-action`。

## 命名与分层

组件名 = `Ink` + 目录段 + 文件名，目录是唯一的分层手段：

| 文件                         | 组件名                                                 |
| ---------------------------- | ------------------------------------------------------ |
| `components/Segmented.vue`   | `<InkSegmented>`（核心件直接放根目录，**不加**领域段） |
| `components/chat/Bubble.vue` | `<InkChatBubble>`（领域件按领域开子目录）              |
| `components/table/Row.vue`   | `<InkTableRow>`                                        |

领域子目录只在「领域词还没出现在组件名里」时才开：`BarChart`/`StatGrid` 这类名字自带领域语义，就给它们平铺，避免 `InkDataStatGrid` 这种叠词。

### 图标尺寸

图标尺寸按**角色**定，同一个角色在任何地方都是同一个尺寸——跨页面同一控件差 1 档就是 bug：

| 角色                                            | 尺寸                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| 卡片标题、Stat、行内说明（配 `text-ink-2`）     | `size-3.5`（14px）                                                    |
| 表头里的排序/筛选控件（比表头文字再淡一档）     | `size-3.5` + `text-ink-3`（悬停/激活转 `ink-1`）                      |
| 字段、菜单项、对话框里的控件级图标              | `size-4`（16px）                                                      |
| 宿主 `UiButton` 里的图标                        | **不写**，由按钮 `size` 决定（`default`/`icon` 16、`sm` 14、`xs` 12） |
| 空态、表格失败态这类区域状态（配 `text-ink-4`） | `size-6`（与 `InkEmptyState` 的 `h-6 w-6` 同档）                      |

## 导出

| 导出                                                                                                                                          | 说明                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<InkBrand>` `<InkSegmented>` `<InkSwatch>` `<InkBadge>` `<InkTooltip>`                                                                       | 品牌标、分段控件、色块、徽标、悬浮提示                                                                                                                      |
| `<InkEmptyState>` `<InkKeyValue>` `<InkPageHeader>`                                                                                           | 空态、键值网格、页头                                                                                                                                        |
| `<InkDataTable>`                                                                                                                              | 数据表（表头排序/筛选、行操作、状态、分页）                                                                                                                 |
| `<InkStat>` `<InkStatGrid>` `<InkSparkline>` `<InkBarChart>` `<InkChartLegend>` `<InkShareBar>` `<InkBreakdown>` `<InkMeter>` `<InkProgress>` | 指标与图表                                                                                                                                                  |
| `<InkThemePicker>` `<InkAccentPicker>` `<InkAppearanceCard>`                                                                                  | 明暗主题、强调色、外观设置卡                                                                                                                                |
| `useInkAccent()` / `INK_ACCENTS`                                                                                                              | 强调色偏好（cookie，默认银色），由模块里的插件写进 `html[data-accent]`                                                                                      |
| `toast()` / `useToast()` · `<InkToaster>`                                                                                                     | 提示：`toast({ title, description, variant })`，宿主 `app.vue` 挂一次 `<InkToaster />`                                                                      |
| `askConfirm()` · `<InkPrompt>`                                                                                                                | 确认框：`await askConfirm({ title, description, actions })` 返回动作 `value`（默认取消/确认，最后一项为 Enter 默认），宿主 `app.vue` 挂一次 `<InkPrompt />` |
| `formatCompact` / `formatDateTime` / `formatSize` · `seriesColor` / `buildColorLookup`                                                        | 展示格式化与分类色查表                                                                                                                                      |

## 宿主契约

套件自我完整：shadcn 基础件 `Ui*`（`UiCard` / `UiBadge` / `UiTooltip` …）与 `cn` 工具都由本包所有——基础件在 `ui/**`，`cn` 在 `utils/cn.ts`。宿主**不要**再 vendor 一份 `app/components/ui/**` 或 `app/lib/utils.ts`。组件、组合式函数、工具随模块自动导入；包外要显式路径就走 `@ws/ink/composables` / `@ws/ink/utils`——出口文件放 `exports/`，与自动导入扫的 `composables/`、`utils/` 分开，同一个名字才不会注册两遍。

## 加一个组件

1. 放 `components/<名字>.vue`（核心件）或 `components/<领域>/<名字>.vue`（领域件）；
2. 只用令牌类（`bg-panel` / `text-ink-3` / `border-line-2` …）和套件里的组件，不要 import 宿主场景件；
3. 领域件记得按上表核对组件名。

## 加一个基础件

基础件（`Ui*`）同样从 shadcn 拉，落到本包 `ui/**`：

```bash
pnpm --filter admin gen:ui -- <name>   # aliases 已指向 @ws/ink/ui：只落一份，两个 app 都拿到
```

拉下来后按本仓库约定改三处，再跑一次 build：

1. tone：用 `text-ink-2/3`、`border-line-1/2`，别留 `muted-foreground` / `border`（`tailwind.css` 里把它们映射到 ink-3 / line-1 只是兜底，不是本仓库的档位选择）；
2. 状态：hover 用 `bg-hover`、选中用 `bg-selected`，键盘高亮同族；
3. 焦点环：`focus-visible:ring-[3px] focus-visible:ring-focus/18`。

别拉 `sonner` / `chart`：套件已有 `Toast*` + `<InkToaster>` 和自己的图表件，拉进来就是两套同类件并存。
