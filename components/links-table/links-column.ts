import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTableColumnHeader from "~/components/ui/data-table/DataTableColumnHeader.vue";
import { format } from "date-fns";
// import { NuxtLink } from "#build/components";

export interface Link {
  id: string;
  href: string;
  slug: string;
  visits: number;
  createAt: string;
}

const formatter = new Intl.NumberFormat("en-US", {});

export const columns: ColumnDef<Link>[] = [
  {
    id: "Shortned Link",
    accessorFn: (row) => row.slug,
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Shortned Link" }),
    cell: ({ row }) =>
      // FIXME: we should use NuxtLink component instead of a tag
      h(
        "a",
        {
          target: "_blank",
          rel: "noreferrer noopener",
          class: "underline underline-offset-4 hover:opacity-90",
          href: `http://localhost:3000/${row.getValue("Shortned Link")}`,
        },
        `http://localhost:3000/${row.getValue("Shortned Link")}`
      ),
  },
  {
    id: "Original Link",
    accessorFn: (row) => row.href,
    accessorKey: "href",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Original Link" }),
    cell: ({ row }) =>
      // FIXME: we should use NuxtLink component instead of a tag
      h(
        "a",
        {
          target: "_blank",
          rel: "noreferrer noopener",
          href: `${row.getValue("Original Link")}`,
          class: "underline underline-offset-4 hover:opacity-90",
        },
        row.getValue("Original Link")
      ),
  },
  {
    id: "Visits",
    accessorFn: (row) => row.visits,
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Visits" }),
    cell: ({ row }) => h("span", {}, formatter.format(row.getValue("Visits"))),
  },
  {
    id: "Date Created",
    accessorFn: (row) => format(row.createAt, "PPP"),
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Date Created" }),
  },
];
