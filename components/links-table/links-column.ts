import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTableColumnHeader from "~/components/ui/data-table/DataTableColumnHeader.vue";

export interface Link {
  id: string;
  href: string;
  slug: string;
  visits: number;
  createdAt: string;
}

export const columns: ColumnDef<Link>[] = [
  {
    accessorKey: "slug",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Shortned Link" }),
  },
  {
    accessorKey: "href",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Original Link" }),
  },
  {
    accessorKey: "visits",

    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Visits" }),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Date Created" }),
  },
];
