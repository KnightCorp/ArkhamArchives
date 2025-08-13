# LMS Payment Integration Guide

## Overview

The LMS Mentors component has a complete Razorpay payment integration that can be easily toggled for development purposes.

## Quick Toggle

To enable/disable payment integration, edit the configuration in `LMSMentors.tsx`:

```typescript
// Set this to true to enable Razorpay payment integration
// Set to false for development of post-enrollment features
const ENABLE_PAYMENT_INTEGRATION = false; // ← Change this value
```

## Development Mode (Current Setting)

When `ENABLE_PAYMENT_INTEGRATION = false`:

- ✅ **Direct Enrollment**: Students can enroll without payment
- ✅ **All Post-Enrollment Features Work**: Perfect for developing homework, assignments, progress tracking, etc.
- ✅ **Clear UI Indicators**: Blue notice shows "Development Mode" status
- ✅ **Console Logging**: Enrollment success/failure logged to console
- ✅ **Loading States**: Button shows "Enrolling..." during process

**Button Text**: "Enroll Now (Dev Mode)"

## Production Mode

When `ENABLE_PAYMENT_INTEGRATION = true`:

- 💳 **Full Razorpay Integration**: Complete payment flow with verification
- 💰 **Currency Conversion**: USD to INR (₹84 per USD)
- 🔒 **Payment Security**: Signature verification via backend
- 📱 **Mobile Optimized**: Razorpay modal works on all devices
- ⚠️ **Error Handling**: Payment failures, cancellations, and verification errors
- ✅ **Success States**: Visual feedback for successful payments

**Button Text**: "Pay ₹[amount] to Enroll" or "Enroll Now" (for free classes)

## Payment Status Messages

When payment is enabled, the following status messages appear:

- **Payment Failed**: Red alert with retry option
- **Payment Cancelled**: Yellow warning message
- **Payment Error**: Red error message
- **Enrollment Failed**: Red alert when payment succeeds but enrollment fails

## Technical Details

### Payment Flow

1. Student clicks "Enroll" button
2. Razorpay script loads dynamically
3. Order created via backend API
4. Razorpay checkout modal opens
5. Payment processed by Razorpay
6. Payment verified via backend
7. Student enrolled in LMS database
8. UI updated with success state

### Backend Endpoints

- **Create Order**: `https://arkhamrazorpay.onrender.com/api/create-order`
- **Verify Payment**: `https://arkhamrazorpay.onrender.com/api/verify-payment`

### Environment Variables Required

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## For Your Teammate

The payment integration is currently **hidden** so you can focus on:

- ✅ Homework assignments after enrollment
- ✅ Progress tracking
- ✅ Class materials access
- ✅ Student-teacher interactions
- ✅ Completion certificates
- ✅ Any other post-enrollment features

All enrollment functionality works normally - students just skip the payment step.

## Restoring Payment Integration

When ready to enable payments:

1. Change `ENABLE_PAYMENT_INTEGRATION` to `true`
2. Ensure Razorpay environment variables are set
3. Test payment flow in staging environment
4. Deploy to production

The entire payment system is preserved and ready to activate!
