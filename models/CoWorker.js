// models/CoWorker.js
import mongoose from "mongoose";

const CoWorkerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  cnic: { type: String, required: true },
  reference: { type: String },
  purpose: { type: String }
}, { timestamps: true });

export default mongoose.models.CoWorker || mongoose.model("CoWorker", CoWorkerSchema);