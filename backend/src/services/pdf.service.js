// src/services/pdf.service.js
const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");
const { createWorker } = require("tesseract.js");//tesseract is a library for OCR (Optical Character Recognition) //mtlb scanned pdf ko text me convert karta hai text pe
const { createCanvas } = require("canvas");//canvas is a library for creating images

const extractTextFromPDF = async (filePath) => {
  // -------------------------------
  // 1️⃣ TRY NORMAL TEXT EXTRACTION
  // -------------------------------
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items.map(item => item.str).join(" ");
    fullText += `\n\n--- Page ${pageNum} ---\n${pageText}`;
  }

  const isMeaningfulText = (text) => {
    if (!text) return false;
  
    const cleaned = text.replace(/[^a-zA-Z0-9 ]/g, " ");
    const words = cleaned.split(/\s+/).filter(w => w.length >= 3);
  
    const wordCount = words.length;
    const avgWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / (wordCount || 1);
  
    return wordCount > 50 && avgWordLength > 3;
  };
  

  // ✅ If text-based PDF → return immediately
  if (isMeaningfulText(fullText)) {
    console.log("✅ Real text-based PDF detected");
    return {
      text: fullText.trim(),
      pageCount: pdf.numPages,
    };
  }  

  // --------------------------------
  // 2️⃣ FALLBACK TO OCR (SCANNED PDF)
  // --------------------------------
  console.log("⚠️ Scanned PDF detected → Running OCR");

  const worker = await createWorker("eng");
  let ocrText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const imageBuffer = canvas.toBuffer();

    const {
      data: { text },
    } = await worker.recognize(imageBuffer);

    ocrText += `\n\n--- Page ${pageNum} ---\n${text}`;
  }

  await worker.terminate();

  return {
    text: ocrText.trim(),
    pageCount: pdf.numPages,
  };
};

module.exports = {
  extractTextFromPDF,
};
