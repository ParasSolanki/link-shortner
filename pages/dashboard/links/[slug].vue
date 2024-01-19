<script setup lang="ts">
import {
  HomeIcon,
  ChevronRightIcon,
  LinkIcon,
  LayoutDashboardIcon,
  Share2Icon,
  BarChartIcon,
} from "lucide-vue-next";

import { z } from "zod";
import { buttonVariants } from "~/components/ui/button";

definePageMeta({
  layout: "app",
  middleware: ["protected"],
});

useHead({
  title: "Links | Link Shortner",
});

const router = useRouter();
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

const intervalQuerySchema = z
  .union([
    z.literal("1d"),
    z.literal("7d"),
    z.literal("30d"),
    z.literal("90d"),
    z.literal("all"),
  ])
  .default("30d");
const selectedFilter = computed(() => {
  const result = intervalQuerySchema.safeParse(route.query.interval);

  return result.success ? result.data : "30d";
});

// TODO: handle link not found
const { data, error } = await useFetch(`/api/link/${slug}/metrics`, {
  query: computed(() => ({ interval: selectedFilter.value })),
});

const shortLink = computed(() =>
  data.value?.link.slug ? `http://localhost:3000/${data.value?.link.slug}` : ""
);

function handleShareLink() {
  window.navigator.share({
    url: shortLink.value,
  });
}

function handleUpdateFilter(value: string) {
  router.replace({ query: { interval: value } });
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});
const formatter = new Intl.NumberFormat("en-US");
</script>

<template>
  <div
    class="bg-neutral-50/50 dark:bg-neutral-900 px-4 py-6 border-b border-border"
  >
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

  <template v-if="!error">
    <div class="py-8 max-w-4xl mx-auto px-4">
      <div class="flex justify-between items-center">
        <h4 class="font-bold text-3xl">{{ data?.link.slug }}</h4>

        <div class="flex items-center space-x-3">
          <Button size="sm" class="h-8" @click="handleShareLink">
            <Share2Icon class="w-4 h-4 mr-1" />
            Share</Button
          >
          <Select
            :model-value="selectedFilter"
            @update:model-value="handleUpdateFilter"
          >
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

      <div class="mt-10">
        <div class="flex space-x-1 justify-start items-end flex-grow-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <span class="text-2xl md:text-4xl font-bold">{{
                  data?.totalVisits
                    ? compactFormatter.format(data.totalVisits)
                    : 0
                }}</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  <strong>{{
                    data?.totalVisits ? formatter.format(data.totalVisits) : 0
                  }}</strong>
                  Total Visits
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span class="text-lg ml-1">Visits</span>

          <BarChartIcon class="w-6 h-8 ml-1" />
        </div>

        <p class="text-muted-foreground text-sm uppercase">Total Visits</p>
      </div>

      <div class="mt-10">
        <ClientOnly>
          <template #fallback>
            <span class="text-base">Loading Chart...</span>
          </template>
          <LinkBarChart :data="data?.timeseries" />
        </ClientOnly>
      </div>
    </div>
  </template>
  <template v-else>
    <div
      class="max-w-2xl mx-auto px-4 space-y-8 text-center flex justify-center items-center flex-col h-96"
    >
      <p class="text-base md:text-xl">
        {{ error.data.statusMessage ?? "Link does not exists" }}
      </p>

      <NuxtLink to="/dashboard" :class="buttonVariants()"
        >Go Dashboard</NuxtLink
      >
    </div>
  </template>
</template>

<style>
:root {
  --vis-font-family: "Geist", "ui-sans-serif", "system-ui", "sans-serif",
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

  --vis-tooltip-padding: 0px;
  --vis-tooltip-border-color: transparent;
  --vis-tooltip-background-color: transparent;
  --vis-dark-tooltip-background-color: transparent;
  --vis-dark-tooltip-background-color: transparent;
}
</style>
