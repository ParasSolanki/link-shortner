<script setup lang="ts">
import { buttonVariants } from "./ui/button";

const user = useUser();
</script>

<template>
  <header
    class="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-border"
  >
    <div class="container mx-auto px-4 flex items-center h-20 justify-between">
      <NuxtLink to="/" class="text-2xl md:text-3xl font-black"
        >Link Shortner</NuxtLink
      >

      <div class="flex items-center space-x-3">
        <ThemeToggle />
        <UserMenu v-if="user" />

        <div v-else class="flex space-x-2 items-center">
          <NuxtLink :class="buttonVariants({ variant: 'outline' })" to="/signin"
            >Signin</NuxtLink
          >
          <NuxtLink :class="buttonVariants()" to="/signup">SignUp</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
