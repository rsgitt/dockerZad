const express = require("express");
const { Pool } = require("pg");
const { validateName } = require("./validate");

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST || "db",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "items",
});

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/items", async (_req, res) => {
  try {
    const r = await pool.query("SELECT id, name, created_at FROM items ORDER BY id");
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/items", async (req, res) => {
  const v = validateName(req.body && req.body.name);
  if (!v.ok) return res.status(400).json({ error: v.error });
  try {
    const r = await pool.query(
      "INSERT INTO items(name) VALUES($1) RETURNING id, name, created_at",
      [v.value]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function main() {
  await initSchema();
  app.listen(PORT, () => console.log(`items-api listening on ${PORT}`));
}

main().catch((e) => {
  console.error("startup failed:", e.message);
  process.exit(1);
});
