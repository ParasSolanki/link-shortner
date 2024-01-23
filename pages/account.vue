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
      Manage your account settings and set other preferences.
    </p>
  </div>
  <div class="container mx-auto my-10 px-4">
    <Tabs :default-value="route.path" class="md:hidden w-full">
      <TabsList class="w-full">
        <TabsTrigger
          v-for="link in links"
          as-child
          :key="link.href"
          :value="link.href"
          ><NuxtLink :to="link.href" class="flex-grow">{{
            link.name
          }}</NuxtLink></TabsTrigger
        >
      </TabsList>
      <TabsContent
        v-for="link in links"
        :key="link.href"
        :value="link.href"
        class="mt-10"
      >
        <NuxtPage />
      </TabsContent>
    </Tabs>
    <div
      class="hidden md:flex flex-col space-y-8 md:flex-row md:space-x-4 lg:space-x-12 md:space-y-0"
    >
      <aside class="-mx-4 md:w-1/5 px-4">
        <nav class="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
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
                  class="mr-2 w-5 h-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div class="flex-1">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
