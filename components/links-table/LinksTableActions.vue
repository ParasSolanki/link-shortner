<script setup lang="ts" generic="TData">
import type { Row, Table } from "@tanstack/vue-table";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-vue-next";
import { linkSchema } from "./schema";

interface LinksTableActions {
  table: Table<TData>;
  row: Row<TData>;
}

const props = defineProps<LinksTableActions>();

const link = linkSchema.safeParse(props.row.original);
</script>

<template>
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
        class="text-red-500 focus:cursor-pointer focus:bg-destructive focus:text-white"
      >
        <Trash2Icon class="mr-2 h-4 w-4" /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
