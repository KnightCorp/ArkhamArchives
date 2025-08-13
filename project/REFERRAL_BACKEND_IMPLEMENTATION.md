# Referral System Backend Implementation Guide

Based on the working project1 implementation, here are the key components needed to make the referral system fully functional.

## 🎯 **Current Issues vs Working Solution**

### **❌ Current Implementation (Mock)**
- Mock data only
- No real authentication
- No database
- No commission tracking
- No referral links

### **✅ Working Solution (Project1)**
- Real Express.js backend
- SQLite database with proper schema
- JWT authentication
- Real commission calculation
- Working referral links with cookies

## 🛠 **Implementation Steps**

### **Step 1: Create Backend Server**

Create `project/backend/server.js`:
```javascript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import referralRoutes from './routes/referrals.js';
import purchaseRoutes from './routes/purchases.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
```

### **Step 2: Database Schema**

Create `project/backend/database.js`:
```javascript
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          is_influencer BOOLEAN DEFAULT FALSE,
          is_admin BOOLEAN DEFAULT FALSE,
          referral_code TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_active DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Referrals table
      db.run(`
        CREATE TABLE IF NOT EXISTS referrals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          referrer_id INTEGER NOT NULL,
          referred_user_id INTEGER NOT NULL,
          joined_on DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'active',
          FOREIGN KEY (referrer_id) REFERENCES users (id),
          FOREIGN KEY (referred_user_id) REFERENCES users (id),
          UNIQUE(referrer_id, referred_user_id)
        )
      `);

      // Purchases table
      db.run(`
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          packs_bought INTEGER NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Commissions table
      db.run(`
        CREATE TABLE IF NOT EXISTS commissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          referrer_id INTEGER NOT NULL,
          referred_user_id INTEGER NOT NULL,
          purchase_id INTEGER NOT NULL,
          commission_amount DECIMAL(10,2) NOT NULL,
          commission_rate DECIMAL(5,2) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          paid_out BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (referrer_id) REFERENCES users (id),
          FOREIGN KEY (referred_user_id) REFERENCES users (id),
          FOREIGN KEY (purchase_id) REFERENCES purchases (id)
        )
      `);

      // Payouts table
      db.run(`
        CREATE TABLE IF NOT EXISTS payouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          processed_at DATETIME,
          notes TEXT,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
    });
  });
};

export { db, initDatabase };
```

### **Step 3: Authentication Routes**

Create `project/backend/routes/auth.js`:
```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../database.js';
import { generateReferralCode } from '../utils.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Get referral code from cookie
    const referralCode = req.cookies.referral_code;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userReferralCode = generateReferralCode();

    // Create user
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password_hash, referral_code) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, userReferralCode],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, referral_code: userReferralCode });
        }
      );
    });

    // Create referral relationship if referral code exists
    if (referralCode) {
      const referrer = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE referral_code = ?', [referralCode], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (referrer && referrer.id !== result.id) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO referrals (referrer_id, referred_user_id) VALUES (?, ?)',
            [referrer.id, result.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: result.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Clear referral cookie after successful registration
    res.clearCookie('referral_code');

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.id,
        name,
        email,
        referral_code: result.referral_code,
        is_admin: false,
        is_influencer: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Register
router.post('/register/admin', async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    // Validation
    if (!name || !email || !password || !adminCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify admin code
    if (adminCode !== 'admin123') {
      return res.status(401).json({ error: 'Invalid admin code' });
    }

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userReferralCode = generateReferralCode();

    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password_hash, referral_code, is_admin) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, userReferralCode, true],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, referral_code: userReferralCode });
        }
      );
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: result.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin user created successfully',
      token,
      user: {
        id: result.id,
        name,
        email,
        referral_code: result.referral_code,
        is_admin: true,
        is_influencer: false
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referral_code: user.referral_code,
        is_influencer: user.is_influencer,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### **Step 4: Update Frontend API Service**

Update `project/src/components/socials/services/api.ts` to use real backend:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async registerAdmin(userData: { name: string; email: string; password: string; adminCode: string }) {
    const response = await this.request('/auth/register/admin', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Referral endpoints
  async getReferralDashboard() {
    return this.request('/referrals/dashboard');
  }

  // Purchase endpoints
  async createPurchase(purchaseData: { amount: number; packsBought: number }) {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData)
    });
  }

  async getPurchaseHistory() {
    return this.request('/purchases/history');
  }

  // Admin endpoints
  async toggleUserInfluencer(userId: number, isInfluencer: boolean) {
    return this.request(`/admin/users/${userId}/influencer`, {
      method: 'PATCH',
      body: JSON.stringify({ isInfluencer })
    });
  }

  async getEligiblePayouts() {
    return this.request('/admin/payouts/eligible');
  }

  async processPayout(userId: number) {
    return this.request(`/admin/payouts/${userId}`, {
      method: 'POST'
    });
  }

  // Utility methods
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
}

export const apiService = new ApiService();
```

## 📦 **Package.json Dependencies**

Add to `project/package.json`:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "scripts": {
    "server:dev": "node backend/server.js",
    "server:start": "node backend/server.js"
  }
}
```

## 🚀 **Quick Start**

1. **Install dependencies:**
   ```bash
   cd project
   npm install express sqlite3 bcrypt jsonwebtoken cookie-parser cors dotenv
   ```

2. **Create .env file:**
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=3001
   NODE_ENV=development
   ```

3. **Start backend:**
   ```bash
   npm run server:dev
   ```

4. **Update frontend to use real API calls** (remove mock data)

## 🎯 **Key Benefits After Implementation**

- ✅ **Real authentication** with JWT tokens
- ✅ **Working referral links** with cookie tracking
- ✅ **Real commission calculation** and tracking
- ✅ **Database persistence** with SQLite
- ✅ **Admin functionality** with proper authorization
- ✅ **Purchase tracking** and commission generation
- ✅ **Payout management** for admins

This will transform the current mock system into a fully functional referral system! 