// ==========================================================
// MAIN SERVER FILE
// ==========================================================
// This is the file you run to start the backend.
// Command:   node server.js
// It starts a server on http://localhost:5000
// ==========================================================

const express = require('express');
const cors = require('cors');

const itemsRouter = require('./routes/items');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// All Item Master endpoints live under /api/items
app.use('/api/items', itemsRouter);

// Simple health check so you can confirm the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Manufacturing Inventory API is running' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Backend server running at http://localhost:${PORT}`);
  console.log(`   Try opening http://localhost:${PORT}/api/health in your browser to test it.\n`);
});
