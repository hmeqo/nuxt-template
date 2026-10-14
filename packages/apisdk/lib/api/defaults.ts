/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unified-signatures */
import type Types from './globals'
import defu from 'defu'
import { v4 as uuidv4 } from 'uuid'

export type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: T[K] extends (infer U)[] ? DeepRequired<U>[] : T[K] extends object ? DeepRequired<T[K]> : T[K] }
  : T

export type DeepNotNull<T> = T extends object
  ? { [K in keyof T]-?: T[K] extends (infer U)[] ? DeepNotNull<U>[] : T[K] extends object ? DeepNotNull<T[K]> : NonNullable<T[K]> }
  : NonNullable<T>

type DefineFullFn<T> = {
  (): DeepRequired<T>
  (input: Partial<DeepRequired<T>>): DeepRequired<T>
  (opts: { input?: Partial<DeepNotNull<T>>; notNull: true }): DeepNotNull<T>
  (opts: { input?: Partial<DeepRequired<T>>; notNull?: false }): DeepRequired<T>
}

type DefineInitFn<T> = {
  <O extends Partial<T> & Record<string, any>>(obj?: O): T
}

const defineFull = <T>(
  fields: (notNull: any, input?: any) => DeepRequired<T>,
): DefineFullFn<T> => {
  return (arg?: any): any => {
    const { notNull, input } = arg?.notNull === undefined ? { notNull: false, input: arg } : arg as { notNull: boolean; input?: any }
    if (!input) return fields(notNull)
    return defu(input, fields(notNull, input) as any)
  }
}

const defineInit = <T>(
  fields: (obj?: any) => T,
): DefineInitFn<T> => {
  return <O extends Partial<T> & Record<string, any>>(obj?: O): T => {
    if (!obj) return fields()
    return defu(obj, fields(obj) as any) as T
  }
}

export const $defaultErrorCode = (): Types.ErrorCode => "input.invalid_fields"

export const $defaultFileId = (): Types.FileId => uuidv4()

export const $defaultFileStateCode = (): Types.FileStateCode => "draft"

export const $defaultPerm = (): Types.Perm => "*"

export const $defaultSessionId = (): number => 0

export const $defaultUserId = (): number => 0

export const $fullAuthStateResp: DefineFullFn<Types.AuthStateResp> = defineFull<Types.AuthStateResp>(
  (notNull, input) => ({
    permissions: [],
    user: $fullUserResp({ notNull, input: input?.user })
  })
)

export const $initAuthStateResp: DefineInitFn<Types.AuthStateResp> = defineInit<Types.AuthStateResp>(
  (input) => ({
    permissions: [],
    user: $initUserResp(input?.user)
  })
)

export const $fullChangePasswordReq: DefineFullFn<Types.ChangePasswordReq> = defineFull<Types.ChangePasswordReq>(
  (notNull, input) => ({
    new_password: '',
    old_password: ''
  })
)

export const $initChangePasswordReq: DefineInitFn<Types.ChangePasswordReq> = defineInit<Types.ChangePasswordReq>(
  (input) => ({
    new_password: '',
    old_password: ''
  })
)

export const $fullCreateUserReq: DefineFullFn<Types.CreateUserReq> = defineFull<Types.CreateUserReq>(
  (notNull, input) => ({
    password: '',
    username: ''
  })
)

export const $initCreateUserReq: DefineInitFn<Types.CreateUserReq> = defineInit<Types.CreateUserReq>(
  (input) => ({
    password: '',
    username: ''
  })
)

export const $fullErrorResp: DefineFullFn<Types.ErrorResp> = defineFull<Types.ErrorResp>(
  (notNull, input) => ({
    code: $defaultErrorCode(),
    errors: {},
    message: ''
  })
)

export const $initErrorResp: DefineInitFn<Types.ErrorResp> = defineInit<Types.ErrorResp>(
  (input) => ({
    message: ''
  })
)

export const $fullFileListResp: DefineFullFn<Types.FileListResp> = defineFull<Types.FileListResp>(
  (notNull, input) => ({
    files: [],
    page: 0,
    per_page: 0,
    total: 0
  })
)

export const $initFileListResp: DefineInitFn<Types.FileListResp> = defineInit<Types.FileListResp>(
  (input) => ({
    files: [],
    page: 0,
    per_page: 0,
    total: 0
  })
)

export const $fullFileResp: DefineFullFn<Types.FileResp> = defineFull<Types.FileResp>(
  (notNull, input) => ({
    attached_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    hash: '',
    height: notNull ? 0 : null,
    id: $defaultFileId(),
    mime_type: '',
    original_name: '',
    size: 0,
    state: $defaultFileStateCode(),
    thumbnail_url: notNull ? '' : null,
    url: '',
    width: notNull ? 0 : null
  })
)

export const $initFileResp: DefineInitFn<Types.FileResp> = defineInit<Types.FileResp>(
  (input) => ({
    attached_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    hash: '',
    id: $defaultFileId(),
    mime_type: '',
    original_name: '',
    size: 0,
    state: $defaultFileStateCode(),
    url: ''
  })
)

