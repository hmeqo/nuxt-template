<template>
  <UiTooltipProvider :delay-duration="300">
    <div class="min-h-dvh bg-background">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <InkToaster />
  </UiTooltipProvider>
</template>
