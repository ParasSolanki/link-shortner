import { and, eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { linksTable, linkTimeseiesTable } from "~/server/db/schema";
import { formatISO, startOfDay } from "date-fns";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      message: "Slug is required",
      status: 400,
    });
  }

  const startDateTime = formatISO(startOfDay(new Date()));

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

    try {
      await tx
        .update(linksTable)
        .set({
          visits: link.visits + 1,
        })
        .where(eq(linksTable.id, link.id));
    } catch (e) {
      tx.rollback();
      return null;
    }

    const [linkTimeseries] = await tx
      .select()
      .from(linkTimeseiesTable)
      .where(
        and(
          eq(linkTimeseiesTable.linkId, link.id),
          eq(linkTimeseiesTable.visitDateTime, startDateTime)
        )
      )
      .limit(1);

    if (!linkTimeseries) {
      await tx.insert(linkTimeseiesTable).values({
        linkId: link.id,
        visits: 1,
        visitDateTime: startDateTime,
      });
    } else {
      await tx
        .update(linkTimeseiesTable)
        .set({
          visits: linkTimeseries.visits + 1,
        })
        .where(
          and(
            eq(linkTimeseiesTable.id, linkTimeseries.id),
            eq(linkTimeseiesTable.linkId, linkTimeseries.linkId),
            eq(linkTimeseiesTable.visitDateTime, startDateTime)
          )
        );
    }

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
