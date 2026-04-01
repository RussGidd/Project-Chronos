import {
  getConnection,
  initializeDatabase,
  seed as seedConnection,
} from "./db/queries/connections.js";
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
  try {
    await initializeDatabase();
    const message = await seedConnection();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error.message);
  }
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
await initializeDatabase();

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
