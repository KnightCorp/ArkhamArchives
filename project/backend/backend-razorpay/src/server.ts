import express = require("express");
import cors = require("cors");
import dotenv = require("dotenv");
import Razorpay = require("razorpay");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    // Ensure receipt is under 40 characters (Razorpay requirement)
    let finalReceipt = receipt;
    if (receipt && receipt.length > 40) {
      // Use a shorter format: first 8 chars of class_id + timestamp (last 8 digits)
      const timestamp = Date.now().toString().slice(-8);
      const classId = notes?.class_id || 'class';
      const shortClassId = classId.split('-')[0] || classId.substring(0, 8);
      finalReceipt = `${shortClassId}_${timestamp}`;
    } else if (!receipt) {
      finalReceipt = `rcpt_${Date.now().toString().slice(-8)}`;
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency || "INR",
      receipt: finalReceipt,
      notes,
    });

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify payment signature
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ verified: true, payment_id: razorpay_payment_id });
    } else {
      res.status(400).json({ verified: false, error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
