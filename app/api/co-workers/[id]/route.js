import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/lib/mongoose"; // ensures connection

// Get the CoWorker model
let CoWorker;
try {
  CoWorker = mongoose.model("CoWorker");
} catch (e) {
  // If model doesn't exist, we need to define it
  const CoWorkerSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    cnic: {
      type: String,
      required: [true, "CNIC is required"],
      trim: true,
      match: [/^\d{5}-\d{7}-\d{1}$/, "Please provide a valid CNIC in format: 12345-1234567-1"],
    },
    reference: {
      type: String,
      trim: true,
    },
    purpose: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSR",
    },
  }, { timestamps: true });

  CoWorker = mongoose.model("CoWorker", CoWorkerSchema);
}

// GET a single co-worker by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid co-worker ID" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const coWorker = await CoWorker.findById(id);

    if (!coWorker) {
      return NextResponse.json(
        { success: false, message: "Co-worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coWorker,
    });
  } catch (error) {
    console.error("Error fetching co-worker:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch co-worker" },
      { status: 500 }
    );
  }
}

// UPDATE a co-worker by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid co-worker ID" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.fullName || !data.cnic) {
      return NextResponse.json(
        { success: false, message: "Full name and CNIC are required" },
        { status: 400 }
      );
    }

    // Validate CNIC format
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(data.cnic)) {
      return NextResponse.json(
        { success: false, message: "Invalid CNIC format. Use: 12345-1234567-1" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    // Check if another co-worker with the same CNIC exists (excluding current one)
    const existingCoWorker = await CoWorker.findOne({
      cnic: data.cnic,
      _id: { $ne: id }
    });

    if (existingCoWorker) {
      return NextResponse.json(
        { success: false, message: "Another co-worker with this CNIC already exists" },
        { status: 400 }
      );
    }

    // Update co-worker
    const updatedCoWorker = await CoWorker.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedCoWorker) {
      return NextResponse.json(
        { success: false, message: "Co-worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Co-worker updated successfully",
      coWorker: updatedCoWorker,
    });
  } catch (error) {
    console.error("Error updating co-worker:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update co-worker" },
      { status: 500 }
    );
  }
}

// DELETE a co-worker by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid co-worker ID" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const deletedCoWorker = await CoWorker.findByIdAndDelete(id);

    if (!deletedCoWorker) {
      return NextResponse.json(
        { success: false, message: "Co-worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Co-worker deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting co-worker:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete co-worker" },
      { status: 500 }
    );
  }
}