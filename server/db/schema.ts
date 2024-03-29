import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  unique,
  index,
} from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
});

export const userSessionTable = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const userPasswordTable = sqliteTable("user_password", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id)
    .unique(),
  hashedPassword: text("hashed_password"),
});

export const userKeyTable = sqliteTable(
  "user_key",
  {
    id: text("id").notNull().primaryKey(),
    providerId: text("provider_key").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
  },
  (t) => ({
    uniqueUserIdAndProviderId: unique().on(t.userId, t.providerId),
  })
);

export const linksTable = sqliteTable("links", {
  id: text("id")
    .notNull()
    .$defaultFn(() => generateId(20))
    .primaryKey(),
  slug: text("slug").notNull().unique(),
  href: text("href").notNull(),
  visits: integer("visits").default(0).notNull(),
  userId: text("user_id").references(() => userTable.id),
  createAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const linkTimeseiesTable = sqliteTable(
  "link_timeseries",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => generateId(50))
      .primaryKey(),
    linkId: text("link_id")
      .references(() => linksTable.id)
      .notNull(),
    visits: integer("visits").default(0).notNull(),
    visitDateTime: text("visit_datetime").notNull(),
  },
  (t) => ({
    linkIdIdx: index("link_id_idx").on(t.linkId),
    uniqueLinkIdAndVisitDateTime: unique().on(t.linkId, t.visitDateTime),
  })
);
