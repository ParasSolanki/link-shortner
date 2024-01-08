<script setup lang="ts">
import { UserIcon, LogOut, LockIcon, SettingsIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
const user = useUser();

const userInitials = computed(() => {
  if (!user.value) return;
  if (!user.value.displayName) return;
  // TODO: show name first charcters
  const splited = user.value.displayName.split(" ");

  return `${splited[0] ? splited[0].charAt(0).toUpperCase() : ""}${
    splited[1] ? splited[1].charAt(0).toUpperCase() : ""
  }`;
});

const { mutate } = useMutation(
  () => $fetch("/api/logout", { method: "POST" }),
  {
    onSuccess() {
      toast.success("Logout");
      navigateTo("/signin");
    },
    onError() {
      toast.error("Something went wrong while Loging out");
    },
  }
);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-10 w-10">
          <AvatarFallback class="text-foreground">
            <span v-if="userInitials">{{ userInitials }}</span>
            <UserIcon v-else class="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.displayName ?? "" }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ user?.email ?? "" }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <NuxtLink to="/account" class="hover:cursor-pointer">
            <SettingsIcon class="mr-2 h-4 w-4" />
            Account
          </NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NuxtLink to="/account/security" class="hover:cursor-pointer">
            <LockIcon class="mr-2 h-4 w-4" />
            Change Password
          </NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="text-red-500 hover:cursor-pointer hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white"
        @click="mutate"
      >
        <LogOut class="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
