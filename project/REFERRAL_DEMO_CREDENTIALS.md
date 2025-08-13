# Referral System Demo Credentials

## 🔐 **Demo Login Credentials**

### **Regular User Login:**
- **Email:** `demo@example.com`
- **Password:** `password123`

### **Admin Registration:**
- **Name:** Any name you want
- **Email:** Any valid email
- **Password:** Any password (6+ characters)
- **Admin Code:** `admin123`

## 🧪 **How to Test**

### **1. Regular User Login:**
1. Go to `http://localhost:5173/social/auth`
2. Click "Login" tab
3. Enter: `demo@example.com` / `password123`
4. Click "Login"

### **2. User Registration:**
1. Go to `http://localhost:5173/social/auth`
2. Click "Register" tab
3. Fill in any name, email, and password
4. Click "Register"

### **3. Admin Registration:**
1. Go to `http://localhost:5173/social/auth`
2. Click "Register as Admin" button
3. Fill in name, email, password
4. **Important:** Use admin code `admin123`
5. Click "Register as Admin"

## 🎯 **What Happens After Auth**

### **Regular User:**
- Redirected to `/social/referrals`
- Can see referral dashboard
- Can copy/share referral links
- **No admin panel access**

### **Admin User:**
- Redirected to `/social/referrals`
- Can see referral dashboard
- **Can access admin panel** (additional tab)
- Full admin functionality

## 🔄 **Testing Different Scenarios**

### **Test Regular User:**
```
Email: demo@example.com
Password: password123
```

### **Test Admin User:**
```
Name: Naruto
Email: naru1234@gmail.com
Password: yourpassword
Admin Code: admin123
```

### **Test New Registration:**
```
Name: Any name
Email: any@email.com
Password: anypassword
```

## ⚠️ **Important Notes**

- **All data is stored locally** (localStorage)
- **No real backend** - this is demo mode
- **Admin code is hardcoded** as `admin123` for demo
- **Credentials are mock** - not real authentication

## 🚀 **Next Steps**

When you want real authentication:
1. Set up the backend server (see `REFERRAL_BACKEND_SETUP.md`)
2. Uncomment the API calls in the auth components
3. Use real admin codes and user management

The auth system is now fully functional for testing! 🎉 