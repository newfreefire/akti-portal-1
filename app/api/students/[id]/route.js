import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/lib/mongoose"; // ensures connection

// Get the Student model
let Student;
try {
  Student = mongoose.model("Student");
} catch (e) {
  // If model doesn't exist, we need to define it
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

  Student = mongoose.model("Student", StudentSchema);
}

// GET a single student by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// UPDATE a student by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID" },
        { status: 400 }
      );
    }

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

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE a student by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete student" },
      { status: 500 }
    );
  }
}