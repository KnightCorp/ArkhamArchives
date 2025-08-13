import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",")
  : [];
export const signup = async (req, res) => {
  try {
    console.log("Signup attempt:", req.body.email);

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save user to DB
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("Signup successful for:", email);

    // Return new user
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      profilePic: newUser.profilePic,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Login attempt:", req.body.email);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Password incorrect for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Generated token:", token.substring(0, 20) + "...");

    // Debug the environment
    const isProduction = process.env.NODE_ENV === "production";
    console.log("Environment:", isProduction ? "production" : "development");

    // Set cookie with relaxed security for testing
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to false for now for testing
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    console.log("Setting cookie with options:", JSON.stringify(cookieOptions));
    res.cookie("jwt", token, cookieOptions);

    // Also send token in response body as a backup approach
    console.log("Login successful for user:", email);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
      token: token, // Include token in response for alternative storage
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// export const checkAuth = async (req, res) => {
//   try {
//     // The user should be available from the protectRoute middleware
//     console.log("Check auth for user:", req.user._id);

//     const user = await User.findById(req.user._id).select("-password");

//     if (!user) {
//       console.log("User not found during checkAuth");
//       return res.status(401).json({ message: "Unauthorized - user not found" });
//     }

//     console.log("Auth check successful for:", user.email);
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("CheckAuth error:", error);
//     res.status(500).json({ message: "Server error during auth check" });
//   }
// };

export const logout = async (req, res) => {
  try {
    console.log("Logout request received");

    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    console.log("Logout successful - cookie cleared");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("Update profile request for user:", req.user._id);

    const { email, password, profilePic } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (email) user.email = email;
    if (profilePic) user.profilePic = profilePic;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user
    await user.save();

    console.log("Profile updated successfully for:", user.email);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error during profile update" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Make sure isAdmin is updated if admin list has changed
    if (req.user && req.user.email) {
      const isAdminNow = ADMIN_EMAILS.includes(req.user.email);
      console.log(
        `User ${req.user.email} admin status: ${isAdminNow}, Current in DB: ${req.user.isAdmin}`
      );

      if (isAdminNow !== req.user.isAdmin) {
        await User.findByIdAndUpdate(req.user._id, { isAdmin: isAdminNow });
        req.user.isAdmin = isAdminNow;
        console.log(
          `Updated admin status for ${req.user.email} to ${isAdminNow}`
        );
      }
    }

    // Ensure isAdmin is explicitly included in the response
    const userData = {
      _id: req.user._id,
      email: req.user.email,
      profilePic: req.user.profilePic,
      isAdmin: req.user.isAdmin || false, // Explicitly include with fallback
    };

    console.log("Sending user data:", userData);
    res.status(200).json(userData);
  } catch (error) {
    console.log("Error in check auth controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
