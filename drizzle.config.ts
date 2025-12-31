import "dotenv/config";
import type { Config } from "drizzle-kit";

console.log("URL:", process.env.TURSO_DATABASE_URL);
console.log("Token exists:", !!process.env.TURSO_AUTH_TOKEN);

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
