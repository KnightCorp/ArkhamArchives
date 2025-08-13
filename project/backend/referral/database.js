const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

let db;

function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
      }
    });
  }
  return db;
}

function initDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    // Enable foreign keys
    database.run('PRAGMA foreign_keys = ON');
    
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by INTEGER,
        is_admin BOOLEAN DEFAULT 0,
        is_influencer BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referred_by) REFERENCES users(id)
      )
    `;
    
    // Create referrals table
    const createReferralsTable = `
      CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_id INTEGER NOT NULL,
        referred_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        commission_earned DECIMAL(10,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id),
        FOREIGN KEY (referred_id) REFERENCES users(id),
        UNIQUE(referrer_id, referred_id)
      )
    `;
    
    // Create purchases table
    const createPurchasesTable = `
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        referrer_id INTEGER,
        commission_amount DECIMAL(10,2) DEFAULT 0,
        pack_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (referrer_id) REFERENCES users(id)
      )
    `;
    
    // Create earnings table
    const createEarningsTable = `
      CREATE TABLE IF NOT EXISTS earnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        referral_id INTEGER,
        purchase_id INTEGER,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (referral_id) REFERENCES referrals(id),
        FOREIGN KEY (purchase_id) REFERENCES purchases(id)
      )
    `;
    
    // Create commissions table
    const createCommissionsTable = `
      CREATE TABLE IF NOT EXISTS commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_id INTEGER NOT NULL,
        referred_user_id INTEGER NOT NULL,
        purchase_id INTEGER NOT NULL,
        commission_amount DECIMAL(10,2) NOT NULL,
        is_paid BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id),
        FOREIGN KEY (referred_user_id) REFERENCES users(id),
        FOREIGN KEY (purchase_id) REFERENCES purchases(id)
      )
    `;

    // Create payouts table
    const createPayoutsTable = `
      CREATE TABLE IF NOT EXISTS payouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_method TEXT,
        transaction_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    
    // Execute table creation
    const tables = [
      createUsersTable,
      createReferralsTable,
      createPurchasesTable,
      createEarningsTable,
      createCommissionsTable,
      createPayoutsTable
    ];
    
    let completedTables = 0;
    
    tables.forEach((tableSQL) => {
      database.run(tableSQL, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
          reject(err);
          return;
        }
        
        completedTables++;
        if (completedTables === tables.length) {
          console.log('All database tables created successfully.');
          createDefaultAdmin().then(resolve).catch(reject);
        }
      });
    });
  });
}

function createDefaultAdmin() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    // Check if admin already exists
    database.get('SELECT id FROM users WHERE is_admin = 1', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (row) {
        console.log('Admin user already exists.');
        resolve();
        return;
      }
      
      // Create default admin
      const adminEmail = 'admin@thearchives.com';
      const adminPassword = 'admin123';
      const adminName = 'System Administrator';
      
      bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
        if (err) {
          reject(err);
          return;
        }
        
        const adminSQL = `
          INSERT INTO users (name, email, password, is_admin, referral_code)
          VALUES (?, ?, ?, 1, ?)
        `;
        
        const referralCode = generateReferralCode();
        
        database.run(adminSQL, [adminName, adminEmail, hashedPassword, referralCode], (err) => {
          if (err) {
            console.error('Error creating admin user:', err.message);
            reject(err);
          } else {
            console.log(`Default admin created: ${adminEmail} / ${adminPassword}`);
            console.log(`Admin referral code: ${referralCode}`);
            resolve();
          }
        });
      });
    });
  });
}

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

module.exports = {
  getDatabase,
  initDatabase,
  closeDatabase,
  generateReferralCode
};
