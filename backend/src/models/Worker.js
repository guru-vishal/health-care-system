const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    workerId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 0 },
    state: { type: String, trim: true },
    bloodType: { type: String, trim: true },
    phone: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    jobRole: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
