const { getDatabase } = require('../database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(userData) {
    const { name, email, password, referralCode = null } = userData;
    const db = getDatabase();
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate unique referral code
    const userReferralCode = this.generateReferralCode();
    
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (name, email, password, referral_code)
        VALUES (?, ?, ?, ?)
      `, [name, email, passwordHash, userReferralCode], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const userId = this.lastID;
        
        // If user was referred, create referral record
        if (referralCode) {
          User.createReferralRecord(referralCode, userId)
            .catch(console.error); // Log but don't fail user creation
        }
        
        resolve({ id: userId, referral_code: userReferralCode });
      });
    });
  }

  static async createAdmin(userData) {
    const { name, email, password } = userData;
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate unique referral code
    const userReferralCode = this.generateReferralCode();
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO users (name, email, password_hash, referral_code, is_admin)
        VALUES (?, ?, ?, ?, 1)
      `);
      
      stmt.run([name, email, passwordHash, userReferralCode, 1], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const userId = this.lastID;
        resolve({ id: userId, referral_code: userReferralCode });
      });
      
      stmt.finalize();
    });
  }

  static async createReferralRecord(referralCode, referredUserId) {
    return new Promise((resolve, reject) => {
      // Find referrer by referral code
      db.get(
        'SELECT id FROM users WHERE referral_code = ?',
        [referralCode],
        (err, referrer) => {
          if (err || !referrer) {
            reject(err || new Error('Referrer not found'));
            return;
          }

          // Prevent self-referral
          if (referrer.id === referredUserId) {
            reject(new Error('Self-referral not allowed'));
            return;
          }

          // Create referral record
          const stmt = db.prepare(`
            INSERT INTO referrals (referrer_id, referred_user_id)
            VALUES (?, ?)
          `);
          
          stmt.run([referrer.id, referredUserId], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          });
          
          stmt.finalize();
        }
      );
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async findByReferralCode(code) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE referral_code = ?',
        [code],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async updateLastActive(userId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static async toggleInfluencer(userId, isInfluencer) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET is_influencer = ? WHERE id = ?',
        [isInfluencer, userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static generateReferralCode() {
    return uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
