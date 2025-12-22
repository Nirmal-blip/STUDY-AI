const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  generateVideoSummary,
  getVideoStatus,
} = require("../controllers/video.controller");

/* ===================== BASIC VIDEO CRUD ===================== */

// Add YouTube video
router.post("/add", protect, addVideo);

// Get all videos
router.get("/", protect, getVideos);

// Get single video
router.get("/:id", protect, getVideoById);

// Update video
router.put("/:id", protect, updateVideo);

// Delete video
router.delete("/:id", protect, deleteVideo);

/* ===================== SUMMARY FLOW (PDF-LIKE) ===================== */

// Trigger summary generation
router.post("/:id/summary", protect, generateVideoSummary);

// Poll summary status
router.get("/:id/status", protect, getVideoStatus);

module.exports = router;


