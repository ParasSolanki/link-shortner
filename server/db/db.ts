import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const config = useRuntimeConfig();

const sqliteDB = sqlite(config.databaseUrl);
export const db = drizzle(sqliteDB);
