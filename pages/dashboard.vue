<script setup lang="ts">
definePageMeta({
  layout: "app",
  middleware: ["protected"],
});

useHead({
  title: "Dashboard | Link Shortner",
});
</script>

<template>
  <div class="container mx-auto border-b border-b-border px-4 py-6"></div>
</template>
