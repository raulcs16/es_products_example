import { runner } from "node-pg-migrate";
import path from "path";

const runMigrations = async (
  user: string,
  password: string,
  schema: string = "public",
  lock: boolean = true
) => {
  await runner({
    databaseUrl: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME,
      user: user,
      password: password,
    },
    schema: schema,
    dir: path.resolve(process.cwd(), "db", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: true,
    noLock: !lock,
  });
};
export default runMigrations;
