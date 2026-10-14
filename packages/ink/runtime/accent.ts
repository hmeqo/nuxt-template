/**
 * 把强调色偏好写到 `<html data-accent>`（SSR 一起渲染，不会闪）。
 */
export default defineNuxtPlugin(() => {
  const accent = useInkAccent()

  useHead({
    htmlAttrs: {
      'data-accent': accent,
    },
  })
})
