<script setup lang="ts">
import {
  HomeIcon,
  ChevronRightIcon,
  LinkIcon,
  LayoutDashboardIcon,
} from "lucide-vue-next";

definePageMeta({
  layout: "app",
  middleware: ["protected"],
});

useHead({
  title: "Links | Link Shortner",
});
</script>

<template>
  <div class="bg-neutral-50/50 px-4 py-6 border-b border-border">
    <ol class="flex items-center max-w-2xl mx-auto">
      <li class="flex items-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center hover:underline hover:underline-offset-4 font-medium"
          ><HomeIcon class="mr-2 w-4 h-4" />Home</NuxtLink
        >
        <ChevronRightIcon class="mx-1 w-4 h-4 stroke-primary" />
      </li>
      <li class="flex items-center">
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center hover:underline hover:underline-offset-4 font-medium"
          ><LayoutDashboardIcon class="mr-2 w-4 h-4" />Dashboard</NuxtLink
        >
        <ChevronRightIcon class="mx-1 w-4 h-4 stroke-primary" />
      </li>
      <li class="flex items-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center pointer-events-none cursor-default opacity-70"
          aria-disabled="true"
          ><LinkIcon class="mr-2 w-4 h-4" />Links</NuxtLink
        >
      </li>
    </ol>
  </div>

  <div class="py-8"></div>
</template>
