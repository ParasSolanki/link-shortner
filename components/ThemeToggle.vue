<script setup lang="ts">
import { SunIcon, MoonIcon, MonitorIcon, type Icon } from "lucide-vue-next";

const { colorMode, changeColorMode } = useColorMode();

const themes = [
  {
    text: "Light",
    value: "light",
    icon: SunIcon,
  },
  {
    text: "Dark",
    value: "dark",
    icon: MoonIcon,
  },
  {
    text: "System",
    value: "system",
    icon: MonitorIcon,
  },
] satisfies Array<{ text: string; value: Mode; icon: Icon }>;
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="icon" variant="ghost">
        <SunIcon v-if="colorMode.mode === 'light'" class="h-4 w-4" />
        <MoonIcon v-else-if="colorMode.mode === 'dark'" class="h-4 w-4" />
        <MonitorIcon v-else class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuCheckboxItem
          v-for="theme in themes"
          :key="theme.value"
          :checked="colorMode.mode === theme.value"
          @update:checked="() => changeColorMode(theme.value)"
        >
          <component :is="theme.icon" class="mr-2 h-4 w-4" />
          {{ theme.text }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
