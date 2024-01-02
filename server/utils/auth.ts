import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { webcrypto } from "node:crypto";
import { db } from "../db/db";
import { userSessionTable, userTable } from "../db/schema";

globalThis.crypto = webcrypto as Crypto;

const adapter = new DrizzleSQLiteAdapter(db, userSessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "d"),
  sessionCookie: {
    attributes: {
      sameSite: "lax",
      secure: !process.dev,
    },
  },

  getSessionAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseSessionAttributes
      email: attributes.email,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes {
    email: string;
  }
  interface DatabaseSessionAttributes {
    email: string;
  }
}
