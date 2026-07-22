<template>
  <div class="flex h-full">
    <AppSidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <AppContentToolbar />
      <main class="flex-1 overflow-auto">
        <div class="mx-auto max-w-7xl p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
