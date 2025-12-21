const Video = require("../models/Video.model");
const llmService = require("../services/llm.service");

const splitIntoChunks = (text, chunkSize = 800) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
};

async function generateVideoSummaryInBackground(videoId) {
  try {
    const video = await Video.findById(videoId);
    if (!video || !video.transcript) return;

    console.log("🟡 Video summary worker started");

    const chunks = splitIntoChunks(video.transcript);
    const contextText = chunks.slice(0, 5).join("\n\n---\n\n");

    const summary = await llmService.generateChatResponse(
      "Create a clean structured study summary with headings and bullet points.",
      contextText
    );

    video.summary = summary;
    video.status = "ready";
    await video.save();

    console.log("✅ Video summary ready");
  } catch (err) {
    console.error("❌ Video summary worker failed:", err.message);
    await Video.findByIdAndUpdate(videoId, { status: "failed" });
  }
}

module.exports = { generateVideoSummaryInBackground };
