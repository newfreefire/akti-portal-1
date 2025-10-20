// scripts/createAdmin.js
// Run this file using: node scripts/createAdmin.js

// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Now import everything else
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import "../lib/mongoose.js"; // ensures connection


async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Admin.findOne({ username: "rahul12345" });
    if (existing) {
      console.log("⚠️ Admin already exists. Updating password...");
    }

    const hashedPassword = await bcrypt.hash("rahulpassword123", 10);

    const adminData = {
      fullName: "Rahul Younas",
      username: "rahul12345",
      password: hashedPassword,
      email: "rjacker339@gmail.com",
      isCSR: false,
      isAdmin: true,
    };

    await Admin.findOneAndUpdate(
      { username: "rahul12345" },
      adminData,
      { upsert: true, new: true }
    );

    console.log("✅ Admin user created or updated successfully.");
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

createAdmin();
