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

// Compound unique index: same user can't add same video twice, but different users can add same video
videoSchema.index({ youtubeId: 1, uploadedBy: 1 }, { unique: true });

module.exports = mongoose.model("Video", videoSchema);
