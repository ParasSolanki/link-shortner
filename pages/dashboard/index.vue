<script setup lang="ts">
import { LinkIcon, MousePointerClickIcon } from "lucide-vue-next";

definePageMeta({
  layout: "app",
  middleware: ["protected"],
});

useHead({
  title: "Dashboard | Link Shortner",
});

const { data, refresh } = await useFetch("/api/link/states", {
  key: "links-states",
});

function refreshStates() {
  refresh();
}

onMounted(() => {
  window.addEventListener("focus", refreshStates);
});

onBeforeUnmount(() => {
  window.removeEventListener("focus", refreshStates);
});

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});
const formatter = new Intl.NumberFormat("en-US");
</script>

<template>
  <div class="container mx-auto border-b border-b-border px-4 py-6 space-y-6">
    <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="font-semibold"> Total Links </CardTitle>
          <LinkIcon class="w-6 h-6" />
        </CardHeader>
        <CardContent>
          <span class="text-2xl text-muted-foreground">{{
            data?.states.totalLinks
              ? compactFormatter.format(data.states.totalLinks)
              : 0
          }}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="font-semibold"> Total Visits </CardTitle>
          <MousePointerClickIcon class="w-6 h-6" />
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <span class="text-2xl text-muted-foreground">{{
                  data?.states.totalVisits
                    ? compactFormatter.format(data.states.totalVisits)
                    : 0
                }}</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  <strong>{{
                    data?.states.totalVisits
                      ? formatter.format(data.states.totalVisits)
                      : 0
                  }}</strong>
                  Total Visits
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>

    <LinksTable />
  </div>
</template>
