import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "true_info_provider",
});

export async function query(sql, values) {
  const [result] = await pool.execute(sql, values);
  return result;
}