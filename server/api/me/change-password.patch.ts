import { z } from "zod";
import { db } from "~/server/db/db";
import { userKeyTable, userPasswordTable } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, "Old password must contain at least 8 character(s)")
    .max(256, "Old password must contain at most 256 character(s)"),
  newPassword: z
    .string()
    .min(8, "New password must contain at least 8 character(s)")
    .max(256, "New password must contain at most 256 character(s)"),
});

const EMAIL_KEY = "email";

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

  const result = changePasswordSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid Data",
      data: {
        errors: result.error.flatten().fieldErrors,
      },
    });
  }

  const { oldPassword, newPassword } = result.data;
  // TODO: add proper types
  let userEmailKey = undefined;
  let userPassword = undefined;

  try {
    const [key, password] = await Promise.allSettled([
      db
        .select({
          id: userKeyTable.id,
        })
        .from(userKeyTable)
        .where(
          and(
            eq(userKeyTable.providerId, EMAIL_KEY),
            eq(userKeyTable.providerUserId, user.email),
            eq(userKeyTable.userId, user.id)
          )
        )
        .limit(1),
      db
        .select({
          id: userPasswordTable.id,
          hashedPassword: userPasswordTable.hashedPassword,
        })
        .from(userPasswordTable)
        .where(eq(userPasswordTable.userId, user.id))
        .limit(1),
    ]);

    if (key.status === "rejected" || password.status === "rejected") {
      throw new Error("Something went wrong");
    }

    userEmailKey = key.value[0];
    userPassword = password.value[0];
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: "Something went wrong",
    });
  }

  if (userPassword && userPassword.hashedPassword) {
    const isOldPasswordValid = await new Argon2id().verify(
      userPassword.hashedPassword,
      oldPassword
    );

    // old password invalid
    if (!isOldPasswordValid) {
      throw createError({
        statusCode: 400,
        message: "Invalid old password",
      });
    }

    // old password and new password same
    if (oldPassword === newPassword) {
      throw createError({
        statusCode: 400,
        message:
          "Old password can not be used as new password choose different one",
      });
    }
  }

  try {
    await db.transaction(async (tx) => {
      if (!userEmailKey) {
        await tx.insert(userKeyTable).values({
          id: generateId(20),
          providerId: EMAIL_KEY,
          providerUserId: user.email,
          userId: user.id,
        });
      }

      const newHashedPassword = await new Argon2id().hash(newPassword);

      if (!userPassword) {
        await tx.insert(userPasswordTable).values({
          id: generateId(20),
          hashedPassword: newHashedPassword,
          userId: user.id,
        });
      } else {
        await tx
          .update(userPasswordTable)
          .set({
            hashedPassword: newHashedPassword,
          })
          .where(eq(userPasswordTable.userId, user.id));
      }
    });

    return { ok: true };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: "Something went wrong",
    });
  }
});
