import { count, eq, sql } from "drizzle-orm";
import { db } from "~/server/db/db";
import { linksTable } from "~/server/db/schema";

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

  const links = await db
    .select({
      id: linksTable.id,
      href: linksTable.href,
      slug: linksTable.slug,
      visits: linksTable.visits,
      createAt: linksTable.createAt,
    })
    .from(linksTable)
    .where(eq(linksTable.userId, user.id));

  return { ok: true, links };
});
