const Document = require("../models/Document.model");
const pdfService = require("../services/pdf.service");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

const {
  generateSummaryInBackground,
} = require("../workers/summary.worker");

/* ===================== UPLOAD PDF ===================== */
const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { title } = req.body;

    // 🔥 VERY IMPORTANT: store RELATIVE path
    const filePath = `/uploads/pdf/${req.file.filename}`;

    const { text, pageCount } =
      await pdfService.extractTextFromPDF(req.file.path);

    if (!text || text.trim().length < 100) {
      throw new Error("No readable text found in PDF");
    }

    const document = await Document.create({
      title: title || req.file.originalname,
      type: "pdf",
      filePath,
      content: text,
      uploadedBy: req.user._id,
      status: "idle",
      metadata: {
        pageCount,
        wordCount: text.split(/\s+/).length,
        uploadDate: new Date(),
        originalFileName: req.file.originalname,
      },
    });

    res.status(201).json({
      success: true,
      document,
    });
  } catch (error) {
    logger.error("Upload PDF error:", error);

    // Cleanup uploaded file if something fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload PDF",
    });
  }
};

/* ===================== GET ALL DOCUMENTS ===================== */
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    logger.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

/* ===================== GET DOCUMENT BY ID ===================== */
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    logger.error("Get document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};

/* ===================== DELETE DOCUMENT (PATH FIXED) ===================== */
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // 🔥 DELETE LOCAL PDF FILE (PATH MATCHES app.js)
    if (doc.type === "pdf" && doc.filePath) {
      // app.js uses: path.join(__dirname, '../uploads')
      // controller is in: src/controllers
      const absolutePath = path.join(
        __dirname,
        "../../uploads",
        doc.filePath.replace("/uploads/", "")
      );

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log("🗑️ PDF deleted:", absolutePath);
      } else {
        console.warn("⚠️ PDF not found:", absolutePath);
      }
    }

    // 🔥 DELETE FROM DATABASE
    await doc.deleteOne();

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    logger.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};

/* ===================== GENERATE SUMMARY ===================== */
const generateDocumentSummary = async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    uploadedBy: req.user._id,
  });

  if (!document) {
    return res.status(404).json({ success: false });
  }

  if (document.status === "ready") {
    return res.json({
      success: true,
      status: "ready",
      summary: document.summary,
      keyPoints: document.keyPoints,
    });
  }

  if (document.status === "processing") {
    return res.json({
      success: true,
      status: "processing",
    });
  }

  document.status = "processing";
  await document.save();

  generateSummaryInBackground(document._id);

  res.json({
    success: true,
    status: "processing",
  });
};

/* ===================== STATUS ONLY ===================== */
const getDocumentStatus = async (req, res) => {
  const doc = await Document.findOne(
    { _id: req.params.id, uploadedBy: req.user._id },
    { status: 1, summary: 1, keyPoints: 1 }
  );

  if (!doc) {
    return res.status(404).json({ success: false });
  }

  res.set("Cache-Control", "no-store");

  res.json({
    success: true,
    status: doc.status,
    summary: doc.summary,
    keyPoints: doc.keyPoints,
  });
};

/* ===================== EXPORTS ===================== */
module.exports = {
  uploadPDF,
  getDocuments,
  getDocumentById,
  deleteDocument,          // ✅ FIXED
  generateDocumentSummary,
  getDocumentStatus,
};
