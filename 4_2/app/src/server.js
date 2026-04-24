const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let items = [];
const instanceId = process.env.INSTANCE_ID || `node-${Math.floor(Math.random() * 100000)}`;

//cache hit
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /items
app.get('/items', (req, res) => {
  res.json(items);
});

// POST /items
app.post('/items', (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Pole "name" jest wymagane.' });
  }

  const newItem = {
    id: items.length + 1,
    name: name.trim()
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// GET /stats
app.get('/stats', (req, res) => {
  res.json({
    count: items.length,
    instanceId: instanceId
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});