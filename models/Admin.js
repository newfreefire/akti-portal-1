// models/Admin.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  isCSR: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
