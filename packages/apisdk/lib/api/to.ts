/* eslint-disable @typescript-eslint/no-explicit-any */
import * as defaults from './defaults'
import type Types from './globals'
import { deepFill } from '@remqo/util/lib'

type DefineToFn<T> = {
  (obj: any): T
  <O extends object>(obj: any, fnOverride: (obj?: any) => O): O
}

const defineTo = <T extends object>(
  toFn: (obj: any) => Partial<T>,
  pkFn: (obj: any) => Partial<T>,
  fn: (obj?: any) => T,
): DefineToFn<T> => {
  return <O extends object>(obj: any, fnOverride?: (obj?: any) => O): T | O => {
    const result: Partial<T> = obj != null ? toFn(obj) : {}

    if (obj != null) {
      for (const [k, v] of Object.entries(pkFn(obj))) {
        if (v !== undefined) result[k as keyof T] = v as T[keyof T]
      }
    }

    const source = (fnOverride ?? fn)(result);
    deepFill(result, source);

    return result as T | O;
  }
}

export const $toAuthStateResp: DefineToFn<Types.AuthStateResp> = defineTo<Types.AuthStateResp>(
  (obj) => ({
    permissions: obj?.permissions,
    user: $toUserResp(obj?.user)
  }),
  (obj) => ({}),
  defaults.$initAuthStateResp
)

export const $toChangePasswordReq: DefineToFn<Types.ChangePasswordReq> = defineTo<Types.ChangePasswordReq>(
  (obj) => ({
    new_password: obj?.new_password,
    old_password: obj?.old_password
  }),
  (obj) => ({}),
  defaults.$initChangePasswordReq
)

export const $toCreateUserReq: DefineToFn<Types.CreateUserReq> = defineTo<Types.CreateUserReq>(
  (obj) => ({
    password: obj?.password,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.$initCreateUserReq
)

export const $toErrorResp: DefineToFn<Types.ErrorResp> = defineTo<Types.ErrorResp>(
  (obj) => ({
    code: obj?.code,
    errors: obj?.errors,
    message: obj?.message
  }),
  (obj) => ({}),
  defaults.$initErrorResp
)

export const $toFileListResp: DefineToFn<Types.FileListResp> = defineTo<Types.FileListResp>(
  (obj) => ({
    files: obj?.files?.map((i: any) => $toFileResp(i)),
    page: obj?.page,
    per_page: obj?.per_page,
    total: obj?.total
  }),
  (obj) => ({}),
  defaults.$initFileListResp
)

export const $toFileResp: DefineToFn<Types.FileResp> = defineTo<Types.FileResp>(
  (obj) => ({
    attached_at: obj?.attached_at,
    created_at: obj?.created_at,
    hash: obj?.hash,
    height: obj?.height,
    id: obj?.id,
    mime_type: obj?.mime_type,
    original_name: obj?.original_name,
    size: obj?.size,
    state: obj?.state,
    thumbnail_url: obj?.thumbnail_url,
    url: obj?.url,
    width: obj?.width
  }),
  (obj) => ({}),
  defaults.$initFileResp
)

export const $toLoginReq: DefineToFn<Types.LoginReq> = defineTo<Types.LoginReq>(
  (obj) => ({
    password: obj?.password,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.$initLoginReq
)

export const $toLoginResp: DefineToFn<Types.LoginResp> = defineTo<Types.LoginResp>(
  (obj) => ({
    access_token: obj?.access_token,
    refresh_token: obj?.refresh_token,
    state: $toAuthStateResp(obj?.state)
  }),
  (obj) => ({}),
  defaults.$initLoginResp
)

export const $toMessageResp: DefineToFn<Types.MessageResp> = defineTo<Types.MessageResp>(
  (obj) => ({
    message: obj?.message
  }),
  (obj) => ({}),
  defaults.$initMessageResp
)

export const $toRefreshReq: DefineToFn<Types.RefreshReq> = defineTo<Types.RefreshReq>(
  (obj) => ({
    refresh_token: obj?.refresh_token
  }),
  (obj) => ({}),
  defaults.$initRefreshReq
)

export const $toRefreshResp: DefineToFn<Types.RefreshResp> = defineTo<Types.RefreshResp>(
  (obj) => ({
    access_token: obj?.access_token,
    refresh_token: obj?.refresh_token
  }),
  (obj) => ({}),
  defaults.$initRefreshResp
)

export const $toResetPasswordReq: DefineToFn<Types.ResetPasswordReq> = defineTo<Types.ResetPasswordReq>(
  (obj) => ({
    new_password: obj?.new_password
  }),
  (obj) => ({}),
  defaults.$initResetPasswordReq
)

export const $toSessionListResp: DefineToFn<Types.SessionListResp> = defineTo<Types.SessionListResp>(
  (obj) => ({
    sessions: obj?.sessions?.map((i: any) => $toSessionResp(i))
  }),
  (obj) => ({}),
  defaults.$initSessionListResp
)

export const $toSessionResp: DefineToFn<Types.SessionResp> = defineTo<Types.SessionResp>(
  (obj) => ({
    created_at: obj?.created_at,
    current: obj?.current,
    expires_at: obj?.expires_at,
    id: obj?.id,
    ip: obj?.ip,
    user_agent: obj?.user_agent
  }),
  (obj) => ({}),
  defaults.$initSessionResp
)

export const $toUpdateUsernameReq: DefineToFn<Types.UpdateUsernameReq> = defineTo<Types.UpdateUsernameReq>(
  (obj) => ({
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.$initUpdateUsernameReq
)

export const $toUploadForm: DefineToFn<Types.UploadForm> = defineTo<Types.UploadForm>(
  (obj) => ({
    file: obj?.file
  }),
  (obj) => ({}),
  defaults.$initUploadForm
)

export const $toUserListResp: DefineToFn<Types.UserListResp> = defineTo<Types.UserListResp>(
  (obj) => ({
    page: obj?.page,
    per_page: obj?.per_page,
    total: obj?.total,
    users: obj?.users?.map((i: any) => $toUserResp(i))
  }),
  (obj) => ({}),
  defaults.$initUserListResp
)

export const $toUserResp: DefineToFn<Types.UserResp> = defineTo<Types.UserResp>(
  (obj) => ({
    created_at: obj?.created_at,
    id: obj?.id,
    updated_at: obj?.updated_at,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.$initUserResp
)
