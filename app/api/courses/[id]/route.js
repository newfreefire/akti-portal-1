import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/lib/mongoose"; // ensures connection

// Get the Course model
let Course;
try {
  Course = mongoose.model("Course");
} catch (e) {
  // If model doesn't exist, we need to define it
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

  Course = mongoose.model("Course", CourseSchema);
}

// GET a single course by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// UPDATE a course by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
        { status: 400 }
      );
    }

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

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE a course by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete course" },
      { status: 500 }
    );
  }
}