export const $fullLoginReq: DefineFullFn<Types.LoginReq> = defineFull<Types.LoginReq>(
  (notNull, input) => ({
    password: '',
    username: ''
  })
)

export const $initLoginReq: DefineInitFn<Types.LoginReq> = defineInit<Types.LoginReq>(
  (input) => ({
    password: '',
    username: ''
  })
)

export const $fullLoginResp: DefineFullFn<Types.LoginResp> = defineFull<Types.LoginResp>(
  (notNull, input) => ({
    access_token: '',
    refresh_token: '',
    state: $fullAuthStateResp({ notNull, input: input?.state })
  })
)

export const $initLoginResp: DefineInitFn<Types.LoginResp> = defineInit<Types.LoginResp>(
  (input) => ({
    access_token: '',
    refresh_token: '',
    state: $initAuthStateResp(input?.state)
  })
)

export const $fullMessageResp: DefineFullFn<Types.MessageResp> = defineFull<Types.MessageResp>(
  (notNull, input) => ({
    message: ''
  })
)

export const $initMessageResp: DefineInitFn<Types.MessageResp> = defineInit<Types.MessageResp>(
  (input) => ({
    message: ''
  })
)

export const $fullRefreshReq: DefineFullFn<Types.RefreshReq> = defineFull<Types.RefreshReq>(
  (notNull, input) => ({
    refresh_token: ''
  })
)

export const $initRefreshReq: DefineInitFn<Types.RefreshReq> = defineInit<Types.RefreshReq>(
  (input) => ({
    refresh_token: ''
  })
)

export const $fullRefreshResp: DefineFullFn<Types.RefreshResp> = defineFull<Types.RefreshResp>(
  (notNull, input) => ({
    access_token: '',
    refresh_token: ''
  })
)

export const $initRefreshResp: DefineInitFn<Types.RefreshResp> = defineInit<Types.RefreshResp>(
  (input) => ({
    access_token: '',
    refresh_token: ''
  })
)

export const $fullResetPasswordReq: DefineFullFn<Types.ResetPasswordReq> = defineFull<Types.ResetPasswordReq>(
  (notNull, input) => ({
    new_password: ''
  })
)

export const $initResetPasswordReq: DefineInitFn<Types.ResetPasswordReq> = defineInit<Types.ResetPasswordReq>(
  (input) => ({
    new_password: ''
  })
)

export const $fullSessionListResp: DefineFullFn<Types.SessionListResp> = defineFull<Types.SessionListResp>(
  (notNull, input) => ({
    sessions: []
  })
)

export const $initSessionListResp: DefineInitFn<Types.SessionListResp> = defineInit<Types.SessionListResp>(
  (input) => ({
    sessions: []
  })
)

export const $fullSessionResp: DefineFullFn<Types.SessionResp> = defineFull<Types.SessionResp>(
  (notNull, input) => ({
    created_at: new Date().toISOString(),
    current: false,
    expires_at: new Date().toISOString(),
    id: $defaultSessionId(),
    ip: notNull ? '' : null,
    user_agent: notNull ? '' : null
  })
)

export const $initSessionResp: DefineInitFn<Types.SessionResp> = defineInit<Types.SessionResp>(
  (input) => ({
    created_at: new Date().toISOString(),
    current: false,
    expires_at: new Date().toISOString(),
    id: $defaultSessionId()
  })
)

export const $fullUpdateUsernameReq: DefineFullFn<Types.UpdateUsernameReq> = defineFull<Types.UpdateUsernameReq>(
  (notNull, input) => ({
    username: ''
  })
)

export const $initUpdateUsernameReq: DefineInitFn<Types.UpdateUsernameReq> = defineInit<Types.UpdateUsernameReq>(
  (input) => ({
    username: ''
  })
)

export const $fullUploadForm: DefineFullFn<Types.UploadForm> = defineFull<Types.UploadForm>(
  (notNull, input) => ({
    file: new Blob([])
  })
)

export const $initUploadForm: DefineInitFn<Types.UploadForm> = defineInit<Types.UploadForm>(
  (input) => ({
    file: new Blob([])
  })
)

export const $fullUserListResp: DefineFullFn<Types.UserListResp> = defineFull<Types.UserListResp>(
  (notNull, input) => ({
    page: 0,
    per_page: 0,
    total: 0,
    users: []
  })
)

export const $initUserListResp: DefineInitFn<Types.UserListResp> = defineInit<Types.UserListResp>(
  (input) => ({
    page: 0,
    per_page: 0,
    total: 0,
    users: []
  })
)

export const $fullUserResp: DefineFullFn<Types.UserResp> = defineFull<Types.UserResp>(
  (notNull, input) => ({
    created_at: new Date().toISOString(),
    id: $defaultUserId(),
    updated_at: new Date().toISOString(),
    username: ''
  })
)

export const $initUserResp: DefineInitFn<Types.UserResp> = defineInit<Types.UserResp>(
  (input) => ({
    created_at: new Date().toISOString(),
    id: $defaultUserId(),
    updated_at: new Date().toISOString(),
    username: ''
  })
)
