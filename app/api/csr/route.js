import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CSR from '@/models/CSR';

// Create a new CSR
export async function POST(req) {
  try {
    const { fullName, username, email, password, isActive, isLeadRole } = await req.json();

    // Validate required fields
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    // Check if username or email already exists
    const existingUser = await CSR.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { success: false, field: "username", message: "Username already exists." },
          { status: 400 }
        );
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { success: false, field: "email", message: "Email already exists." },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new CSR
    const newCSR = new CSR({
      fullName,
      username,
      email,
      password: hashedPassword,
      isActive: isActive || true,
      isLeadRole: isLeadRole || false,
      isCSR: true,
      isAdmin: false
    });

    await newCSR.save();

    return NextResponse.json({
      success: true,
      message: "CSR created successfully!",
      csr: {
        id: newCSR._id,
        fullName: newCSR.fullName,
        username: newCSR.username,
        email: newCSR.email,
        isActive: newCSR.isActive,
        isLeadRole: newCSR.isLeadRole
      }
    });
  } catch (err) {
    console.error("❌ Error creating CSR:", err);
    return NextResponse.json(
      { success: false, message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

// Get all CSRs
export async function GET() {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const csrs = await CSR.find({}).select('-password');

    return NextResponse.json({
      success: true,
      csrs
    });
  } catch (err) {
    console.error("❌ Error fetching CSRs:", err);
    return NextResponse.json(
      { success: false, message: "Server error, please try again." },
      { status: 500 }
    );
  }
}