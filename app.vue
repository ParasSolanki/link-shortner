<script setup lang="ts">
const { colorMode } = useColorMode();

useHead({
  htmlAttrs: {
    class: colorMode.value.preference,
  },
});
</script>

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
