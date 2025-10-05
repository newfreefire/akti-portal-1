import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/lib/mongoose"; // ensures connection

// Define Student Schema
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
  },
  guardianName: {
    type: String,
    required: [true, "Guardian name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^[0-9]{11}$/, "Phone number must be 11 digits"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CSR",
  },
}, { timestamps: true });

// Create or retrieve model
let Student;
try {
  // Try to retrieve existing model
  Student = mongoose.model("Student");
} catch (e) {
  // Model doesn't exist, create it
  Student = mongoose.model("Student", StudentSchema);
}

export async function GET(req) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const students = await Student.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.guardianName || !data.email || !data.phone) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { success: false, message: "Phone number must be 11 digits" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    // Create new student
    const newStudent = new Student(data);
    await newStudent.save();

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add student" },
      { status: 500 }
    );
  }
}