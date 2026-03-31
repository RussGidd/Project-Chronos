import db from "./client.js";
import { seed } from "./queries/connections.js";

try {
  await db.connect();
  const message = await seed();
  console.log("Database seeded.", message);
} finally {
  await db.end();
}
