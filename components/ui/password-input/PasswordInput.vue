<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "~/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const showPassword = ref(false);
</script>

<template>
  <div class="relative">
    <Input
      v-model="modelValue"
      v-bind="$attrs"
      :type="showPassword ? 'text' : 'password'"
      :class="cn('pr-11', props.class ?? '')"
      :style="{
        'font-family': !showPassword && modelValue ? 'verdana' : undefined,
      }"
    />
    <Button
      type="button"
      size="icon"
      variant="ghost"
      class="absolute right-0 top-1/2 -translate-y-1/2"
      @click="showPassword = !showPassword"
    >
      <EyeIcon v-if="showPassword" class="h-4 w-4" />
      <EyeOffIcon v-else class="h-4 w-4" />
    </Button>
  </div>
</template>
