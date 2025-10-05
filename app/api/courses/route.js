import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/lib/mongoose"; // ensures connection

// Define Course Schema
const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, "Course name is required"],
    trim: true,
  },
  trainerName: {
    type: String,
    required: [true, "Trainer name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  duration: {
    weekend3Months: { type: Boolean, default: false },
    weekdays2Months: { type: Boolean, default: false },
    oneMonth: { type: Boolean, default: false },
    levelwise: { type: Boolean, default: false },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
}, { timestamps: true });

// Create or retrieve model
let Course;
try {
  // Try to retrieve existing model
  Course = mongoose.model("Course");
} catch (e) {
  // Model doesn't exist, create it
  Course = mongoose.model("Course", CourseSchema);
}

export async function GET(req) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const courses = await Course.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.courseName || !data.trainerName || data.price === undefined) {
      return NextResponse.json(
        { success: false, message: "Course name, trainer name, and price are required" },
        { status: 400 }
      );
    }

    // Validate price is a positive number
    if (isNaN(data.price) || data.price < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    // Create new course
    const newCourse = new Course(data);
    await newCourse.save();

    return NextResponse.json({
      success: true,
      message: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add course" },
      { status: 500 }
    );
  }
}