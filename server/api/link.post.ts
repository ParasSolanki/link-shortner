import { z } from "zod";
import { db } from "../db/db";
import { userTable, linksTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/random";

const createShortLinkSchema = z.object({
  href: z.string().url(),
});

const LINK_SLUG_LENGTH = 6;

async function doesLinkExistsWithSlug(slug: string) {
  try {
    const [link] = await db
      .select({ id: linksTable.id })
      .from(linksTable)
      .where(eq(linksTable.slug, slug))
      .limit(1);

    return link ? true : false;
  } catch (e) {
    return true;
  }
}

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  let user = null;

  if (sessionId) {
    const session = await lucia.validateSession(sessionId);

    if (session.user) user = session.user;
  }

  const result = createShortLinkSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid Data",
      data: {
        errors: result.error.flatten().fieldErrors,
      },
    });
  }

  let userId: string | null = null;

  if (user) {
    const [currentUser] = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.id, user.id));

    if (!currentUser) {
      throw createError({
        statusCode: 400,
        message: "User does not exists",
      });
    }

    userId = currentUser.id;
  }

  let linkExists = true;
  let slug = generateRandomString(
    LINK_SLUG_LENGTH,
    alphabet("a-z", "A-Z", "0-9", "-", "_")
  );

  do {
    linkExists = await doesLinkExistsWithSlug(slug);

    if (linkExists) {
      slug = generateRandomString(
        LINK_SLUG_LENGTH,
        alphabet("a-z", "A-Z", "0-9", "-", "_")
      );
    }
  } while (linkExists);

  const { href } = result.data;

  try {
    const [link] = await db
      .insert(linksTable)
      .values({
        href,
        slug,
        userId,
      })
      .returning();

    return {
      ok: true,
      link,
    };
  } catch (e) {
    throw createError({
      message: "Something went wrong",
      status: 500,
    });
  }
});
