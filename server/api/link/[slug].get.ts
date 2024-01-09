import { eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { linksTable } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      message: "Slug is required",
      status: 400,
    });
  }

  const link = await db.transaction(async (tx) => {
    const [link] = await tx
      .select({
        id: linksTable.id,
        href: linksTable.href,
        visits: linksTable.visits,
      })
      .from(linksTable)
      .where(eq(linksTable.slug, slug))
      .limit(1);
    if (!link) {
      // TODO: handle link not found case
      return null;
    }

    await tx
      .update(linksTable)
      .set({
        visits: link.visits + 1,
      })
      .where(eq(linksTable.id, link.id));

    return link;
  });

  if (!link) {
    throw createError({
      message: "Link does not exists",
      status: 400,
    });
  }

  return { link };
});
