import express from "express";
import db from "./db/client.js";
import cors from "cors";
import authRouter from "./routes/auth.js";
import employeesRouter from "./routes/employees.js";
import shiftsRouter from "./routes/shifts.js";
import {
  getConnection,
  initializeDatabase,
  seed as seedConnection,
} from "./db/queries/connections.js";

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
  ].filter(Boolean),
);

const corsOptions = {
  origin(origin, callback) {
    // Set FRONTEND_URL on Render to your deployed frontend URL.
    // Optionally set FRONTEND_URL_2 later if you add a custom domain.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS."));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(express.json());
app.use(cors(corsOptions));

// Legacy setup/debug scaffold routes.
// These do not run the main Chronos schema.sql + db/seed.js reset flow.
app.get("/connect", makeContact);
app.get("/seed", seed);

app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/shifts", shiftsRouter);

async function seed(req, res) {
  try {
    await initializeDatabase();
    const message = await seedConnection();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function makeContact(request, response) {
  try {
    const connection = await getConnection();
    response.status(200).json(connection);
  } catch (error) {
    response.status(500).json(error.message);
  }
}

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
