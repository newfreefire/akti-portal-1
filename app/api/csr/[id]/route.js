import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CSR from '@/models/CSR';

// Get a specific CSR
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const csr = await CSR.findById(id).select('-password');

    if (!csr) {
      return NextResponse.json(
        { success: false, message: "CSR not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      csr
    });
  } catch (err) {
    console.error("❌ Error fetching CSR:", err);
    return NextResponse.json(
      { success: false, message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

// Update a CSR
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { fullName, username, email, password, isActive, isLeadRole } = await req.json();

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    // Check if CSR exists
    const csr = await CSR.findById(id);
    if (!csr) {
      return NextResponse.json(
        { success: false, message: "CSR not found." },
        { status: 404 }
      );
    }

    // Check if username or email already exists (excluding current CSR)
    if (username !== csr.username || email !== csr.email) {
      const existingUser = await CSR.findOne({
        _id: { $ne: id },
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
    }

    // Update CSR data
    csr.fullName = fullName || csr.fullName;
    csr.username = username || csr.username;
    csr.email = email || csr.email;
    csr.isActive = isActive !== undefined ? isActive : csr.isActive;
    csr.isLeadRole = isLeadRole !== undefined ? isLeadRole : csr.isLeadRole;

    // Update password if provided
    if (password) {
      csr.password = await bcrypt.hash(password, 10);
    }

    await csr.save();

    return NextResponse.json({
      success: true,
      message: "CSR updated successfully!",
      csr: {
        id: csr._id,
        fullName: csr.fullName,
        username: csr.username,
        email: csr.email,
        isActive: csr.isActive,
        isLeadRole: csr.isLeadRole
      }
    });
  } catch (err) {
    console.error("❌ Error updating CSR:", err);
    return NextResponse.json(
      { success: false, message: "Server error, please try again." },
      { status: 500 }
    );
  }
}

// Delete a CSR
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    // Check if CSR exists
    const csr = await CSR.findById(id);
    if (!csr) {
      return NextResponse.json(
        { success: false, message: "CSR not found." },
        { status: 404 }
      );
    }

    // Delete CSR
    await CSR.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "CSR deleted successfully!"
    });
  } catch (err) {
    console.error("❌ Error deleting CSR:", err);
    return NextResponse.json(
      { success: false, message: "Server error, please try again." },
      { status: 500 }
    );
  }
}