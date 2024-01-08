import { z } from "zod";
import { db } from "~/server/db/db";
import { userTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const displayNameSchema = z.object({
  displayName: z.string().min(1).max(32),
});

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: "Not Authorized",
    });
  }

  const session = await lucia.validateSession(sessionId);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: "Not Authorized",
    });
  }

  const body = await readBody(event);

  const result = displayNameSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid Data",
      data: {
        errors: result.error.flatten().fieldErrors,
      },
    });
  }

  try {
    await db
      .update(userTable)
      .set({
        displayName: result.data.displayName,
      })
      .where(eq(userTable.id, session.user.id));

    return { ok: true };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: "Something went wrong",
    });
  }
});
