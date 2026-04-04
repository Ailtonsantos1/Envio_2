import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "better-sqlite", // 👈 ADICIONA ISSO
  dbCredentials: {
    url: "./sqlite.db",
  },
} satisfies Config;