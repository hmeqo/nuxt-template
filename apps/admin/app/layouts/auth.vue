<template>
  <!-- 登录/匿名页外壳：居中一块卡；admin 不是 Tauri 端，所以这里没有 Titlebar（对比 main 的 auth 布局） -->
  <div class="flex min-h-dvh flex-col">
    <div class="flex flex-1 items-center justify-center p-6">
      <slot />
    </div>
  </div>
</template>
