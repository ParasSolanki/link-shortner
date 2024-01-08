<script setup lang="ts">
import { buttonVariants } from "~/components/ui/button";

const route = useRoute();

const slug = route.params.slug[0];

const { data, error } = await useFetch(`/api/link/${slug}`);

if (!error.value && data.value?.link) {
  await navigateTo(data.value.link.href, { external: true });
}
</script>

<template>
  <main
    class="max-w-2xl mx-auto px-4 space-y-8 text-center flex justify-center items-center flex-col h-screen"
  >
    <h2 class="text-6xl md:text-9xl font-black">404</h2>
    <p class="text-2xl md:text-4xl font-semibold">Page Not Found</p>
    <p class="text-base md:text-xl">
      Oops! The page you were looking for does not exists.
    </p>

    <NuxtLink to="/" :class="buttonVariants()">Go Home</NuxtLink>
  </main>
</template>
