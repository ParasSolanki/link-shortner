import { navigateTo } from "nuxt/app";

export default eventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  console.log({ sessionId });

  if (!sessionId) {
    throw createError({
      statusCode: 403,
    });
  }

  const { session } = await lucia.validateSession(sessionId);

  if (!session) {
    throw createError({
      statusCode: 401,
    });
  }

  await lucia.invalidateSession(session.id);
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createBlankSessionCookie().serialize()
  );

  return sendRedirect(event, "/signin");
});
