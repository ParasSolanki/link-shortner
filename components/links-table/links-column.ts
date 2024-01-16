import type { ColumnDef } from "@tanstack/vue-table";
import { format } from "date-fns";
import { h } from "vue";
import { z } from "zod";
import DataTableColumnHeader from "~/components/ui/data-table/DataTableColumnHeader.vue";
import LinksTableActions from "./LinksTableActions.vue";
import type { linkSchema } from "./schema";
// import { NuxtLink } from "#build/components";

export type Link = z.infer<typeof linkSchema>;

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
  {
    id: "Actions",
    header: ({ column }) =>
      h("div", { class: "h-8 flex items-center text-base" }, "Actions"),
    cell: ({ row, table }) => h(LinksTableActions, { table, row }),
  },
];
