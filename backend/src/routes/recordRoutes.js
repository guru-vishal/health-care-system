const express = require("express");
const jwt = require("jsonwebtoken");

const { upload } = require("../middleware/upload");
const {
  addRecord,
  getRecordsForWorker,
  getSingleRecord,
} = require("../controllers/recordController");

const router = express.Router();

function fail(res, status, message, data = null) {
  return res.status(status).json({ success: false, message, data });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return fail(res, 401, "Missing authorization token");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = payload;
    return next();
  } catch (err) {
    return fail(res, 401, "Invalid or expired token");
  }
}

function requireDoctorOrAdmin(req, res, next) {
  const role = req.user?.role;
  if (role === "doctor" || role === "admin") return next();
  return fail(res, 403, "Only doctor/admin can add records");
}

function uploadReportFile(req, res, next) {
  const handler = upload.single("reportFile");
  handler(req, res, (err) => {
    if (err) return fail(res, 400, err.message);
    return next();
  });
}

// Add Health Record
// POST /api/records
router.post("/records", requireAuth, requireDoctorOrAdmin, uploadReportFile, addRecord);

// Get Records for a Worker
// GET /api/records/:workerId
router.get("/records/:workerId", requireAuth, getRecordsForWorker);

// Get Single Record
// GET /api/record/:id
router.get("/record/:id", requireAuth, getSingleRecord);

// Router-scoped error handler to keep response format consistent
// eslint-disable-next-line no-unused-vars
router.use((err, _req, res, _next) => {
  const message = err?.message || "Unexpected error";
  const status = Number.isInteger(err?.status) ? err.status : 500;
  return res.status(status).json({ success: false, message, data: null });
});

module.exports = router;
