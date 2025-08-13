const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase, generateReferralCode } = require('../database');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const db = getDatabase();
    
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Validate referral code if provided
    let referrerId = null;
    if (referralCode) {
      const referrer = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE referral_code = ?', [referralCode], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      
      referrerId = referrer.id;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique referral code
    let userReferralCode;
    let codeExists = true;
    while (codeExists) {
      userReferralCode = generateReferralCode();
      const existing = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE referral_code = ?', [userReferralCode], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      codeExists = !!existing;
    }
    
    // Create user
    const userId = await new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (name, email, password, referral_code, referred_by) VALUES (?, ?, ?, ?, ?)`;
      db.run(sql, [name, email, hashedPassword, userReferralCode, referrerId], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    
    // If user was referred, create referral record
    if (referrerId) {
      await new Promise((resolve, reject) => {
        const sql = `INSERT INTO referrals (referrer_id, referred_id, status) VALUES (?, ?, 'active')`;
        db.run(sql, [referrerId, userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId, email, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        referralCode: userReferralCode,
        is_admin: false
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin register endpoint
router.post('/admin-register', async (req, res) => {
  try {
    console.log('Admin registration request received');
    console.log('Request body:', req.body);
    
    const { name, email, password, adminCode } = req.body;
    
    if (!name || !email || !password || !adminCode) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password, adminCode: !!adminCode });
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate admin code
    const validAdminCodes = [
      process.env.ADMIN_CODE,
      process.env.SUPER_ADMIN_CODE,
      process.env.MASTER_CODE
    ].filter(Boolean);
    
    if (!validAdminCodes.includes(adminCode)) {
      return res.status(400).json({ error: 'Invalid admin code' });
    }
    
    const db = getDatabase();
    
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique referral code
    let userReferralCode;
    let codeExists = true;
    while (codeExists) {
      userReferralCode = generateReferralCode();
      const existing = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE referral_code = ?', [userReferralCode], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      codeExists = !!existing;
    }
    
    // Create admin user
    const userId = await new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (name, email, password, referral_code, is_admin) VALUES (?, ?, ?, ?, 1)`;
      db.run(sql, [name, email, hashedPassword, userReferralCode], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId, email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        referralCode: userReferralCode,
        is_admin: true
      }
    });
    
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = getDatabase();
    
    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Update last active
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referral_code,
        is_admin: user.is_admin
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate referral code endpoint
router.get('/validate-referral/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const db = getDatabase();
    
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, name FROM users WHERE referral_code = ?', [code], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (user) {
      res.json({ valid: true, referrerName: user.name });
    } else {
      res.status(404).json({ valid: false, error: 'Invalid referral code' });
    }
    
  } catch (error) {
    console.error('Referral validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
