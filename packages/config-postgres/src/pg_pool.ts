import { Pool, PoolClient, PoolConfig, QueryResult } from "pg";
import getPool from "./getPool";

export default class PGPool {
  private pool: Pool;
  constructor(config?: Pool | PGPool | PoolConfig) {
    if (!config) {
      this.pool = getPool();
    } else if (config instanceof PGPool) {
      this.pool = config.pool;
    } else if (config instanceof Pool) {
      this.pool = config;
    } else {
      this.pool = getPool(config);
    }
  }
  public async query(
    sql: string,
    params: any[] = []
  ): Promise<QueryResult<any>> {
    return this.pool.query(sql, params);
  }
  public async hasConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      client.release();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async transaction<T>(
    fn: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  public async close(): Promise<void> {
    return this.pool.end();
  }
}
