const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
//let items = []; wczesniej
const fs = require('fs');
const DATA_FILE = '/data/items.json';

app.use(express.json());

const instanceId = process.env.INSTANCE_ID || `node-${Math.floor(Math.random() * 100000)}`;


function readItems() { //odczyt z json
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  const data = fs.readFileSync(DATA_FILE, 'utf8');
  if (!data.trim()) {
    return [];
  }

  return JSON.parse(data);
}

function writeItems(items) { //zapisydy do json
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

//cache hit
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /items
app.get('/items', (req, res) => {
  const items = readItems(); //odczyt z json
  res.json(items);
});

// POST /items
app.post('/items', (req, res) => {
  const items = readItems(); //odczyt z json
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Pole "name" jest wymagane.' });
  }

  const newItem = {
    id: items.length + 1,
    name: name.trim()
  };

  items.push(newItem);
  writeItems(items); //zapis do json
  res.status(201).json(newItem);
});

// GET /stats
app.get('/stats', (req, res) => {
  const items = readItems(); //odczyt z json
  res.json({
    count: items.length,
    instanceId: instanceId
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});