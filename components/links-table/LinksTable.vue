<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
  type PaginationState,
} from "@tanstack/vue-table";
import { DataTablePagination } from "~/components/ui/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { columns } from "./links-column";
import { valueUpdater } from "~/lib/utils";
import { z } from "zod";

const router = useRouter();
const route = useRoute();

const linksQuerySchema = z.object({
  page: z.coerce.number().min(1).catch(0),
  perPage: z.coerce.number().min(1).catch(10),
});

const result = linksQuerySchema.safeParse(route.query);

let pageIndex = 0;
let pageSize = 10;

if (result.success) {
  pageIndex = result.data.page;
  pageSize = result.data.perPage;
}

const pagination = ref<PaginationState>({ pageIndex, pageSize });

const query = computed(() => ({
  page: pagination.value.pageIndex + 1,
  perPage: pagination.value.pageSize,
}));

const { data } = await useFetch("/api/links", {
  query,
});

watch(
  () => pagination.value,
  (newValue) => {
    router.replace({
      path: "/dashboard",
      query: {
        page: newValue.pageIndex + 1,
        perPage: newValue.pageSize,
      },
    });
  }
);

const table = useVueTable({
  columns,
  get data() {
    return data.value?.links ?? [];
  },
  state: {
    get pagination() {
      return pagination.value;
    },
  },
  pageCount: data.value?.pagination.total ?? 0,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onPaginationChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, pagination),
  manualPagination: true,
});
</script>

<template>
  <div class="mt-10 space-y-4">
    <div class="flex justify-between">
      <h6 class="text-2xl font-semibold">Your Links</h6>
      <DataTableViewOptions :table="table" />
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colSpan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <DataTablePagination :table="table" />
  </div>
</template>
