const mongoose = require("mongoose");

const Worker = require("../models/Worker");
const MedicalRecord = require("../models/MedicalRecord");

function ok(res, message, data) {
  return res.json({ success: true, message, data });
}

function fail(res, status, message, data = null) {
  return res.status(status).json({ success: false, message, data });
}

async function resolveWorkerByParam(workerIdParam) {
  const raw = String(workerIdParam || "").trim();
  if (!raw) return null;

  if (mongoose.Types.ObjectId.isValid(raw)) {
    return Worker.findById(raw);
  }

  return Worker.findOne({ workerId: raw });
}

function canAccessWorker(user, worker) {
  if (!user) return false;
  if (user.role === "admin" || user.role === "doctor" || user.role === "staff") return true;
  return false;
}

function parseDate(value) {
  const d = new Date(value);
  // eslint-disable-next-line no-restricted-globals
  return isNaN(d.getTime()) ? null : d;
}

async function addRecord(req, res, next) {
  try {
    const {
      workerId,
      doctorName,
      hospitalName,
      diagnosis,
      prescription,
      notes,
      visitDate,
    } = req.body || {};

    if (!workerId) return fail(res, 400, "workerId is required");
    if (!doctorName) return fail(res, 400, "doctorName is required");
    if (!hospitalName) return fail(res, 400, "hospitalName is required");
    if (!diagnosis) return fail(res, 400, "diagnosis is required");
    if (!visitDate) return fail(res, 400, "visitDate is required");

    const worker = await resolveWorkerByParam(workerId);
    if (!worker) return fail(res, 404, "Worker not found");

    const parsedVisitDate = parseDate(visitDate);
    if (!parsedVisitDate) return fail(res, 400, "visitDate must be a valid date");

    const reportFile = req.file?.filename ? `/uploads/${req.file.filename}` : undefined;

    const record = await MedicalRecord.create({
      workerId: worker._id,
      doctorName: String(doctorName).trim(),
      hospitalName: String(hospitalName).trim(),
      diagnosis: String(diagnosis).trim(),
      prescription: prescription ? String(prescription).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      reportFile,
      visitDate: parsedVisitDate,
    });

    return ok(res, "Health record created", record.toObject());
  } catch (err) {
    return next(err);
  }
}

async function getRecordsForWorker(req, res, next) {
  try {
    const worker = await resolveWorkerByParam(req.params.workerId);
    if (!worker) return fail(res, 404, "Worker not found");

    if (!canAccessWorker(req.user, worker)) {
      return fail(res, 403, "You are not allowed to view these records");
    }

    const pageRaw = req.query?.page;
    const limitRaw = req.query?.limit;
    const shouldPaginate = pageRaw !== undefined || limitRaw !== undefined;

    const page = Math.max(1, Number(pageRaw || 1));
    const limit = Math.min(100, Math.max(1, Number(limitRaw || 20)));

    const query = { workerId: worker._id };

    if (!shouldPaginate) {
      const items = await MedicalRecord.find(query)
        .sort({ visitDate: -1, createdAt: -1 })
        .lean();

      return ok(res, "Health records fetched", items);
    }

    const [total, items] = await Promise.all([
      MedicalRecord.countDocuments(query),
      MedicalRecord.find(query)
        .sort({ visitDate: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return ok(res, "Health records fetched", {
      items,
      page,
      limit,
      total,
    });
  } catch (err) {
    return next(err);
  }
}

async function getSingleRecord(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return fail(res, 400, "Invalid record id");
    }

    const record = await MedicalRecord.findById(id).populate("workerId", "createdBy workerId name");
    if (!record) return fail(res, 404, "Record not found");

    const worker = record.workerId;
    if (!worker) return fail(res, 404, "Worker not found");

    if (!canAccessWorker(req.user, worker)) {
      return fail(res, 403, "You are not allowed to view this record");
    }

    const data = record.toObject();
    if (data.workerId && typeof data.workerId === "object" && data.workerId._id) {
      data.workerId = data.workerId._id;
    }
    return ok(res, "Health record fetched", data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addRecord,
  getRecordsForWorker,
  getSingleRecord,
};
