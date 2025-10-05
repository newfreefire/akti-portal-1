import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import CSR from "@/models/CSR";
import "@/lib/mongoose"; // ensures connection

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Please fill in all fields." },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://localhost:27017/akti-portal");
    }

    // Find user in Admin collection first
    let user = await Admin.findOne({ username });
    
    // If not found in Admin, check CSR collection
    if (!user) {
      user = await CSR.findOne({ username });
      
      // If still not found, return error
      if (!user) {
        return NextResponse.json(
          { success: false, field: "username", message: "User not found." },
          { status: 401 }
        );
      }
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, field: "password", message: "Invalid password." },
        { status: 401 }
      );
    }

    // Determine user role
    let redirectUrl = "/";
    let isAdmin = false;
    let isCSR = false;
    
    if (user.isAdmin) {
      redirectUrl = "/admin/dashboard";
      isAdmin = true;
    } else if (user.isCSR || (user.isActive && user.isCSR !== undefined)) {
      // Handle CSR users - check if it's from CSR model (has isActive field)
      redirectUrl = "/csr/csr-dashboard";
      isCSR = true;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        isAdmin: isAdmin,
        isCSR: isCSR,
        isActive: user.isActive || true,
        isLeadRole: user.isLeadRole || false
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create a response with the JSON data
    const response = NextResponse.json({
      success: true,
      token,
      userId: user._id.toString(),
      redirect: redirectUrl,
      isAdmin: isAdmin,
      isCSR: isCSR,
      message: "Login successful!",
    });
    
    // Set a cookie with the token for middleware authentication
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    return response;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error, please try again." },
      { status: 500 }
    );
  }
}
