const express = require('express');
const authenticateToken = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const { getDatabase } = require('../database');

const router = express.Router();

// Debug endpoint to test admin authentication
router.get('/debug/auth', authenticateToken, requireAdmin, async (req, res) => {
  res.json({
    message: 'Admin authentication successful',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Platform overview stats endpoint for admin dashboard
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    
    // User Statistics
    const userStats = {
      total_users: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      total_influencers: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM users WHERE is_influencer = 1', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      total_admins: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM users WHERE is_admin = 1', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      active_users_30d: await new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) as count FROM users WHERE updated_at >= datetime('now', '-30 days')", (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      active_users_7d: await new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) as count FROM users WHERE updated_at >= datetime('now', '-7 days')", (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      })
    };

    // Referral Statistics
    const referralStats = {
      total_referrals: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM referrals', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      unique_referrers: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(DISTINCT referrer_id) as count FROM referrals', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      unique_referred: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(DISTINCT referred_id) as count FROM referrals', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      })
    };

    // Purchase Statistics
    const purchaseStats = {
      total_purchases: await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM purchases', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.count || 0);
          }
        });
      }),
      total_revenue: await new Promise((resolve, reject) => {
        db.get('SELECT COALESCE(SUM(amount), 0) as total FROM purchases', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(parseFloat(row.total) || 0);
          }
        });
      }),
      total_packs_sold: await new Promise((resolve, reject) => {
        db.get('SELECT COALESCE(SUM(pack_count), 0) as total FROM purchases', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(row.total || 0);
          }
        });
      }),
      avg_purchase_amount: await new Promise((resolve, reject) => {
        db.get('SELECT COALESCE(AVG(amount), 0) as avg FROM purchases', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(parseFloat(row.avg) || 0);
          }
        });
      })
    };

    // Commission Statistics
    const commissionStats = {
      total_commissions: await new Promise((resolve, reject) => {
        db.get('SELECT COALESCE(SUM(commission_amount), 0) as total FROM commissions', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(parseFloat(row.total) || 0);
          }
        });
      }),
      total_paid_out: await new Promise((resolve, reject) => {
        db.get('SELECT COALESCE(SUM(commission_amount), 0) as total FROM commissions WHERE is_paid = 1', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(parseFloat(row.total) || 0);
          }
        });
      }),
      total_pending: await new Promise((resolve, reject) => {
        db.get('SELECT COALESCE(SUM(commission_amount), 0) as total FROM commissions WHERE is_paid = 0', (err, row) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve(0);
            } else {
              reject(err);
            }
          } else {
            resolve(parseFloat(row.total) || 0);
          }
        });
      })
    };
    
    res.json({
      userStats,
      referralStats,
      purchaseStats,
      commissionStats
    });
  } catch (error) {
    console.error('Platform overview stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple admin stats endpoint
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve(0);
          } else {
            reject(err);
          }
        } else {
          resolve(row.count || 0);
        }
      });
    });
    
    const referralCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM referrals', (err, row) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve(0);
          } else {
            reject(err);
          }
        } else {
          resolve(row.count || 0);
        }
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

