import { dateString, timeString } from '@workspace-hmeqo/util/lib/date'
import type Types from './globals'

const defineDefault = <T>(
  baseFields: (fillAll: boolean) => T,
  optionalFields?: () => Partial<T>
) => {
  function def(opts?: { fillAll: true; override?: Partial<T> }): Required<T>
  function def(opts?: { fillAll?: boolean; override?: Partial<T> }): T
  function def(override?: Partial<T>): T
  function def(optsOrOverride?: { fillAll?: boolean; override?: Partial<T> }): T {
    const isOpts = optsOrOverride && 'fillAll' in optsOrOverride
    const fillAll = isOpts ? (optsOrOverride.fillAll ?? false) : false
    const override = isOpts ? optsOrOverride.override : optsOrOverride

    return {
      ...baseFields(fillAll),
      ...(fillAll && optionalFields ? optionalFields() : undefined),
      ...override,
    } as T
  }
  return def
}

export const defaultAuthStateResponse = defineDefault<Types.AuthStateResponse>(
  (fillAll) => ({
    user: defaultUserResponse({ fillAll })
  }),
  () => ({

  })
)

export const defaultChangePasswordRequest = defineDefault<Types.ChangePasswordRequest>(
  (fillAll) => ({
    new_password: '',
    old_password: ''
  }),
  () => ({

  })
)

export const defaultCreateUserRequest = defineDefault<Types.CreateUserRequest>(
  (fillAll) => ({
    password: '',
    username: ''
  }),
  () => ({

  })
)

export const defaultErrorResponse = defineDefault<Types.ErrorResponse>(
  (fillAll) => ({
    code: ''
  }),
  () => ({
    detail: null,
    errors: undefined
  })
)

export const defaultHelloRequest = defineDefault<Types.HelloRequest>(
  (fillAll) => ({
    name: ''
  }),
  () => ({

  })
)

export const defaultHelloResponse = defineDefault<Types.HelloResponse>(
  (fillAll) => ({
    message: ''
  }),
  () => ({

  })
)

export const defaultLoginRequest = defineDefault<Types.LoginRequest>(
  (fillAll) => ({
    password: '',
    username: ''
  }),
  () => ({

  })
)

export const defaultLoginResponse = defineDefault<Types.LoginResponse>(
  (fillAll) => ({
    state: defaultAuthStateResponse({ fillAll })
  }),
  () => ({

  })
)

export const defaultMessageResponse = defineDefault<Types.MessageResponse>(
  (fillAll) => ({
    message: ''
  }),
  () => ({

  })
)

export const defaultUpdateUsernameRequest = defineDefault<Types.UpdateUsernameRequest>(
  (fillAll) => ({
    username: ''
  }),
  () => ({

  })
)

export const defaultUserListResponse = defineDefault<Types.UserListResponse>(
  (fillAll) => ({
    page: 0,
    per_page: 0,
    total: 0,
    users: []
  }),
  () => ({

  })
)

export const defaultUserResponse = defineDefault<Types.UserResponse>(
  (fillAll) => ({
    created_at: '',
    id: defaultI64({ fillAll }),
    updated_at: '',
    username: ''
  }),
  () => ({

  })
)
