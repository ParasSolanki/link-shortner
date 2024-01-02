export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  let user = null;

  if (sessionId) {
    const session = await lucia.validateSession(sessionId);

    if (session.user) user = session.user;
  }

  return {
    user,
  };
});
