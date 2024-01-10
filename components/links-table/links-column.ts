import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTableColumnHeader from "~/components/ui/data-table/DataTableColumnHeader.vue";
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
    accessorKey: "slug",
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
          href: `http://localhost:3000/${row.getValue("slug")}`,
        },
        `http://localhost:3000/${row.getValue("slug")}`
      ),
  },
  {
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
          href: `${row.getValue("href")}`,
          class: "underline underline-offset-4 hover:opacity-90",
        },
        row.getValue("href")
      ),
  },
  {
    accessorKey: "visits",

    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Visits" }),
    cell: ({ row }) => h("span", {}, formatter.format(row.getValue("visits"))),
  },
  {
    accessorKey: "createAt",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Date Created" }),
  },
];
