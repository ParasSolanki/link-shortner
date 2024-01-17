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

const route = useRoute();
const slug = route.params.slug;

const filterOptions = [
  {
    text: "Last 1 Day",
    value: "1d",
  },
  {
    text: "Last 7 Days",
    value: "7d",
  },
  {
    text: "Last 30 Days",
    value: "30d",
  },
  {
    text: "Last 3 Months",
    value: "90d",
  },
  {
    text: "All Time",
    value: "all",
  },
];

const selectedFilter = ref("30d");

// TODO: handle link not found
const { data } = await useFetch(`/api/link/${slug}/metrics`, {
  query: computed(() => ({ interval: selectedFilter.value })),
});
</script>

<template>
  <div class="bg-neutral-50/50 px-4 py-6 border-b border-border">
    <ol class="flex items-center max-w-4xl mx-auto px-4">
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

  <div class="py-8 max-w-4xl mx-auto px-4">
    <div class="flex justify-between items-center">
      <h4 class="font-bold text-xl">{{ data?.link.slug }}</h4>
      <Select v-model="selectedFilter">
        <SelectTrigger class="h-8 w-40">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem
            v-for="option in filterOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
