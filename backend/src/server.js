const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const { connectDb } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const recordRoutes = require("./routes/recordRoutes");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb(process.env.MONGO_URI);

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use(
  cors({
    origin: "https://health-care-system-eta.vercel.app",
    credentials: true,
  })
);

  // Serve uploaded report files
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "health-monitoring-backend" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/workers", workerRoutes);
  app.use("/api", recordRoutes);

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "Not found", path: req.path });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    // Avoid leaking stack traces unless explicitly enabled.
    const message = err?.message || "Unexpected error";
    const status = Number.isInteger(err?.status) ? err.status : 500;
    res.status(status).json({ error: message });
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend:", err);
  process.exit(1);
});
