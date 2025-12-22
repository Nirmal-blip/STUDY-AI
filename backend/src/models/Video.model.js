const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
    },

    youtubeId: {
      type: String,
      required: true,
    },

    transcript: {
      type: String,
      default: null,
    },

    summary: {
      type: String,
      default: null,
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },

    error: {
      type: String,
      default: null,
    },

    duration: Number,
    thumbnail: String,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text search index
videoSchema.index({ title: "text", transcript: "text", summary: "text" });

// Index for faster queries (not unique - allows multiple uploads of same video)
videoSchema.index({ youtubeId: 1, uploadedBy: 1 });

module.exports = mongoose.model("Video", videoSchema);
