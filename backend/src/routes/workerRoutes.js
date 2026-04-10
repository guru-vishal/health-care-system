const express = require("express");

const Worker = require("../models/Worker");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Public-ish: allow health staff to look up a worker by QR/ID.
router.get("/:workerId", async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ workerId: req.params.workerId }).lean();
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    return res.json(worker);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const workers = await Worker.find({}).sort({ createdAt: -1 }).lean();
    return res.json(workers);
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { workerId, name, age, state, bloodType, phone, emergencyContact, jobRole, photoUrl } =
      req.body || {};

    if (!workerId || !name) {
      return res.status(400).json({ error: "workerId and name are required" });
    }

    const exists = await Worker.findOne({ workerId: String(workerId).trim() });
    if (exists) return res.status(409).json({ error: "workerId already exists" });

    const worker = await Worker.create({
      workerId: String(workerId).trim(),
      name: String(name).trim(),
      age: age === undefined ? undefined : Number(age),
      state: state ? String(state).trim() : undefined,
      bloodType: bloodType ? String(bloodType).trim() : undefined,
      phone: phone ? String(phone).trim() : undefined,
      emergencyContact: emergencyContact ? String(emergencyContact).trim() : undefined,
      jobRole: jobRole ? String(jobRole).trim() : undefined,
      photoUrl: photoUrl ? String(photoUrl).trim() : undefined,
      createdBy: req.user?.id,
    });

    return res.status(201).json(worker);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
