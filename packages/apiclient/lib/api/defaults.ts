/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unified-signatures */
import type Types from './globals'
import { defu } from 'defu'

export type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: T[K] extends (infer U)[] ? DeepRequired<U>[] : T[K] extends object ? DeepRequired<T[K]> : T[K] }
  : T

export type DeepNotNull<T> = T extends object
  ? { [K in keyof T]-?: T[K] extends (infer U)[] ? DeepNotNull<U>[] : T[K] extends object ? DeepNotNull<T[K]> : NonNullable<T[K]> }
  : NonNullable<T>

type DefineFullFn<T> = {
  (): DeepRequired<T>
  (obj: Partial<DeepRequired<T>>): DeepRequired<T>
  (opts: { obj?: Partial<DeepNotNull<T>>; notNull: true }): DeepNotNull<T>
  (opts: { obj?: Partial<DeepRequired<T>>; notNull?: false }): DeepRequired<T>
}

type DefineInitFn<T> = {
  <O extends Partial<T> & Record<string, any>>(obj?: O): T
}

const defineFull = <T>(
  fields: (notNull: any, obj?: any) => DeepRequired<T>,
): DefineFullFn<T> => {
  return (arg?: any): any => {
    const { notNull, obj } = arg?.notNull === undefined ? { notNull: false, obj: arg } : arg as { notNull: boolean; obj?: any }
    if (!obj) return fields(notNull)
    return defu(obj, fields(notNull, obj) as any)
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

export const defaultPerm = (): Types.Perm => "*"

export const defaultI64 = (): number => 0

export const fullAuthStateResp: DefineFullFn<Types.AuthStateResp> = defineFull<Types.AuthStateResp>(
  (notNull, obj) => ({
    permissions: [],
    user: fullUserResp({ notNull, obj: obj?.user })
  })
)

export const initAuthStateResp: DefineInitFn<Types.AuthStateResp> = defineInit<Types.AuthStateResp>(
  (obj) => ({
    permissions: [],
    user: initUserResp(obj?.user)
  })
)

export const fullChangePasswordReq: DefineFullFn<Types.ChangePasswordReq> = defineFull<Types.ChangePasswordReq>(
  (notNull, obj) => ({
    new_password: '',
    old_password: ''
  })
)

export const initChangePasswordReq: DefineInitFn<Types.ChangePasswordReq> = defineInit<Types.ChangePasswordReq>(
  (obj) => ({
    new_password: '',
    old_password: ''
  })
)

export const fullCreateUserReq: DefineFullFn<Types.CreateUserReq> = defineFull<Types.CreateUserReq>(
  (notNull, obj) => ({
    password: '',
    username: ''
  })
)

export const initCreateUserReq: DefineInitFn<Types.CreateUserReq> = defineInit<Types.CreateUserReq>(
  (obj) => ({
    password: '',
    username: ''
  })
)

export const fullErrorResp: DefineFullFn<Types.ErrorResp> = defineFull<Types.ErrorResp>(
  (notNull, obj) => ({
    code: '',
    detail: notNull ? '' : null,
    errors: {}
  })
)

export const initErrorResp: DefineInitFn<Types.ErrorResp> = defineInit<Types.ErrorResp>(
  (obj) => ({
    code: ''
  })
)

export const fullHelloReq: DefineFullFn<Types.HelloReq> = defineFull<Types.HelloReq>(
  (notNull, obj) => ({
    name: ''
  })
)

export const initHelloReq: DefineInitFn<Types.HelloReq> = defineInit<Types.HelloReq>(
  (obj) => ({
    name: ''
  })
)

export const fullHelloResp: DefineFullFn<Types.HelloResp> = defineFull<Types.HelloResp>(
  (notNull, obj) => ({
    message: ''
  })
)

export const initHelloResp: DefineInitFn<Types.HelloResp> = defineInit<Types.HelloResp>(
  (obj) => ({
    message: ''
  })
)

export const fullLoginReq: DefineFullFn<Types.LoginReq> = defineFull<Types.LoginReq>(
  (notNull, obj) => ({
    password: '',
    username: ''
  })
)

export const initLoginReq: DefineInitFn<Types.LoginReq> = defineInit<Types.LoginReq>(
  (obj) => ({
    password: '',
    username: ''
  })
)

export const fullLoginResp: DefineFullFn<Types.LoginResp> = defineFull<Types.LoginResp>(
  (notNull, obj) => ({
    state: fullAuthStateResp({ notNull, obj: obj?.state })
  })
)

export const initLoginResp: DefineInitFn<Types.LoginResp> = defineInit<Types.LoginResp>(
  (obj) => ({
    state: initAuthStateResp(obj?.state)
  })
)

export const fullMessageResp: DefineFullFn<Types.MessageResp> = defineFull<Types.MessageResp>(
  (notNull, obj) => ({
    message: ''
  })
)

export const initMessageResp: DefineInitFn<Types.MessageResp> = defineInit<Types.MessageResp>(
  (obj) => ({
    message: ''
  })
)

export const fullUpdateUsernameReq: DefineFullFn<Types.UpdateUsernameReq> = defineFull<Types.UpdateUsernameReq>(
  (notNull, obj) => ({
    username: ''
  })
)

export const initUpdateUsernameReq: DefineInitFn<Types.UpdateUsernameReq> = defineInit<Types.UpdateUsernameReq>(
  (obj) => ({
    username: ''
  })
)

export const fullUserListResp: DefineFullFn<Types.UserListResp> = defineFull<Types.UserListResp>(
  (notNull, obj) => ({
    page: 0,
    per_page: 0,
    total: 0,
    users: []
  })
)

export const initUserListResp: DefineInitFn<Types.UserListResp> = defineInit<Types.UserListResp>(
  (obj) => ({
    page: 0,
    per_page: 0,
    total: 0,
    users: []
  })
)

export const fullUserResp: DefineFullFn<Types.UserResp> = defineFull<Types.UserResp>(
  (notNull, obj) => ({
    created_at: '',
    id: defaultI64(),
    updated_at: '',
    username: ''
  })
)

export const initUserResp: DefineInitFn<Types.UserResp> = defineInit<Types.UserResp>(
  (obj) => ({
    created_at: '',
    id: defaultI64(),
    updated_at: '',
    username: ''
  })
)