// Get all users (simplified for frontend)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    const users = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          id, name, email, is_admin, referral_code, created_at,
          CASE 
            WHEN updated_at >= datetime('now', '-7 days') THEN 'active'
            WHEN updated_at >= datetime('now', '-30 days') THEN 'inactive'
            ELSE 'suspended'
          END as status
        FROM users
        ORDER BY created_at DESC
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status
router.patch('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDatabase();
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk user actions
router.patch('/users/bulk-action', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_ids, action } = req.body;
    const db = getDatabase();
    
    let status;
    switch (action) {
      case 'activate':
        status = 'active';
        break;
      case 'deactivate':
        status = 'inactive';
        break;
      case 'suspend':
        status = 'suspended';
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    const placeholders = user_ids.map(() => '?').join(',');
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET status = ? WHERE id IN (${placeholders})`,
        [status, ...user_ids],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ message: 'Bulk action completed successfully' });
  } catch (error) {
    console.error('Bulk user action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all payouts
router.get('/payouts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    
    const payouts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          p.id, p.user_id, p.amount, p.status, p.created_at, p.processed_at,
          u.name as user_name, u.email as user_email
        FROM payouts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
      `, (err, rows) => {
        if (err) {
          // If payouts table doesn't exist, return mock data
          if (err.message.includes('no such table')) {
            resolve([
              {
                id: 1,
                user_id: 2,
                user_name: 'John Doe',
                user_email: 'john@example.com',
                amount: 125.50,
                status: 'pending',
                created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
              },
              {
                id: 2,
                user_id: 3,
                user_name: 'Jane Smith',
                user_email: 'jane@example.com',
                amount: 85.75,
                status: 'approved',
                created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
              },
              {
                id: 3,
                user_id: 4,
                user_name: 'Bob Johnson',
                user_email: 'bob@example.com',
                amount: 200.25,
                status: 'paid',
                created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                processed_at: new Date().toISOString()
              }
            ]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    res.json(payouts);
  } catch (error) {
    console.error('Get payouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payout status
router.patch('/payouts/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE payouts SET status = ?, processed_at = datetime("now") WHERE id = ?',
        [status, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ message: 'Payout status updated successfully' });
  } catch (error) {
    console.error('Update payout status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk payout actions
router.patch('/payouts/bulk-action', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { payout_ids, action } = req.body;
    
    let status;
    switch (action) {
      case 'approve':
        status = 'approved';
        break;
      case 'reject':
        status = 'rejected';
        break;
      case 'mark-paid':
        status = 'paid';
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    const placeholders = payout_ids.map(() => '?').join(',');
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE payouts SET status = ?, processed_at = datetime("now") WHERE id IN (${placeholders})`,
        [status, ...payout_ids],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ message: 'Bulk payout action completed successfully' });
  } catch (error) {
    console.error('Bulk payout action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get recent user registrations
    const userRegistrations = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          'user_registration' as type,
          'New user registered: ' || name as description,
          name as user_name,
          email as user_email,
          created_at
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Get recent referrals
    const recentReferrals = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          'referral' as type,
          'New referral created by ' || u1.name as description,
          u1.name as user_name,
          u1.email as user_email,
          r.created_at
        FROM referrals r
        JOIN users u1 ON r.referrer_id = u1.id
        ORDER BY r.created_at DESC 
        LIMIT 5
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Get recent purchases
    const recentPurchases = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          'purchase' as type,
          'Purchase completed by ' || u.name as description,
          u.name as user_name,
          u.email as user_email,
          p.amount,
          p.created_at
        FROM purchases p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC 
        LIMIT 5
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Combine all activities and sort by date
    const allActivities = [
      ...userRegistrations,
      ...recentReferrals,
      ...recentPurchases
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     .slice(0, 10)
     .map((activity, index) => ({
       id: index + 1,
       ...activity
     }));

    res.json(allActivities);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics data
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get user growth data for last 7 days
    const userGrowthDaily = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users 
        WHERE created_at >= datetime('now', '-7 days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Get revenue data for last 7 days
    const revenueDaily = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          DATE(created_at) as date,
          COALESCE(SUM(amount), 0) as total
        FROM purchases 
        WHERE created_at >= datetime('now', '-7 days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Get referral data for last 7 days
    const referralDaily = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM referrals 
        WHERE created_at >= datetime('now', '-7 days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Get top referrers
    const topReferrers = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          u.name,
          COUNT(r.id) as referrals,
          COALESCE(SUM(c.commission_amount), 0) as earnings
        FROM users u
        LEFT JOIN referrals r ON u.id = r.referrer_id
        LEFT JOIN commissions c ON u.id = c.referrer_id
        GROUP BY u.id, u.name
        HAVING COUNT(r.id) > 0
        ORDER BY referrals DESC, earnings DESC
        LIMIT 5
      `, (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(rows || []);
        }
      });
    });

    // Calculate conversion rates
    const totalUsers = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve(0);
          } else {
            reject(err);
          }
        } else {
          resolve(row?.count || 0);
        }
      });
    });

    const totalReferrals = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM referrals', (err, row) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve(0);
          } else {
            reject(err);
          }
        } else {
          resolve(row?.count || 0);
        }
      });
    });

    const totalPurchases = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM purchases', (err, row) => {
        if (err) {
          if (err.message.includes('no such table')) {
            resolve(0);
          } else {
            reject(err);
          }
        } else {
          resolve(row?.count || 0);
        }
      });
    });

    const analyticsData = {
      userGrowth: {
        daily: userGrowthDaily.map(item => item.count),
        weekly: [], // Could implement weekly aggregation if needed
        monthly: [] // Could implement monthly aggregation if needed
      },
      revenueData: {
        daily: revenueDaily.map(item => parseFloat(item.total)),
        weekly: [],
        monthly: []
      },
      referralData: {
        daily: referralDaily.map(item => item.count),
        weekly: [],
        monthly: []
      },
      topReferrers: topReferrers.map(item => ({
        name: item.name,
        referrals: item.referrals,
        earnings: parseFloat(item.earnings)
      })),
      conversionRates: {
        signup_to_referral: totalUsers > 0 ? ((totalReferrals / totalUsers) * 100).toFixed(1) : 0,
        referral_to_purchase: totalReferrals > 0 ? ((totalPurchases / totalReferrals) * 100).toFixed(1) : 0,
        purchase_to_repeat: 0 // Would need repeat purchase tracking
      }
    };
    
    res.json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity (legacy endpoint)
