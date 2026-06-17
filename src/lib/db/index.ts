import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;
let _db: DB | undefined;

function getDb(): DB {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export const db: DB = new Proxy({} as DB, {
  get(_, key) {
    return (getDb() as any)[key as string];
  },
});

export * from "./schema";
