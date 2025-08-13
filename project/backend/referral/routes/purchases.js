const express = require('express');
const authenticateToken = require('../middleware/auth');
const Purchase = require('../models/Purchase');

const router = express.Router();

// Create a purchase
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, packsBought } = req.body;
    
    // Validation
    if (!amount || !packsBought || amount <= 0 || packsBought <= 0) {
      return res.status(400).json({ error: 'Valid amount and packs count required' });
    }

    const purchase = await Purchase.create({
      userId: req.user.id,
      amount: parseFloat(amount),
      packsBought: parseInt(packsBought)
    });

    res.status(201).json({
      message: 'Purchase created successfully',
      purchase
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's purchase history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const stats = await Purchase.getTotalByUser(req.user.id);
    
    res.json({
      totalPurchases: parseInt(stats.total_purchases) || 0,
      totalAmount: parseFloat(stats.total_amount) || 0,
      totalPacks: parseInt(stats.total_packs) || 0
    });
  } catch (error) {
    console.error('Purchase history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