router.get('/activity/recent', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const recentUsers = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, email, created_at, last_active, is_influencer
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 10
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const recentPurchases = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, u.name as user_name, u.email
        FROM purchases p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC 
        LIMIT 10
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const recentReferrals = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, 
               u1.name as referrer_name, u1.email as referrer_email,
               u2.name as referred_name, u2.email as referred_email
        FROM referrals r
        JOIN users u1 ON r.referrer_id = u1.id
        JOIN users u2 ON r.referred_id = u2.id
        ORDER BY r.created_at DESC
        LIMIT 10
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      recentUsers,
      recentPurchases,
      recentReferrals
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users with pagination (legacy endpoint)
router.get('/users/paginated', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (search) {
      whereClause = 'WHERE name LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }
    
    const users = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          u.*,
          COUNT(DISTINCT r.referred_id) as total_referrals,
          COUNT(DISTINCT p.id) as total_purchases,
          COALESCE(SUM(p.amount), 0) as total_spent
        FROM users u
        LEFT JOIN referrals r ON u.id = r.referrer_id
        LEFT JOIN purchases p ON u.id = p.user_id
        ${whereClause}
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const totalCount = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM users u
        ${whereClause}
      `, params, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user details
router.get('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referrals = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, u.name, u.email, u.created_at
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        WHERE r.referrer_id = ?
        ORDER BY r.created_at DESC
      `, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const purchases = await new Promise((resolve, reject) => {
      db.all(`
        SELECT *
        FROM purchases
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const commissions = await new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, u.name as referred_name, p.amount as purchase_amount
        FROM commissions c
        JOIN users u ON c.referred_user_id = u.id
        JOIN purchases p ON c.purchase_id = p.id
        WHERE c.referrer_id = ?
        ORDER BY c.created_at DESC
      `, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      user,
      referrals,
      purchases,
      commissions
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle user influencer status
router.patch('/users/:id/influencer', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isInfluencer } = req.body;
    
    await User.toggleInfluencer(id, isInfluencer);
    
    res.json({
      message: 'User influencer status updated successfully'
    });
  } catch (error) {
    console.error('Toggle influencer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle user admin status
router.patch('/users/:id/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET is_admin = ? WHERE id = ?',
        [isAdmin, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({
      message: 'User admin status updated successfully'
    });
  } catch (error) {
    console.error('Toggle admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users eligible for payout
router.get('/payouts/eligible', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const eligibleUsers = await Referral.getEligibleForPayout(25);
    
    res.json({
      eligibleUsers
    });
  } catch (error) {
    console.error('Eligible payouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process payout for user
router.post('/payouts/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const changedRows = await Referral.markCommissionsPaid(userId);
    
    res.json({
      message: 'Payout processed successfully',
      commissionsUpdated: changedRows
    });
  } catch (error) {
    console.error('Process payout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform analytics (legacy endpoint)
router.get('/analytics/legacy', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const userGrowth = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_users
        FROM users
        WHERE created_at >= datetime('now', '-${period} days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const revenueData = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          DATE(created_at) as date,
          SUM(amount) as revenue,
          COUNT(*) as purchases
        FROM purchases
        WHERE created_at >= datetime('now', '-${period} days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const referralData = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_referrals
        FROM referrals
        WHERE created_at >= datetime('now', '-${period} days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      userGrowth,
      revenueData,
      referralData
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
