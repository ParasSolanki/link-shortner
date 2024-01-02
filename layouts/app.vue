<script setup lang="ts"></script>

<template>
  <div class="flex flex-col">
    <Header />
    <main class="py-8">
      <slot />
    </main>
  </div>

  <Footer />
</template>
