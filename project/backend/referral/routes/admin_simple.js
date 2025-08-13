const express = require('express');
const auth = require('../middleware/auth');
const { getDatabase } = require('../database');

const router = express.Router();

// Simple admin stats endpoint
router.get('/stats', auth, async (req, res) => {
  try {
    const db = getDatabase();
    
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count || 0);
      });
    });
    
    const referralCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM referrals', (err, row) => {
        if (err) reject(err);
        else resolve(row.count || 0);
      });
    });
    
    res.json({
      totalUsers: userCount,
      totalReferrals: referralCount,
      message: 'Admin stats retrieved successfully'
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
