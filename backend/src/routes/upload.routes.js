const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const {
  uploadPDF,
  generateDocumentSummary,
  getDocumentStatus,
  getDocuments,
  deleteDocument,
  getDocumentById,
} = require('../controllers/upload.controller');

const {
  uploadPDF: uploadPDFMiddleware,
  handleUploadError,
} = require('../middlewares/upload.middleware');

// Upload PDF
router.post(
  '/pdf',
  protect,
  uploadPDFMiddleware.single('file'),
  handleUploadError,
  uploadPDF
);

// List documents
router.get('/documents', protect, getDocuments);

// Get single document
router.get('/documents/:id', protect, getDocumentById);

// Trigger summary
router.post(
  '/documents/:id/summary',
  protect,
  generateDocumentSummary
);

// Poll summary status
router.get(
  '/documents/:id/status',
  protect,
  getDocumentStatus
);

router.delete(
  "/documents/:id",
  protect,
  deleteDocument
);


module.exports = router;
