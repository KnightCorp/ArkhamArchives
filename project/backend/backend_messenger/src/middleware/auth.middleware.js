import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Update your auth middleware to log ALL headers for debugging
export const protectRoute = async (req, res, next) => {
  try {
    console.log("Protecting route...");
    console.log("Cookies received:", req.cookies);

    // Log ALL headers to see what's being sent
    console.log("ALL Headers received:", JSON.stringify(req.headers, null, 2));

    // Get token from cookie OR Authorization header
    let token;

    // Check for JWT in cookie
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log("Token found in cookies");
    }
    // Check for token in Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token found in Authorization header");
    }

    if (!token) {
      console.log("❌ NO TOKEN FOUND ANYWHERE");
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    console.log("✅ Token found:", token.substring(0, 15) + "...");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified for user:", decoded.userId);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        console.log("❌ User not found with id:", decoded.userId);
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }

      req.user = user;
      console.log("✅ Auth successful for:", user.email);
      next();
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({ message: "Server error in auth middleware" });
  }
};
