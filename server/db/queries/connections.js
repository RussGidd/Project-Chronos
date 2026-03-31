import db from "../client.js";

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
