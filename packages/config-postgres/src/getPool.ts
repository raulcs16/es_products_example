import { Pool, PoolConfig } from "pg";

export interface CustomPoolConfig extends PoolConfig {
  schema?: string;
}

export default function getPool(config: CustomPoolConfig = {}): Pool {
  const { schema, options, ...restConfig } = config;

  // Append schema search path if provided
  const schemaOption = schema ? `-c search_path=${schema},public` : undefined;
  const mergedOptions = [options, schemaOption].filter(Boolean).join(" ");

  return new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5433", 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ...(mergedOptions ? { options: mergedOptions } : {}),
    ...restConfig,
  });
}
