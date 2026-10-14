/** 编辑器偏好：cookie 存（服务端可读，首帧就一致），外观面板与文档区读同一份 */
export function useEditorPrefs() {
  return {
    wrap: useCookieState<boolean>('editor-wrap', { default: () => true }),
    fontSize: useCookieState<number>('editor-font-size', { default: () => 13 }),
  }
}
