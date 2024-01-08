<script setup lang="ts">
import { LockIcon, SettingsIcon } from "lucide-vue-next";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const route = useRoute();

definePageMeta({
  layout: "app",
  middleware: ["protected"],
});

const links = [
  {
    name: "General",
    href: "/account",
    icon: SettingsIcon,
  },
  {
    name: "Security",
    href: "/account/security",
    icon: LockIcon,
  },
];
</script>

<template>
  <div class="container mx-auto border-b border-b-border px-4 py-6">
    <h2 class="text-primary font-bold text-3xl">Account Settings</h2>
    <p class="text-base text-muted-foreground">
      Manage your account settings and set e-mail preferences.
    </p>
  </div>
  <div class="container mx-auto my-10 px-10">
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="-mx-4 lg:w-1/5">
        <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <ul>
            <li v-for="link in links" :key="link.href">
              <NuxtLink
                :to="link.href"
                :class="
                  cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start text-base',
                    route.path === link.href
                      ? 'bg-muted text-primary hover:bg-muted'
                      : 'hover:bg-transparent hover:underline hover:underline-offset-4 '
                  )
                "
              >
                <component
                  :is="link.icon"
                  class="mr-2 w-5 h-5"
                  aria-hidden="true"
                />
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div class="flex-1 lg:max-w-2xl">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
