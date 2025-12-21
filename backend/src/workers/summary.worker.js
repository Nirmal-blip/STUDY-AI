const Document = require("../models/Document.model");
const llmService = require("../services/llm.service");

// 👇 SAME helpers copy from chat.controller.js
const splitIntoChunks = (text, chunkSize = 800) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
};

async function generateSummaryInBackground(docId) {
  try {
    const doc = await Document.findById(docId);
    if (!doc) return;

    console.log("🟡 Worker started");

    // ✅ CHUNKING LIKE CHATBOT
    const chunks = splitIntoChunks(doc.content);
    const contextText = chunks.slice(0, 5).join("\n\n---\n\n"); // top chunks

    const summary = await llmService.generateChatResponse(
      "Create a clean structured study summary with headings and bullet points.",
      contextText
    );

    doc.summary = summary;
    doc.status = "ready";
    await doc.save();

    console.log("✅ Summary ready");
  } catch (err) {
    console.error("❌ Worker failed:", err.message);
    await Document.findByIdAndUpdate(docId, { status: "failed" });
  }
}

module.exports = { generateSummaryInBackground };
