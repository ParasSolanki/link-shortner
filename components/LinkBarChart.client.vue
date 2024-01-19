<script setup lang="ts">
import {
  VisXYContainer,
  VisStackedBar,
  VisAxis,
  VisTooltip,
} from "@unovis/vue";
import { StackedBar } from "@unovis/ts";
import { format, parseISO, parse } from "date-fns";

const props = defineProps<{ data?: Array<unknown> }>();

const { colorMode } = useColorMode();

const data = computed(() => {
  if (!props.data) return [];

  return props.data.map((d) => {
    let datetime = "";

    if (d.month) {
      datetime = format(parse(d.month, "yyyy-MM", new Date()), "LLL yyyy");
    } else {
      datetime = format(parseISO(d.visitDateTime), "do LLL");
    }

    return {
      visits: d.visits,
      datetime,
    };
  });
});

const triggers = {
  [StackedBar.selectors.bar]: (d) =>
    `<div class="rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
      <p>
        <span class="font-bold text-base">${d.visits}</span>
        <span>Visits</span>
      </p>
      <p class="text-xs text-center">${d.datetime}</p>
    </div>`,
};

const color = computed(() => {
  const c = colorMode.value.preference === "dark" ? "#ffffff" : "#000000";
  console.log(c);
  return c;
});
</script>

<template>
  <VisXYContainer :data="data" height="500px">
    <VisStackedBar
      :x="(d, i: number) => i"
      :y="(d) => d.visits"
      :rounded-corners="4"
      :bar-padding="0.15"
      :color="color"
    />
    <VisTooltip :triggers="triggers" />
    <VisAxis
      type="x"
      :num-ticks="8"
      :tick-format="(index: number) => data[index]?.datetime"
    />
    <VisAxis type="y" :num-ticks="8" :tick-format="(value: number) => value " />
  </VisXYContainer>
</template>
