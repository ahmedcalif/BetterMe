import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { Logger } from "drizzle-orm";
import * as libsql from "drizzle-orm/libsql";

dotenv.config();

const isDev = process.env.IS_DEV;
const logging = process.env.dbLogging;

const url = process.env.TURSO_DATABASE_URL!;
console.log("Database URL:", url);
if (!url) throw new Error("Missing db url env variable");

const authToken = process.env.TURSO_AUTH_TOKEN;
console.log("Database Auth Token:", authToken);
if (!authToken && !isDev) throw new Error("Missing db auth token env variable");

export const config = {
  url,
  authToken,
};

const client = createClient(config);

let dbSingleton: libsql.LibSQLDatabase | undefined;

export const getDB = () => {
  return (dbSingleton ??= libsql.drizzle(client, {
    logger: logging as boolean | Logger | undefined,
  }));
};
