const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const instanceId = process.env.INSTANCE_ID || `node-${Math.floor(Math.random() * 100000)}`;

//pool gotowe polaczenia do bazy danych
const {Pool} = require('pg'); // mechanizm pool (destrukturyzacja obiektu)
const redis = require('redis'); //cache/ram


// obiekty do zarzdzania polaczeniami
// polaczenia postgres port 5432
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432
});

// polaczenia redis (kontener cache) port 6379
const redisClient = redis.createClient({url: `redis://cache:6379`}); 
redisClient.connect();

//tab pg
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL DEFAULT 0
    )
  `);
}

//cache hit
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /items
app.get('/api/items', async (req, res) => {
  const cachedItems = await redisClient.get('items');

  //zwroc dane z cahce gdy sa
  if (cachedItems) {
    await redisClient.incr('cache_hits');
    return res.json(JSON.parse(cachedItems));
  }

  //brak danych cache, wez z pg
  const result = await pool.query('SELECT id, name, price FROM products ORDER BY id');
  const items = result.rows;

  //zapisz dane do cache na 30 sekund
  await redisClient.setEx('items', 30, JSON.stringify(items));

  res.json(items);
});

// POST /items
app.post('/api/items', async (req, res) => {
  const { name, price } = req.body;
  const productPrice = Number(price ?? 0);

  if (Number.isNaN(productPrice) || productPrice < 0) {
    return res.status(400).json({ error: 'Pole "price" musi być liczbą >= 0.' });
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Pole "name" jest wymagane.' });
  }

  const result = await pool.query(
    'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price',
    [name.trim(), productPrice]
  );

  await redisClient.del('items');

  res.status(201).json(result.rows[0]);
});

// GET /stats
app.get('/api/stats', async (req, res) => {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM products');
  const cacheHits = Number(await redisClient.get('cache_hits')) || 0;

  res.json({
    count: result.rows[0].count,
    cache_hits: cacheHits,
    instanceId: instanceId
  });
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});