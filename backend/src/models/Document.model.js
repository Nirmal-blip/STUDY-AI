const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["pdf", "note", "text"],
      required: true,
    },
    filePath: {
      type: String,
      required: function () {
        return this.type === "pdf";
      },
    },
    content: {
      type: String,
      required: true,
    },

    // ✅ SINGLE SOURCE OF TRUTH
    status: {
      type: String,
      enum: ["idle", "processing", "ready", "failed"],
      default: "idle",
    },

    summary: {
      type: String,
      default: null,
    },
    keyPoints: {
      type: [String],
      default: [],
    },

    metadata: {
      pageCount: Number,
      wordCount: Number,
      uploadDate: Date,
      originalFileName: String,
    },

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

documentSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Document", documentSchema);


