/* eslint-disable @typescript-eslint/no-explicit-any */
import * as defaults from './defaults'
import type Types from './globals'
import { deepFill } from '@ws-hmeqo/util/lib'

type DefinePickFn<T> = {
  (obj: any): T
  <O extends object>(obj: any, fnOverride: (obj?: any) => O): O
}

const definePick = <T extends object>(
  pickFn: (obj: any) => Partial<T>,
  pkFn: (obj: any) => Partial<T>,
  fn: (obj?: any) => T,
): DefinePickFn<T> => {
  return <O extends object>(obj: any, fnOverride?: (obj?: any) => O): T | O => {
    const picked: Partial<T> = obj != null ? pickFn(obj) : {}

    if (obj != null) {
      for (const [k, v] of Object.entries(pkFn(obj))) {
        if (v !== undefined) picked[k as keyof T] = v as T[keyof T]
      }
    }

    const source = (fnOverride ?? fn)(picked);
    deepFill(picked, source);

    return picked as T | O;
  }
}

export const pickAuthStateResp: DefinePickFn<Types.AuthStateResp> = definePick<Types.AuthStateResp>(
  (obj) => ({
    permissions: obj?.permissions,
    user: pickUserResp(obj?.user)
  }),
  (obj) => ({}),
  defaults.initAuthStateResp
)

export const pickChangePasswordReq: DefinePickFn<Types.ChangePasswordReq> = definePick<Types.ChangePasswordReq>(
  (obj) => ({
    new_password: obj?.new_password,
    old_password: obj?.old_password
  }),
  (obj) => ({}),
  defaults.initChangePasswordReq
)

export const pickCreateUserReq: DefinePickFn<Types.CreateUserReq> = definePick<Types.CreateUserReq>(
  (obj) => ({
    password: obj?.password,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.initCreateUserReq
)

export const pickErrorResp: DefinePickFn<Types.ErrorResp> = definePick<Types.ErrorResp>(
  (obj) => ({
    code: obj?.code,
    detail: obj?.detail,
    errors: obj?.errors
  }),
  (obj) => ({}),
  defaults.initErrorResp
)

export const pickHelloReq: DefinePickFn<Types.HelloReq> = definePick<Types.HelloReq>(
  (obj) => ({
    name: obj?.name
  }),
  (obj) => ({}),
  defaults.initHelloReq
)

export const pickHelloResp: DefinePickFn<Types.HelloResp> = definePick<Types.HelloResp>(
  (obj) => ({
    message: obj?.message
  }),
  (obj) => ({}),
  defaults.initHelloResp
)

export const pickLoginReq: DefinePickFn<Types.LoginReq> = definePick<Types.LoginReq>(
  (obj) => ({
    password: obj?.password,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.initLoginReq
)

export const pickLoginResp: DefinePickFn<Types.LoginResp> = definePick<Types.LoginResp>(
  (obj) => ({
    access_token: obj?.access_token,
    refresh_token: obj?.refresh_token,
    state: pickAuthStateResp(obj?.state)
  }),
  (obj) => ({}),
  defaults.initLoginResp
)

export const pickMessageResp: DefinePickFn<Types.MessageResp> = definePick<Types.MessageResp>(
  (obj) => ({
    message: obj?.message
  }),
  (obj) => ({}),
  defaults.initMessageResp
)

export const pickRefreshReq: DefinePickFn<Types.RefreshReq> = definePick<Types.RefreshReq>(
  (obj) => ({
    refresh_token: obj?.refresh_token
  }),
  (obj) => ({}),
  defaults.initRefreshReq
)

export const pickRefreshResp: DefinePickFn<Types.RefreshResp> = definePick<Types.RefreshResp>(
  (obj) => ({
    access_token: obj?.access_token,
    refresh_token: obj?.refresh_token
  }),
  (obj) => ({}),
  defaults.initRefreshResp
)

export const pickUpdateUsernameReq: DefinePickFn<Types.UpdateUsernameReq> = definePick<Types.UpdateUsernameReq>(
  (obj) => ({
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.initUpdateUsernameReq
)

export const pickUserListResp: DefinePickFn<Types.UserListResp> = definePick<Types.UserListResp>(
  (obj) => ({
    page: obj?.page,
    per_page: obj?.per_page,
    total: obj?.total,
    users: obj?.users?.map((i: any) => pickUserResp(i))
  }),
  (obj) => ({}),
  defaults.initUserListResp
)

export const pickUserResp: DefinePickFn<Types.UserResp> = definePick<Types.UserResp>(
  (obj) => ({
    created_at: obj?.created_at,
    id: obj?.id,
    updated_at: obj?.updated_at,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.initUserResp
)
