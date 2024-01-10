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

  const [states] = await db
    .select({
      totalLinks: count(linksTable.id),
      totalVisits: sql<number>`sum(${linksTable.visits}) as integer`,
    })
    .from(linksTable)
    .where(eq(linksTable.userId, user.id))
    .limit(1);

  return { ok: true, states };
});
