
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;
const favoriteRoutes = require('./routes/favorites');
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TemplateHub API is running!',
  });
});

// Get all templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await db('templates').select('*').orderBy('id', 'asc');
    res.json({ success: true, templates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch templates.' });
  }
});

// Get one template by ID
app.get('/api/templates/:id', async (req, res) => {
  try {
    const template = await db('templates').where({ id: req.params.id }).first();

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }

    res.json({ success: true, template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch template.' });
  }
});

app.listen(PORT, () => {
  console.log(`TemplateHub API running on port ${PORT}`);
});