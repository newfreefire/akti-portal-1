// models/Course.js
import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  trainerId: { type: Number, required: true },
  trainerName: { type: String, required: true },
  price: { type: Number, required: true },
  duration: {
    weekend: { type: Boolean, default: false },
    weekdays: { type: Boolean, default: false },
    oneMonth: { type: Boolean, default: false },
    levelwise: { type: Boolean, default: false }
  },
  durationLabels: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);