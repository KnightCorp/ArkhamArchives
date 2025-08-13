const { getDatabase } = require('../database');

class Purchase {
  static async create(purchaseData) {
    const { userId, amount, packsBought } = purchaseData;
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO purchases (user_id, amount, packs_bought, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [userId, amount, packsBought], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const purchaseId = this.lastID;
        
        // Process commission for this purchase
        Purchase.processCommission(userId, purchaseId, amount)
          .catch(console.error); // Log but don't fail purchase
        
        resolve({ id: purchaseId, amount, packs_bought: packsBought });
      });
    });
  }

  static async processCommission(userId, purchaseId, amount) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      // Check if this user was referred
      db.get(`
        SELECT r.referrer_id, u.is_influencer
        FROM referrals r
        JOIN users u ON r.referrer_id = u.id
        WHERE r.referred_user_id = ?
      `, [userId], (err, referral) => {
        if (err) {
          reject(err);
          return;
        }

        if (!referral) {
          resolve(null); // No referral, no commission
          return;
        }

        // Calculate commission based on influencer status
        const commissionRate = referral.is_influencer ? 0.10 : 0.05; // 10% or 5%
        const commissionAmount = amount * commissionRate;

        // Create commission record - using simpler syntax
        db.run(`
          INSERT INTO earnings (user_id, referral_id, purchase_id, amount, description, status, created_at)
          VALUES (?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
        `, [referral.referrer_id, null, purchaseId, commissionAmount, 'Commission from referral'], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              commission_amount: commissionAmount,
              commission_rate: commissionRate
            });
          }
        });
      });
    });
  }

  static async getTotalByUser(userId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total_purchases,
          SUM(amount) as total_amount,
          SUM(packs_bought) as total_packs
        FROM purchases 
        WHERE user_id = ?
      `, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = Purchase;
