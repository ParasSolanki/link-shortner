import { z } from "zod";
import { db } from "../db/db";
import { userKeyTable, userPasswordTable, userTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(256),
});

const EMAIL_KEY = "email";

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const result = signinSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid Data",
      data: {
        errors: result.error.flatten().fieldErrors,
      },
    });
  }

  const { email, password } = result.data;

  {
    const [user] = await db
      .select({
        id: userTable.id,
      })
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    // no user found
    if (!user) {
      throw createError({
        statusCode: 400,
        message: "Incorrect email or password",
      });
    }
  }

  {
    const [userKey] = await db
      .select({
        userId: userKeyTable.userId,
      })
      .from(userKeyTable)
      .where(
        and(
          eq(userKeyTable.providerId, EMAIL_KEY),
          eq(userKeyTable.providerUserId, email)
        )
      )
      .limit(1);

    // user with email key account not exists
    if (!userKey) {
      throw createError({
        statusCode: 400,
        message: "Incorrect email or password",
      });
    }
  }

  const [user] = await db
    .select({
      id: userTable.id,
      email: userTable.email,
      displayName: userTable.displayName,
      hashedPassword: userPasswordTable.hashedPassword,
    })
    .from(userTable)
    .leftJoin(userPasswordTable, eq(userTable.id, userPasswordTable.userId))
    .where(eq(userTable.email, email))
    .limit(1);

  // no user found
  if (!user) {
    throw createError({
      statusCode: 400,
      message: "Incorrect email or password",
    });
  }

  // user does not have password
  if (!user.hashedPassword) {
    throw createError({
      statusCode: 400,
      message: "Incorrect email or password",
    });
  }

  const isPasswordValid = await new Argon2id().verify(
    user.hashedPassword,
    password
  );

  if (!isPasswordValid) {
    throw createError({
      statusCode: 400,
      message: "Incorrect email or password",
    });
  }

  const session = await lucia.createSession(user.id, {
    email: user.email,
    displayName: user.displayName,
  });

  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
});
