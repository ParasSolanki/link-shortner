import { formatISO, startOfDay, subDays } from "date-fns";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db/db";
import { linkTimeseiesTable, linksTable } from "~/server/db/schema";

const metricsQuerySchema = z.object({
  interval: z
    .union([
      z.literal("1d"),
      z.literal("7d"),
      z.literal("30d"),
      z.literal("90d"),
      z.literal("all"),
    ])
    .default("30d"),
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

  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      message: "Slug is required",
      status: 400,
    });
  }

  const [link] = await db
    .select({
      id: linksTable.id,
      slug: linksTable.slug,
      href: linksTable.href,
      visits: linksTable.visits,
    })
    .from(linksTable)
    .where(and(eq(linksTable.slug, slug), eq(linksTable.userId, user.id)))
    .limit(1);

  if (!link) {
    throw createError({
      message: "Link does not exists",
      status: 400,
      statusMessage: "Link does not exists",
    });
  }

  const query = getQuery(event);

  const result = metricsQuerySchema.safeParse(query);

  if (!result.success) {
    throw createError({
      message: "Wrong details passed",
      status: 400,
    });
  }

  const { interval } = result.data;
  const now = new Date();
  const todayStartOfDay = formatISO(startOfDay(now));

  let intervalDate: string = formatISO(startOfDay(subDays(now, 29))); // default 30d

  if (interval === "1d") intervalDate = formatISO(startOfDay(now));
  else if (interval === "7d") {
    intervalDate = formatISO(startOfDay(subDays(now, 6)));
  } else if (interval === "90d") {
    intervalDate = formatISO(startOfDay(subDays(now, 89)));
  }

  const data = await db.transaction(async (tx) => {
    const timeseriesData = tx.$with("TimeSeriesData").as(
      db
        .select({
          visits: linkTimeseiesTable.visits,
          visitDateTime: linkTimeseiesTable.visitDateTime,
        })
        .from(linkTimeseiesTable)
        .where(
          and(
            eq(linkTimeseiesTable.linkId, link.id),
            interval !== "all"
              ? gte(linkTimeseiesTable.visitDateTime, intervalDate)
              : undefined,
            interval !== "all"
              ? lte(linkTimeseiesTable.visitDateTime, todayStartOfDay)
              : undefined
          )
        )
    );

    let timeseries;

    if (interval === "all") {
      timeseries = await tx
        .with(timeseriesData)
        .select({
          visits: sql`sum("visits")`.mapWith(Number),
          month: sql`strftime('%Y-%m', "visit_datetime")`
            .mapWith(String)
            .as("month"),
        })
        .from(timeseriesData)
        .groupBy(sql`strftime('%Y-%m', "visit_datetime")`);
    } else {
      timeseries = await tx.with(timeseriesData).select().from(timeseriesData);
    }

    const total = await tx
      .with(timeseriesData)
      .select({
        totalVisits: sql`sum(${linkTimeseiesTable.visits})`.mapWith(Number),
      })
      .from(timeseriesData);

    return { timeseries, totalVisits: total[0].totalVisits };
  });

  return { ...data, link };
});
