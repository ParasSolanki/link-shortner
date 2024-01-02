import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
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
