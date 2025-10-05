import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/lib/mongoose"; // ensures connection

// Define Co-worker Schema
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

// Create or retrieve model
let CoWorker;
try {
  // Try to retrieve existing model
  CoWorker = mongoose.model("CoWorker");
} catch (e) {
  // Model doesn't exist, create it
  CoWorker = mongoose.model("CoWorker", CoWorkerSchema);
}

export async function GET(req) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/akti-portal");
    }

    const coWorkers = await CoWorker.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      coWorkers,
    });
  } catch (error) {
    console.error("Error fetching co-workers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch co-workers" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
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

    // Check if co-worker with same CNIC already exists
    const existingCoWorker = await CoWorker.findOne({ cnic: data.cnic });
    if (existingCoWorker) {
      return NextResponse.json(
        { success: false, message: "A co-worker with this CNIC already exists" },
        { status: 400 }
      );
    }

    // Create new co-worker
    const newCoWorker = new CoWorker(data);
    await newCoWorker.save();

    return NextResponse.json({
      success: true,
      message: "Co-worker added successfully",
      coWorker: newCoWorker,
    });
  } catch (error) {
    console.error("Error adding co-worker:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add co-worker" },
      { status: 500 }
    );
  }
}