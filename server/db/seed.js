import db from "./client.js";
import bcrypt from "bcrypt";
// import { seed } from "./queries/connections.js";

// try {
//   await db.connect();
//   const message = await seed();
//   console.log("Database seeded.", message);
// } finally {
//   await db.end();
// }

try {
  await db.connect();

  const firstHashedPin = await bcrypt.hash("12345", 10);
  const secondHashedPin = await bcrypt.hash("54321", 10);

  const SQL = `
    INSERT INTO employees (
      pin_hash,
      first_name,
      nickname,
      last_name,
      role,
      status
    )
    VALUES
    ($1, $2, $3, $4, $5, $6),
    ($7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;

  const values = [
    firstHashedPin,
    "Russell",
    null,
    "Giddens",
    "employee",
    "active",
    secondHashedPin,
    "Morgan",
    null,
    "Lane",
    "employee",
    "active",
  ];

  const result = await db.query(SQL, values);

  console.log("🌱 Database seeded with test employee.");
  console.log(result.rows);
} catch (error) {
  console.error("Error seeding database:", error);
} finally {
  await db.end();
}
