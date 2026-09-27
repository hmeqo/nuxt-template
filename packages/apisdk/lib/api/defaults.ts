/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unified-signatures */
import type Types from './globals'
import defu from 'defu'

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

export const $defaultPerm = (): Types.Perm => "*"

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

export const $fullEcho: DefineFullFn<Types.Echo> = defineFull<Types.Echo>(
  (notNull, input) => ({
    message: ''
  })
)

export const $initEcho: DefineInitFn<Types.Echo> = defineInit<Types.Echo>(
  (input) => ({
    message: ''
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

export const $fullFileResp: DefineFullFn<Types.FileResp> = defineFull<Types.FileResp>(
  (notNull, input) => ({
    mime_type: '',
    name: '',
    original_name: '',
    size: 0,
    url: ''
  })
)

export const $initFileResp: DefineInitFn<Types.FileResp> = defineInit<Types.FileResp>(
  (input) => ({
    mime_type: '',
    name: '',
    original_name: '',
    size: 0,
    url: ''
  })
)

export const $fullJwtEchoResp: DefineFullFn<Types.JwtEchoResp> = defineFull<Types.JwtEchoResp>(
  (notNull, input) => ({
    message: '',
    user_id: $defaultUserId(),
    username: ''
  })
)

export const $initJwtEchoResp: DefineInitFn<Types.JwtEchoResp> = defineInit<Types.JwtEchoResp>(
  (input) => ({
    message: '',
    user_id: $defaultUserId(),
    username: ''
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

export const $fullNoParams: DefineFullFn<Types.NoParams> = defineFull<Types.NoParams>(
  (notNull, input) => ({

  })
)

export const $initNoParams: DefineInitFn<Types.NoParams> = defineInit<Types.NoParams>(
  (input) => ({

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

export const $fullSessionRenewResp: DefineFullFn<Types.SessionRenewResp> = defineFull<Types.SessionRenewResp>(
  (notNull, input) => ({
    expires_at: new Date().toISOString()
  })
)

export const $initSessionRenewResp: DefineInitFn<Types.SessionRenewResp> = defineInit<Types.SessionRenewResp>(
  (input) => ({
    expires_at: new Date().toISOString()
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
    file: $fullUploadedFile({ notNull, input: input?.file })
  })
)

export const $initUploadForm: DefineInitFn<Types.UploadForm> = defineInit<Types.UploadForm>(
  (input) => ({
    file: $initUploadedFile(input?.file)
  })
)

export const $fullUploadedFile: DefineFullFn<Types.UploadedFile> = defineFull<Types.UploadedFile>(
  (notNull, input) => ({
    data: new Blob([]),
    mime_type: '',
    name: ''
  })
)

export const $initUploadedFile: DefineInitFn<Types.UploadedFile> = defineInit<Types.UploadedFile>(
  (input) => ({
    data: new Blob([]),
    mime_type: '',
    name: ''
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
