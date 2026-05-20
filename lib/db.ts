import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

const databaseUrl = process.env.DATABASE_URL;
const mysqlHost = process.env.MYSQL_HOST;
const mysqlPortRaw = process.env.MYSQL_PORT;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DATABASE;

let host = mysqlHost || "localhost";
let port = 3306;
let user = mysqlUser || "root";
let password = mysqlPassword || "";
let database = mysqlDatabase || "true_info_provider";

const hasMysqlEnv = mysqlHost || mysqlUser || mysqlPassword || mysqlDatabase;

if (mysqlPortRaw) {
  const parsedPort = Number(mysqlPortRaw);
  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    console.warn(
      `Invalid MYSQL_PORT value: "${mysqlPortRaw}". Falling back to 3306.`
    );
    port = 3306;
  } else {
    port = parsedPort;
  }
}

if (!hasMysqlEnv && databaseUrl) {
  try {
    const parsed = new URL(databaseUrl);
    const scheme = parsed.protocol.replace(":", "");

    if (scheme !== "mysql" && scheme !== "mariadb") {
      throw new Error("DATABASE_URL must use mysql:// or mariadb:// protocol");
    }

    host = parsed.hostname;
    port = Number(parsed.port || 3306);
    user = decodeURIComponent(parsed.username);
    password = decodeURIComponent(parsed.password || "");
    database = parsed.pathname.replace(/^\//, "");
  } catch (error) {
    throw new Error(
      `Invalid DATABASE_URL: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

console.log('DB config:', { databaseUrl, host, port, user, password: password ? '***' : '', database });

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params: unknown[] = []) {
  const [rows] = await pool.execute(sql, params as any);
  return rows as any[];
}

export async function queryOne(sql: string, params: unknown[] = []) {
  const rows = await query(sql, params);
  return (rows as any[])[0] ?? null;
}

export function createId() {
  return randomUUID();
}

export { pool };
