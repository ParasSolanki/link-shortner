import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db/db";
import { linksTable } from "~/server/db/schema";

const linksQuerySchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  perPage: z.coerce.number().min(1).catch(10),
});

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: "Not Authorized",
    });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Not Authorized",
    });
  }

  const query = getQuery(event);

  const result = linksQuerySchema.safeParse(query);

  if (!result.success) {
    return;
  }

  const { page, perPage } = result.data;

  const [linksResult, totalResult] = await Promise.allSettled([
    db
      .select({
        id: linksTable.id,
        href: linksTable.href,
        slug: linksTable.slug,
        visits: linksTable.visits,
        createAt: linksTable.createAt,
      })
      .from(linksTable)
      .where(eq(linksTable.userId, user.id))
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy(desc(linksTable.createAt)),
    db
      .select({ total: count(linksTable.id) })
      .from(linksTable)
      .where(eq(linksTable.userId, user.id)),
  ]);

  if (linksResult.status === "rejected" || totalResult.status === "rejected") {
    throw createError({
      statusCode: 500,
      message: "Something went wrong",
    });
  }

  const links = linksResult.value;
  const total = totalResult.value[0].total;

  return {
    ok: true,
    links,
    pagination: {
      page,
      total: Math.ceil(total / perPage),
    },
  };
});
