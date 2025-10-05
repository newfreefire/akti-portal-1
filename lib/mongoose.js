import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/akti-portal";

if (!global._mongooseConnection) {
  global._mongooseConnection = mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

export default global._mongooseConnection;
