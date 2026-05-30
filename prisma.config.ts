import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// ---------------------------------------------------------------------------
// Prisma 7 Configuration File
//
// In Prisma 7+, database connection URLs are no longer set in schema.prisma.
// They live here in prisma.config.ts instead.
//
// DATABASE_URL  → Transaction pooler (port 6543) — for runtime queries
// DIRECT_URL    → Direct connection  (port 5432) — for migrations / db push
//
// Reference: https://pris.ly/d/config-datasource
// ---------------------------------------------------------------------------

export default defineConfig({
  earlyAccess: true,

  schema: "prisma/schema.prisma",

  migrate: {
    // `prisma migrate dev` and `prisma db push` use the direct connection
    // because pgBouncer (transaction mode) does not support DDL statements.
    async adapter() {
      const { Pool } = await import("pg");
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: { rejectUnauthorized: false }, // required for Supabase
      });
      return new PrismaPg(pool);
    },
  },

  // Runtime Prisma Client adapter — uses the pooled connection
  async adapter() {
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Supabase
    });
    return new PrismaPg(pool);
  },
});
