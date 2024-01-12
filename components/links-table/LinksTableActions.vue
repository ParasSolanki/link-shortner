<script setup lang="ts" generic="TData">
import type { Row, Table } from "@tanstack/vue-table";
import { MoreHorizontalIcon, Trash2Icon, Loader2 } from "lucide-vue-next";
import { linkSchema } from "./schema";
import { toast } from "vue-sonner";

interface LinksTableActions {
  table: Table<TData>;
  row: Row<TData>;
}

const props = defineProps<LinksTableActions>();

const link = linkSchema.parse(props.row.original);

const { mutate, isPending } = useMutation(
  () =>
    $fetch(`/api/me/link/${link.id}`, {
      method: "DELETE",
    }),
  {
    onSuccess() {
      toast.success("Link deleted");
    },
    onError() {
      toast.error("Something went wrong while deleting link");
    },
  }
);
</script>

<template>
  <AlertDialog>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontalIcon class="h-4 w-4" />
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[160px]">
        <DropdownMenuItem
          class="focus:bg-red-500 focus:text-primary-foreground"
        >
          <AlertDialogTrigger class="inline-flex items-center w-full">
            <Trash2Icon class="mr-2 h-4 w-4" /> Delete</AlertDialogTrigger
          >
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle> Are you sure? </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will delete link.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isPending">Cancel</AlertDialogCancel>
        <AlertDialogAction as-child>
          <Button
            class="bg-red-500 text-white hover:bg-red-600 focus:bg-red-600"
            :disabled="isPending"
            @click="mutate"
          >
            <Loader2 v-if="isPending" class="mr-1 h-4 w-4 animate-spin" />
            Continue
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
