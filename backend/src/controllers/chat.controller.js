const ChatMessage = require("../models/ChatMessage.model");
const StudySession = require("../models/StudySession.model");
const Document = require("../models/Document.model");
const Video = require("../models/Video.model");
const llmService = require("../services/llm.service");

/* -------------------- HELPERS -------------------- */

const splitIntoChunks = (text, chunkSize = 800) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
};

const extractKeywords = (text = "") =>
  text.toLowerCase().match(/[a-zA-Z]+/g) || [];

const getRelevantChunks = (chunks, question, limit = 4) => {
  const keywords = extractKeywords(question);
  return chunks
    .map(chunk => ({
      chunk,
      score: keywords.reduce(
        (s, k) => (chunk.toLowerCase().includes(k) ? s + 1 : s),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(c => c.chunk);
};

/* -------------------- CREATE SESSION -------------------- */
/* Supports SINGLE PDF OR SINGLE VIDEO */

exports.createChatSession = async (req, res) => {
  try {
    const { documentId, videoId } = req.body;
    const userId = req.user._id;

    if (!documentId && !videoId) {
      return res.status(400).json({
        success: false,
        message: "documentId or videoId is required",
      });
    }

    let sessionData = {
      title: "AI Study Session",
      userId,
    };

    if (documentId) {
      const document = await Document.findOne({
        _id: documentId,
        uploadedBy: userId,
        isActive: true,
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      sessionData.documents = [document._id];
      sessionData.title = `AI Study: ${document.title}`;
    }

    if (videoId) {
      const video = await Video.findOne({
        _id: videoId,
        uploadedBy: userId,
        isActive: true,
      });

      if (!video || !video.transcript) {
        return res.status(404).json({
          success: false,
          message: "Video or transcript not found",
        });
      }

      sessionData.videos = [video._id];
      sessionData.title = `AI Study: ${video.title}`;
    }

    const session = await StudySession.create(sessionData);

    res.json({ success: true, sessionId: session._id });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ success: false });
  }
};



/* -------------------- SEND MESSAGE -------------------- */

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, content } = req.body;

    if (!sessionId || !content) {
      return res.status(400).json({
        success: false,
        message: "sessionId and content are required",
      });
    }


    const session = await StudySession.findOne({
      _id: sessionId,
      userId: req.user._id,
      isActive: true,
    })
      .populate("documents")
      .populate("videos");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    await ChatMessage.create({
      sessionId,
      userId: req.user._id,
      role: "user",
      content,
    });

    /* -------- CONTEXT SOURCE -------- */

    let sourceText = "";

    if (session.videos?.length) {
      sourceText = session.videos[0].transcript;
    } else if (session.documents?.length) {
      sourceText = session.documents[0].content;
    }

    if (!sourceText || sourceText.trim().length < 20) {
      const msg = "❌ Selected source has no usable content.";

      const aiMessage = await ChatMessage.create({
        sessionId,
        userId: req.user._id,
        role: "assistant",
        content: msg,
      });

      return res.json({ success: true, aiMessage });
    }


    /*important if transcribtion is in process*/

if (session.videos?.length && session.videos[0].status !== "ready") {
  return res.json({
    success: true,
    aiMessage: {
      content: "⏳ Video is still being transcribed. Please wait.",
    },
  });
}

    /* -------- TOKEN SAFE CONTEXT -------- */

    const chunks = splitIntoChunks(sourceText);
    const relevantChunks = getRelevantChunks(chunks, content);

    if (!relevantChunks.length) {
      const msg =
        "❌ This question is out of context of the selected content.";

      const aiMessage = await ChatMessage.create({
        sessionId,
        userId: req.user._id,
        role: "assistant",
        content: msg,
      });

      return res.json({ success: true, aiMessage });
    }

    const contextText = relevantChunks.join("\n\n---\n\n");

    /* -------- LLM CALL -------- */

    const aiResponse = await llmService.generateChatResponse(
      content,
      contextText
    );

    const aiMessage = await ChatMessage.create({
      sessionId,
      userId: req.user._id,
      role: "assistant",
      content: aiResponse,
    });

    res.json({ success: true, aiMessage });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.generateAudioDialogue = async (req, res) => {
  res.json({ success: true, message: "Audio dialogue coming soon" });
};

exports.getAudioDialogues = async (req, res) => {
  res.json({ success: true, dialogues: [] });
};

