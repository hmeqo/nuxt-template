import { toast } from '@ws/ink/composables'
import { BizError } from '@remqo/alova/lib'
import type { ErrorCode, ErrorResp } from '../lib/api/globals'

/** 后端业务码 → 中文文案；`Record<ErrorCode, …>` 让后端新增业务码时这里编译报错 */
const ERROR_TEXT: Record<ErrorCode, string> = {
  'input.invalid_fields': '提交的内容不合法，请检查后重试',
  'auth.invalid_credentials': '用户名或密码不正确',
  'auth.session_expired': '登录已过期，请重新登录',
  'auth.refresh_token_invalid': '登录凭证已失效，请重新登录',
  'user.username_taken': '用户名已被占用',
  'user.invalid_old_password': '原密码不正确',
  'role.name_taken': '角色名已被占用',
  'role.already_assigned': '该角色已经分配过了',
  'file.too_large': '文件超过大小上限',
  'realtime.unknown_frame': '实时消息无法识别',
  'realtime.topic_forbidden': '没有权限订阅这个主题',
}

/** 错误体可能是对象，也可能是 JSON 字符串（非 2xx 时上游把响应原文塞进 message） */
function parseBody(body: unknown): ErrorResp | undefined {
  if (body && typeof body === 'object') return body as ErrorResp
  if (typeof body !== 'string') return undefined
  try {
    const parsed: unknown = JSON.parse(body)
    return parsed && typeof parsed === 'object' ? (parsed as ErrorResp) : undefined
  } catch {
    return undefined
  }
}

function bodyText(body: unknown): string | undefined {
  const parsed = parseBody(body)
  if (!parsed) return undefined
  return (parsed.code && ERROR_TEXT[parsed.code]) || parsed.message || undefined
}

export function apiErrorText(error: unknown): string {
  if (error instanceof BizError) return bodyText(error.data) ?? `HTTP ${error.response.status}`

  const message = error instanceof Error ? error.message : String(error)
  return bodyText(message) ?? message
}

export function apiErrorToast(title: string, error: unknown) {
  toast({ title, description: apiErrorText(error), variant: 'destructive' })
}

/**
 * 触发已在 .onError 里做过提示的请求：`send()` 返回的 promise 仍会 reject，
 * 这里吞掉它，避免出现未处理的 rejection（控制台 pageerror）。
 */
export function fire(request: Promise<unknown> | undefined): void {
  void request?.catch(() => {})
}
