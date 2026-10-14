import type { Result } from '../lib/binding'

/** Rust 侧错误统一是 `IpcError { message }`（见 src-tauri/src/error.rs）；这里守住 IPC 边界 */
function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return String(error)
}

export async function ipc<T, E>(run: () => Promise<Result<T, E>>): Promise<T> {
  const result = await run()
  if (result.status === 'error') throw new Error(errorMessage(result.error))
  return result.data
}
