<script setup lang="ts">
import { buttonVariants } from "./ui/button";

const user = useUser();
</script>

<template>
  <header
    class="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-border"
  >
    <div class="container mx-auto px-4 flex items-center h-20 justify-between">
      <NuxtLink class="text-2xl md:text-3xl font-black">Link Shortner</NuxtLink>

      <div v-if="!user" class="flex space-x-2 items-center">
        <NuxtLink :class="buttonVariants({ variant: 'outline' })" to="/signin"
          >Signin</NuxtLink
        >
        <NuxtLink :class="buttonVariants()" to="/signup">SignUp</NuxtLink>
      </div>
      <form v-else action="/api/logout" method="post">
        <Button type="submit">Logout</Button>
      </form>
    </div>
  </header>
</template>
