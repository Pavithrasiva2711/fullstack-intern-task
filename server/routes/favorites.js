
const express = require('express');
const db = require('../database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get the logged-in user's favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await db('favorites')
      .join('templates', 'favorites.template_id', 'templates.id')
      .where('favorites.user_id', req.user.id)
      .select('templates.*', 'favorites.id as favorite_id');

    res.json({ success: true, favorites });
  } catch (error) {
    console.error('Fetch favorites error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Could not fetch favorites.',
    });
  }
});

// Add a template to favorites
router.post('/:templateId', authenticateToken, async (req, res) => {
  try {
    const templateId = Number(req.params.templateId);

    if (!Number.isInteger(templateId) || templateId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID.',
      });
    }

    const template = await db('templates').where({ id: templateId }).first();

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found.',
      });
    }

    const existing = await db('favorites')
      .where({ user_id: req.user.id, template_id: templateId })
      .first();

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Template is already in favorites.',
      });
    }

    await db('favorites').insert({
      user_id: req.user.id,
      template_id: templateId,
    });

    res.status(201).json({
      success: true,
      message: 'Template added to favorites.',
    });
  } catch (error) {
    console.error('Add favorite error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Could not add favorite.',
    });
  }
});

// Remove a template from favorites
router.delete('/:templateId', authenticateToken, async (req, res) => {
  try {
    const templateId = Number(req.params.templateId);

    if (!Number.isInteger(templateId) || templateId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID.',
      });
    }

    const deleted = await db('favorites')
      .where({ user_id: req.user.id, template_id: templateId })
      .delete();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found.',
      });
    }

    res.json({
      success: true,
      message: 'Template removed from favorites.',
    });
  } catch (error) {
    console.error('Remove favorite error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Could not remove favorite.',
    });
  }
});

module.exports = router;
