import PGPool from "./pg_pool";
import SchemaManager from "./schema_manager";
import runMigrations from "./run_migrations";
import { randomBytes } from "crypto";

export default class Context {
  private roleName: string;
  private sandBoxPool: PGPool;

  constructor(roleName: string, pool: PGPool) {
    this.roleName = roleName;
    this.sandBoxPool = pool;
  }

  static async build() {
    const roleName = "test" + randomBytes(4).toString("hex");
    const adminPool = new PGPool();
    const manager = new SchemaManager(adminPool);
    await manager.createSandbox(roleName);
    await adminPool.close();
    await runMigrations(roleName, roleName, roleName, false);
    const sanboxPool = new PGPool({ user: roleName, password: roleName });
    return new Context(roleName, sanboxPool);
  }
  public async close() {
    //disconnect from PG
    await this.sandBoxPool.close();
    //connect as root user
    const adminPool = new PGPool();
    //delete role and schema previously created
    await new SchemaManager(adminPool).dropSandbox(this.roleName);
    //disconnect again
    await adminPool.close();
  }

  //clean up all data aka delete rows from all tables

  async reset() {
    const sql = `
    DO $$ 
    DECLARE 
      r RECORD;
    BEGIN 
      -- Loop through all tables in the current active sandbox schema
      FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = current_schema() 
          AND tablename != 'pgmigrations' -- Preserve migration tracking
      ) LOOP 
        -- Truncate rows and cascade to handle foreign key dependencies
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE;'; 
      END LOOP; 
    END $$;
  `;
    await this.sandBoxPool.query(sql);
  }
  public pool(): PGPool {
    return this.sandBoxPool;
  }
}
