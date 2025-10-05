// models/CSR.js
import mongoose from "mongoose";

const CSRSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  isLeadRole: { type: Boolean, default: false },
  isCSR: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.CSR || mongoose.model("CSR", CSRSchema);