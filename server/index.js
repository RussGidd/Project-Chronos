import { getConnection } from "./db/queries/connections.js";
import express from "express";
import db from "./db/client.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/connect", makeContact);

app.get("/seed", seed);

async function seed(req, res) {
  await db.query(`CREATE TABLE IF NOT EXISTS connections(
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL);
    `);

  await db.query(`INSERT INTO connections (message)
  VALUES('Connection Made');`);

  res.send("database seeded");
}
async function makeContact(req, res) {
  try {
    const connection = await getConnection();
    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
