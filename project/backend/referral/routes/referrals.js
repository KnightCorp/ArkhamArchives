const express = require('express');
const { getDatabase, generateReferralCode } = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's referral dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    // Get user's referral code
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT referral_code FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    // Get referral stats
    const stats = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(r.id) as total_referrals,
          COALESCE(SUM(e.amount), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN e.status = 'pending' THEN e.amount ELSE 0 END), 0) as available_balance,
          COUNT(CASE WHEN DATE(r.created_at) >= DATE('now', 'start of month') THEN 1 END) as this_month_referrals,
          COALESCE(SUM(CASE WHEN DATE(e.created_at) >= DATE('now', 'start of month') THEN e.amount ELSE 0 END), 0) as this_month_earnings
        FROM referrals r
        LEFT JOIN earnings e ON r.id = e.referral_id
        WHERE r.referrer_id = ?
      `;
      
      db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve({
          totalReferrals: row.total_referrals || 0,
          totalEarnings: parseFloat(row.total_earnings) || 0,
          availableBalance: parseFloat(row.available_balance) || 0,
          thisMonthReferrals: row.this_month_referrals || 0,
          thisMonthEarnings: parseFloat(row.this_month_earnings) || 0,
          conversionRate: row.total_referrals > 0 ? Math.round((row.total_referrals * 100) / Math.max(row.total_referrals * 1.5, 1)) : 0
        });
      });
    });
    
    res.json({
      referralCode: user.referral_code,
      ...stats
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's referral code
router.get('/code', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT referral_code FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (user && user.referral_code) {
      res.json({ code: user.referral_code });
    } else {
      res.status(404).json({ error: 'Referral code not found' });
    }
    
  } catch (error) {
    console.error('Get referral code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate new referral code
router.post('/generate-code', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    // Generate unique referral code
    let newCode;
    let codeExists = true;
    while (codeExists) {
      newCode = generateReferralCode();
      const existing = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE referral_code = ?', [newCode], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      codeExists = !!existing;
    }
    
    // Update user's referral code
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET referral_code = ? WHERE id = ?', [newCode, userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    res.json({ code: newCode });
    
  } catch (error) {
    console.error('Generate referral code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get referral stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    const stats = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(r.id) as totalReferrals,
          COALESCE(SUM(e.amount), 0) as totalEarnings,
          COALESCE(SUM(CASE WHEN e.status = 'pending' THEN e.amount ELSE 0 END), 0) as availableBalance,
          COUNT(CASE WHEN DATE(r.created_at) >= DATE('now', 'start of month') THEN 1 END) as thisMonthReferrals,
          COALESCE(SUM(CASE WHEN DATE(e.created_at) >= DATE('now', 'start of month') THEN e.amount ELSE 0 END), 0) as thisMonthEarnings
        FROM referrals r
        LEFT JOIN earnings e ON r.id = e.referral_id
        WHERE r.referrer_id = ?
      `;
      
      db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve({
          totalReferrals: row.totalReferrals || 0,
          totalEarnings: parseFloat(row.totalEarnings) || 0,
          availableBalance: parseFloat(row.availableBalance) || 0,
          thisMonthReferrals: row.thisMonthReferrals || 0,
          thisMonthEarnings: parseFloat(row.thisMonthEarnings) || 0,
          conversionRate: row.totalReferrals > 0 ? Math.round((row.totalReferrals * 100) / Math.max(row.totalReferrals * 1.5, 1)) : 0
        });
      });
    });
    
    res.json(stats);
    
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get referred users
router.get('/referred-users', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    const referredUsers = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.created_at as joinedAt,
          u.is_active as isActive,
          COALESCE(SUM(p.amount), 0) as totalSpent,
          COALESCE(SUM(e.amount), 0) as commissionEarned
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        LEFT JOIN purchases p ON u.id = p.user_id
        LEFT JOIN earnings e ON r.id = e.referral_id
        WHERE r.referrer_id = ?
        GROUP BY u.id, u.name, u.email, u.created_at, u.is_active
        ORDER BY u.created_at DESC
      `;
      
      db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          joinedAt: row.joinedAt,
          isActive: !!row.isActive,
          totalSpent: parseFloat(row.totalSpent) || 0,
          commissionEarned: parseFloat(row.commissionEarned) || 0
        })));
      });
    });
    
    res.json(referredUsers);
    
  } catch (error) {
    console.error('Get referred users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get earnings history
router.get('/earnings', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    const earnings = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          e.id,
          e.amount,
          e.description,
          e.created_at as date,
          u.name as referredUserName
        FROM earnings e
        LEFT JOIN referrals r ON e.referral_id = r.id
        LEFT JOIN users u ON r.referred_id = u.id
        WHERE e.user_id = ?
        ORDER BY e.created_at DESC
        LIMIT 50
      `;
      
      db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({
          id: row.id,
          amount: parseFloat(row.amount),
          date: row.date,
          referredUserName: row.referredUserName || 'Unknown',
          description: row.description || 'Commission from referral'
        })));
      });
    });
    
    res.json(earnings);
    
  } catch (error) {
    console.error('Get earnings history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate referral code
router.get('/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const db = getDatabase();
    
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, name FROM users WHERE referral_code = ? AND is_active = 1', [code], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (user) {
      res.json({ valid: true, referrerName: user.name });
    } else {
      res.status(404).json({ valid: false, error: 'Invalid or inactive referral code' });
    }
    
  } catch (error) {
    console.error('Validate referral code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
