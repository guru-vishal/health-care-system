const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },
    doctorName: { type: String, required: true, trim: true },
    hospitalName: { type: String, required: true, trim: true },
    diagnosis: { type: String, required: true, trim: true },
    prescription: { type: String, trim: true },
    notes: { type: String, trim: true },
    reportFile: { type: String, trim: true },
    visitDate: { type: Date, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
