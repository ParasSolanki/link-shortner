import sqlite from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const databaseUrl = process.env.NUXT_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Environment variable `NUXT_DATABASE_URL` is required");
  }

  const sqliteDB = sqlite(databaseUrl);

  const db = drizzle(sqliteDB);

  console.log("Running migrations");

  await migrate(db, { migrationsFolder: "./migrations" });

  console.log("Migrated successfully");

  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
