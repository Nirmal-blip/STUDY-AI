const Video = require("../models/Video.model");
const youtubeService = require("../services/youtube.service");
const { extractYouTubeId } = require("../utils/helpers");
const logger = require("../utils/logger");

const {
  generateVideoSummaryInBackground,
} = require("../workers/summary.video.worker");

/* ======================================================
   BACKGROUND TRANSCRIPTION (UNCHANGED)
====================================================== */
const processVideoTranscription = async (videoId, youtubeId) => {
  try {
    const { transcript, metadata } =
      await youtubeService.getTranscript(youtubeId);

    if (!transcript || transcript.length < 100) {
      throw new Error("Transcript too small");
    }

    if (transcript.split(/\s+/).length > 3500) {
      throw new Error("Video exceeds 15 minute limit");
    }

    await Video.findByIdAndUpdate(videoId, {
      transcript,
      status: "ready", // transcript ready
      duration: metadata?.duration || null,
      thumbnail: metadata?.thumbnail || null,
      metadata: {
        channelName: metadata?.channelName || null,
      },
    });

    logger.info(`✅ Transcription completed for ${videoId}`);
  } catch (err) {
    logger.error("❌ Whisper failed:", err.message);

    await Video.findByIdAndUpdate(videoId, {
      status: "failed",
      error: err.message,
    });
  }
};

/* ======================================================
   ADD VIDEO
====================================================== */
const addVideo = async (req, res) => {
  try {
    const { youtubeUrl, title } = req.body;

    logger.info("Add video request:", { youtubeUrl, title, userId: req.user._id });

    if (!youtubeUrl) {
      logger.warn("Missing YouTube URL in request");
      return res
        .status(400)
        .json({ success: false, message: "YouTube URL is required" });
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    logger.info("Extracted YouTube ID:", youtubeId);
    
    if (!youtubeId) {
      logger.warn("Invalid YouTube URL:", youtubeUrl);
      return res
        .status(400)
        .json({ success: false, message: "Invalid YouTube URL. Please provide a valid YouTube URL." });
    }

    const existingVideo = await Video.findOne({ youtubeId, uploadedBy: req.user._id, isActive: true });
    if (existingVideo) {
      logger.warn("Video already exists:", youtubeId);
      return res
        .status(400)
        .json({ success: false, message: "This video has already been added" });
    }

    const video = await Video.create({
      title: title || "Untitled Video",
      youtubeUrl,
      youtubeId,
      transcript: null,
      status: "processing",
      uploadedBy: req.user._id,
    });

    logger.info("Video created successfully:", video._id);

    res.status(201).json({
      success: true,
      videoId: video._id,
      message: "Video added. Transcription in progress.",
    });

    // 🔥 background transcription
    processVideoTranscription(video._id, youtubeId).catch(err => {
      logger.error("Background transcription error:", err);
    });
  } catch (error) {
    logger.error("Add video error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to add video" 
    });
  }
};

/* ======================================================
   CRUD (UNCHANGED)
====================================================== */
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedBy: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, videos });
  } catch (error) {
    logger.error("Get videos error:", error);
    res.status(500).json({ success: false });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
      isActive: true,
    });

    if (!video) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, video });
  } catch (error) {
    logger.error("Get video error:", error);
    res.status(500).json({ success: false });
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!video) {
      return res.status(404).json({ success: false });
    }

    if (req.body.title) video.title = req.body.title;
    await video.save();

    res.json({ success: true, video });
  } catch (error) {
    logger.error("Update video error:", error);
    res.status(500).json({ success: false });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!video) {
      return res.status(404).json({ success: false });
    }

    video.isActive = false;
    await video.save();

    res.json({ success: true });
  } catch (error) {
    logger.error("Delete video error:", error);
    res.status(500).json({ success: false });
  }
};

/* ======================================================
   NEW ASYNC SUMMARY (PDF-LIKE)
====================================================== */
const generateVideoSummary = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
      isActive: true,
    });

    if (!video) {
      return res.status(404).json({ success: false });
    }

    if (!video.transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript not ready",
      });
    }

    if (video.status === "ready" && video.summary) {
      return res.json({
        success: true,
        status: "ready",
        summary: video.summary,
        keyPoints: video.keyPoints,
      });
    }

    if (video.status === "processing") {
      return res.json({
        success: true,
        status: "processing",
      });
    }

    video.status = "processing";
    await video.save();

    generateVideoSummaryInBackground(video._id);

    res.json({ success: true, status: "processing" });
  } catch (error) {
    logger.error("Generate video summary error:", error);
    res.status(500).json({ success: false });
  }
};

/* ======================================================
   STATUS (POLLING)
====================================================== */
const getVideoStatus = async (req, res) => {
  const video = await Video.findOne(
    { _id: req.params.id, uploadedBy: req.user._id },
    { status: 1, summary: 1, keyPoints: 1 }
  );

  if (!video) {
    return res.status(404).json({ success: false });
  }

  res.set("Cache-Control", "no-store");

  res.json({
    success: true,
    status: video.status,
    summary: video.summary,
    keyPoints: video.keyPoints,
  });
};

/* ======================================================
   EXPORTS (IMPORTANT)
====================================================== */
module.exports = {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  generateVideoSummary,
  getVideoStatus,
};
