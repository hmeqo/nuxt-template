# nuxt-template

pnpm workspace 模板：**`packages/*` 是一套套视觉风格（组件套件），`apps/*` 是具体场景**。

## 结构

| 目录                  | 是什么                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `apps/main`           | 桌面端场景：Tauri 壳（菜单栏 / 标签条 / 停靠面板 / 状态栏）+ 本地文件读写                                                  |
| `apps/admin`          | 后台场景：登录、用户、文件管理（走 HTTP 后端），场景件在 `app/components/console/**`                                       |
| `packages/ink`        | 风格套件：`omp stats` 那套暗色组件 + 设计令牌 + 风格原语；shadcn 基础件 `Ui*` 与 `cn` 也归它所有，两个 app 不再各自 vendor |
| `packages/app-preset` | app 级默认值（compat / devtools / css / fonts / colorMode / vite …）+ 共用 CSS + `/api`、`/media` 的 BFF 代理路由          |
| `packages/tauri`      | Tauri 平台胶水：窗口控制、拖拽区、specta 生成的命令绑定                                                                    |
| `packages/apisdk`     | 后台 API 客户端（alova + OpenAPI 生成）                                                                                    |
| `packages/remqo`      | 子模块：通用 Nuxt 模块集合（`@remqo/*`）                                                                                   |
| `src-tauri`           | 桌面壳 Rust 端：命令、插件、窗口与打包配置                                                                                 |

## 约定

- **一个包 = 一种风格**：组件、令牌、风格原语都放同一个包；新风格（例如大屏 UI）另开 `packages/<风格名>`。
- 组件前缀跟包名走（`@ws/ink` → `<InkSegmented>`），套件内的分层见 `packages/ink/README.md`。
- 场景不进包：`apps/*` 里只放该场景的组件（如 `console/**` 的后台外壳与业务卡）。
- **依赖方向**：`apps/*` → `@ws/ink` / `@ws/tauri` / `@ws/apisdk` / `@ws/app-preset`；`@ws/apisdk` → `@ws/ink`；`@ws/ink` → `@remqo/shadcn`（唯一的 remqo 依赖）；`@ws/tauri` 与 `@ws/ink` 互不依赖（要联动就走回调注入，例如 `setDesktopNotifier`）；任何包都不依赖 `apps/*`。
- **配置归属**：`@remqo/*` 只注册模块与中间件，本产品的 app 级默认值（含共用 CSS 与 BFF 代理路由）只在 `@ws/app-preset`。

## 上游代理（BFF）

前端只请求**同源** `/api`、`/media`，由 `@ws/app-preset` 里的 `server/api/[...path].ts` 与 `server/routes/media/[...path].ts` 转发到后端；上游地址来自 `runtimeConfig.public.apiBase` / `mediaBase`，生产用环境变量覆盖，**不用改构建**：

```bash
# apps/<app>/.env，然后 pnpm --filter <app> serve（serve 脚本用 lingxi-env 读 .env）
NUXT_PUBLIC_API_BASE=https://api.example.com/api
NUXT_PUBLIC_MEDIA_BASE=https://api.example.com/media
```

- 这里用 handler 而不是 `routeRules: { '/api/**': { proxy } }`：后者的目标是构建期字面量，换环境要重新构建。
- 生产若用反向代理（nginx / Caddy / 平台 ingress）直接接管 `/api`、`/media`，把 `@ws/app-preset` 里对应的 `addServerHandler` 去掉即可（Nitro 只做 SSR）；需要注入内部头、改写 cookie 时再放回 Node。

## 常用命令

```bash
pnpm --filter main dev     # 桌面端前端（Tauri 的 devUrl 指到这里）
pnpm exec tauri dev        # 开桌面窗口（带 Rust 端）
pnpm --filter admin dev    # 后台
pnpm --filter main build   # 构建前端（Tauri 打包会调用它）
pnpm gen:api               # 后端在线时重新生成 API 客户端
pnpm --filter admin gen:ui -- select   # 从 shadcn 拉一个基础件到 @ws/ink/ui（见 packages/ink/README.md）
pnpm lint                  # eslint（prettier 走 pnpm format）
```
