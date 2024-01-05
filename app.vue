<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster
      rich-colors
      close-button
      position="top-right"
      :toast-options="{ className: 'font-sans' }"
    />
  </NuxtLayout>
</template>
