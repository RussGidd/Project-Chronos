import db from "../client.js";

export async function initializeDatabase() {
  await db.query(`CREATE TABLE IF NOT EXISTS connections (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL
  );`);

  const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM connections;");

  if (rows[0].count === 0) {
    await seed();
  }
}

export async function getConnection() {
  const SQL = "SELECT * FROM connections LIMIT 1;";
  const {
    rows: [connection],
  } = await db.query(SQL);

  if (!connection) {
    throw new Error("No connection message found. Seed the database first.");
  }

  return connection;
}

export async function seed() {
  const SQL =
    "INSERT INTO connections (message) VALUES ($1) RETURNING *;";
  const {
    rows: [message],
  } = await db.query(SQL, ["Connection Made"]);

  return message;
}
