import { z } from "zod";
import { db } from "~/server/db/db";
import { userTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const displayNameSchema = z.object({
  displayName: z
    .string({ required_error: "Display name is required" })
    .min(1)
    .max(32),
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
    const [updatedUser] = await db
      .update(userTable)
      .set({
        displayName: result.data.displayName,
      })
      .where(eq(userTable.id, user.id))
      .returning();

    await lucia.invalidateSession(session.id);

    const newSession = await lucia.createSession(updatedUser.id, {
      email: updatedUser.email,
      displayName: updatedUser.displayName,
    });

    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(newSession.id).serialize()
    );

    return { ok: true };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: "Something went wrong",
    });
  }
});
