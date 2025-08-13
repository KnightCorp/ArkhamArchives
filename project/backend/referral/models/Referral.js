const { getDatabase } = require('../database');

class Referral {
  static async getStats(userId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      // Get referral statistics for a user
      db.all(`
        SELECT 
          COUNT(DISTINCT r.referred_user_id) as total_users,
          COUNT(DISTINCT CASE 
            WHEN u.last_active >= datetime('now', '-30 days') 
            THEN r.referred_user_id 
          END) as active_users,
          COALESCE(SUM(p.packs_bought), 0) as packs_bought,
          COALESCE(SUM(p.amount), 0) as revenue_generated
        FROM referrals r
        LEFT JOIN users u ON r.referred_user_id = u.id
        LEFT JOIN purchases p ON r.referred_user_id = p.user_id
        WHERE r.referrer_id = ?
      `, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0] || {
            total_users: 0,
            active_users: 0,
            packs_bought: 0,
            revenue_generated: 0
          });
        }
      });
    });
  }

  static async getRecentReferrals(userId, limit = 5) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          u.name,
          r.joined_on,
          COALESCE(SUM(p.packs_bought), 0) as packs_purchased,
          COALESCE(SUM(p.amount), 0) as revenue_generated,
          CASE 
            WHEN u.last_active >= datetime('now', '-30 days') 
            THEN 'Active' 
            ELSE 'Inactive' 
          END as status
        FROM referrals r
        JOIN users u ON r.referred_user_id = u.id
        LEFT JOIN purchases p ON r.referred_user_id = p.user_id
        WHERE r.referrer_id = ?
        GROUP BY r.id, u.id, u.name, r.joined_on, u.last_active
        ORDER BY r.joined_on DESC
        LIMIT ?
      `, [userId, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getCommissionStats(userId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COALESCE(SUM(commission_amount), 0) as total_earned,
          COALESCE(SUM(CASE WHEN paid_out = 1 THEN commission_amount ELSE 0 END), 0) as total_paid,
          COALESCE(SUM(CASE WHEN paid_out = 0 THEN commission_amount ELSE 0 END), 0) as available_balance
        FROM commissions 
        WHERE referrer_id = ?
      `, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || {
            total_earned: 0,
            total_paid: 0,
            available_balance: 0
          });
        }
      });
    });
  }

  static async getEligibleForPayout(minAmount = 25) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          u.id,
          u.name,
          u.email,
          SUM(c.commission_amount) as available_balance
        FROM users u
        JOIN commissions c ON u.id = c.referrer_id
        WHERE c.paid_out = 0
        GROUP BY u.id, u.name, u.email
        HAVING SUM(c.commission_amount) >= ?
        ORDER BY available_balance DESC
      `, [minAmount], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async markCommissionsPaid(userId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE commissions 
        SET paid_out = 1 
        WHERE referrer_id = ? AND paid_out = 0
      `, [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = Referral;
