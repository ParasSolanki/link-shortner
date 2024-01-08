import { z } from "zod";
import { db } from "../db/db";
import { userKeyTable, userPasswordTable, userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(256),
});

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const result = signupSchema.safeParse(Object.fromEntries(formData));

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

    if (user) {
      throw createError({
        statusCode: 409,
        message: "User already exists with email",
      });
    }
  }

  const user = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(userTable)
      .values({
        id: generateId(20),
        email,
      })
      .returning();

    const hashedPassword = await new Argon2id().hash(password);

    await tx.insert(userPasswordTable).values({
      id: generateId(20),
      hashedPassword,
      userId: user.id,
    });

    await tx.insert(userKeyTable).values({
      id: generateId(20),
      providerId: "email",
      providerUserId: email,
      userId: user.id,
    });

    return user;
  });

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
