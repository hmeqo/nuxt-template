<template>
  <!--
    拖拽区：Tauri 注入的 drag.js（src/window/scripts/drag.js）已经在 mousedown 上实现
    “拖动窗口 + 双击切换最大化”，所以这里不能自己再挂 dblclick，否则会和内建行为互相抵消。
  -->
  <div data-tauri-drag-region />
</template>
