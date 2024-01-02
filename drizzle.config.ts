import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const databaseUrl = process.env.NUXT_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Environment variable `NUXT_DATABASE_URL` is required");
}

export default {
  schema: "./server/db/schema.ts",
  out: "./migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
