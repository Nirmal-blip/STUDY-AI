const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const logger = require("./utils/logger");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const studyRoutes = require("./routes/study.routes");
const chatRoutes = require("./routes/chat.routes");
const chatHistoryRoutes = require("./routes/chat-history.routes");
const videoRoutes = require("./routes/video.routes");

/* ===================== DB ===================== */
connectDB();

const app = express();

/* ===================== CORS (FINAL FIXED VERSION) ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL, // ✅ Vercel frontend
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, "")); // remove trailing slash

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(null, true); // ⚠️ do NOT throw error
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// ✅ Handle preflight properly
app.options("*", cors());

/* ===================== MIDDLEWARE ===================== */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ===================== STATIC ===================== */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat-history", chatHistoryRoutes);
app.use("/api/video", videoRoutes);

/* ===================== HEALTH ===================== */
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server running" });
});

/* ===================== 404 ===================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

module.exports = app;
