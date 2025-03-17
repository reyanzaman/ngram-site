import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DbUtils = {
  async checkConnection() {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      console.log("Database connected successfully!");
      client.release();
      return true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return false;
    }
  },
};

export { pool };
export default DbUtils;