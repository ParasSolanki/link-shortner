import { and, eq } from "drizzle-orm";
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

  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      message: "Slug is required",
      status: 400,
    });
  }

  let links;

  try {
    links = await db
      .select({ id: linksTable.id, userId: linksTable.id })
      .from(linksTable)
      .where(and(eq(linksTable.userId, user.id), eq(linksTable.slug, slug)))
      .limit(1);
  } catch (e) {
    throw createError({
      message: "Something went wrong",
      status: 500,
    });
  }

  const link = links[0];

  if (!link) {
    throw createError({
      message: "Link does not exists",
      status: 400,
    });
  }

  // check if link user is actually deleting
  if (link.userId !== user.id) {
    throw createError({
      message: "You dont have permission to do this action",
      status: 403,
    });
  }

  try {
    await db.delete(linksTable).where(eq(linksTable.id, link.id));
    return { ok: true };
  } catch (e) {
    throw createError({
      message: "Something went wrong",
      status: 500,
    });
  }
});
