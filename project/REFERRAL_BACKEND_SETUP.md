# Referral System Backend Setup Guide

## Current Status
The referral system is now working with **mock data** for demonstration purposes. You can see the full UI and functionality without needing a backend server.

## To Use Real Backend Data

### Option 1: Quick Backend Server (Recommended)

1. **Create a simple Express server:**

```bash
# In the project root
npm init -y
npm install express cors dotenv
```

2. **Create `referral-backend.js`:**

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false },
  { id: 2, name: 'Admin User', email: 'admin@example.com', is_admin: true }
];

let referrals = [
  { id: 1, referrer_id: 1, name: 'John Doe', joinDate: '2024-01-15', status: 'Active', packsPurchased: 3, revenue: 150.00 },
  { id: 2, referrer_id: 1, name: 'Jane Smith', joinDate: '2024-01-14', status: 'Active', packsPurchased: 2, revenue: 100.00 }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user) {
    res.json({
      token: 'mock-token-' + user.id,
      user: user
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = { id: users.length + 1, name, email, is_admin: false };
  users.push(newUser);
  
  res.json({
    token: 'mock-token-' + newUser.id,
    user: newUser
  });
});

// Referral endpoints
app.get('/api/referrals/dashboard', (req, res) => {
  res.json({
    stats: {
      totalUsers: 1250,
      activeUsers: 890,
      packsBought: 3420,
      revenueGenerated: 45600
    },
    recentReferrals: referrals,
    commissions: {
      totalEarned: 1250.00,
      totalPaid: 800.00,
      availableBalance: 450.00
    },
    referralLink: "https://yourplatform.com/ref/USER123",
    commissionRate: 5
  });
});

// Admin endpoints
app.get('/api/admin/analytics', (req, res) => {
  res.json({
    userGrowth: { daily: [10, 15, 20, 25, 30, 35, 40] },
    revenueData: { daily: [100, 150, 200, 250, 300, 350, 400] },
    referralData: { daily: [5, 8, 12, 15, 18, 22, 25] },
    topReferrers: [
      { name: 'John Doe', referrals: 15, revenue: 750 },
      { name: 'Jane Smith', referrals: 12, revenue: 600 }
    ],
    conversionRates: {
      signup_to_referral: 25.5,
      referral_to_purchase: 45.2,
      purchase_to_repeat: 30.1
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json(users);
});

app.get('/api/admin/payouts/eligible', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', balance: 450.00, email: 'john@example.com' }
  ]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Referral backend server running on port ${PORT}`);
});
```

3. **Start the server:**

```bash
node referral-backend.js
```

4. **Enable real API calls:**

Uncomment the API calls in `project/src/components/socials/hooks/useReferralData.ts`:

```typescript
// Replace the mock data section with:
if (!apiService.isAuthenticated()) {
  setError('Please login to view referral data');
  return;
}
const response = await apiService.getReferralDashboard();
setData(response);
```

### Option 2: Use Existing Backend

If you have an existing backend server, just update the API endpoints in `project/src/components/socials/services/api.ts` to match your server's endpoints.

## Current Demo Features

✅ **Working without backend:**
- Referral dashboard with mock data
- Copy/share referral links
- Admin panel access
- All UI components functional

✅ **Ready for backend integration:**
- API service configured
- Authentication system ready
- All endpoints defined

The referral system is now fully functional for demonstration! 🎉 