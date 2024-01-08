<script setup lang="ts">
const route = useRoute();

useHead({
  title: "Account | Link Shortner",
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-primary text-3xl font-semibold">General</h3>
      <p class="text-muted-foreground">Update your account settings.</p>
    </div>
    <Separator />
  </div>
</template>
