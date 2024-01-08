<script setup lang="ts"></script>

<template>
  <div class="flex flex-col">
    <Header />
    <main>
      <slot />
    </main>
  </div>

  <Footer />
</template>
