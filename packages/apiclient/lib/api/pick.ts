/* eslint-disable @typescript-eslint/no-explicit-any */
import * as defaults from './defaults'
import type Types from './globals'

const definePick = <T extends object>(
  pickFn: (obj: any, opts?: { fillAll?: boolean }) => Partial<T>,
  pkFn: (obj: any) => Partial<T>,
  defaultFn: (opts?: { fillAll?: boolean }) => T,
) => {
  function pick<O extends Partial<T>>(obj: any, opts?: { fillAll: true; override?: O }): Required<T> & O
  function pick<O extends Partial<T>>(obj: any, opts?: { fillAll?: boolean; override?: O }): T & O
  function pick<O extends Partial<T>>(obj: any, opts?: { fillAll?: boolean; override?: O }): T & O {
    const { fillAll = false, override } = opts ?? {}

    let base
    if (obj === null || obj === undefined) {
      base = defaultFn({ fillAll })
    } else {
      base = pickFn(obj, opts)

      for (const [k, v] of Object.entries(defaultFn({ fillAll }))) {
        if (base[k as keyof T] === undefined) base[k as keyof T] = v
      }

      for (const [k, v] of Object.entries(pkFn(obj))) {
        base[k as keyof T] = (v as T[keyof T]) ?? base[k as keyof T]
      }
    }
    return {
      ...base,
      ...override,
    } as T & O
  }
  return pick
}

export const pickAuthStateResponse = definePick<Types.AuthStateResponse>(
  (obj, opts) => ({
    user: pickUserResponse(obj?.user, opts)
  }),
  (obj) => ({}),
  defaults.defaultAuthStateResponse
)

export const pickChangePasswordRequest = definePick<Types.ChangePasswordRequest>(
  (obj, opts) => ({
    new_password: obj?.new_password,
    old_password: obj?.old_password
  }),
  (obj) => ({}),
  defaults.defaultChangePasswordRequest
)

export const pickCreateUserRequest = definePick<Types.CreateUserRequest>(
  (obj, opts) => ({
    password: obj?.password,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.defaultCreateUserRequest
)

export const pickErrorResponse = definePick<Types.ErrorResponse>(
  (obj, opts) => ({
    code: obj?.code,
    detail: obj?.detail,
    errors: obj?.errors
  }),
  (obj) => ({}),
  defaults.defaultErrorResponse
)

export const pickHelloRequest = definePick<Types.HelloRequest>(
  (obj, opts) => ({
    name: obj?.name
  }),
  (obj) => ({}),
  defaults.defaultHelloRequest
)

export const pickHelloResponse = definePick<Types.HelloResponse>(
  (obj, opts) => ({
    message: obj?.message
  }),
  (obj) => ({}),
  defaults.defaultHelloResponse
)

export const pickLoginRequest = definePick<Types.LoginRequest>(
  (obj, opts) => ({
    password: obj?.password,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.defaultLoginRequest
)

export const pickLoginResponse = definePick<Types.LoginResponse>(
  (obj, opts) => ({
    state: pickAuthStateResponse(obj?.state, opts)
  }),
  (obj) => ({}),
  defaults.defaultLoginResponse
)

export const pickMessageResponse = definePick<Types.MessageResponse>(
  (obj, opts) => ({
    message: obj?.message
  }),
  (obj) => ({}),
  defaults.defaultMessageResponse
)

export const pickUpdateUsernameRequest = definePick<Types.UpdateUsernameRequest>(
  (obj, opts) => ({
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.defaultUpdateUsernameRequest
)

export const pickUserListResponse = definePick<Types.UserListResponse>(
  (obj, opts) => ({
    page: obj?.page,
    per_page: obj?.per_page,
    total: obj?.total,
    users: obj?.users?.map((i: any) => pickUserResponse(i, opts))
  }),
  (obj) => ({}),
  defaults.defaultUserListResponse
)

export const pickUserResponse = definePick<Types.UserResponse>(
  (obj, opts) => ({
    created_at: obj?.created_at,
    id: obj?.id,
    updated_at: obj?.updated_at,
    username: obj?.username
  }),
  (obj) => ({}),
  defaults.defaultUserResponse
)
