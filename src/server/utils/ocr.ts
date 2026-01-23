// OCR service using Tesseract.js
// Extracts text from images

import { createWorker } from "tesseract.js";

/**
 * Extract text from image URL
 */
export async function extractTextFromImage(
  imageUrl: string,
  language: string = "kor+eng"
): Promise<string> {
  let worker = null;

  try {
    // Create Tesseract worker
    worker = await createWorker(language);

    // Recognize text
    const {
      data: { text },
    } = await worker.recognize(imageUrl);

    // Clean up whitespace
    const cleanedText = text.trim().replace(/\s+/g, " ");

    return cleanedText;
  } catch (error) {
    console.error("OCR error:", error);
    throw new Error("이미지에서 텍스트를 추출하는 데 실패했습니다.");
  } finally {
    // Always terminate worker
    if (worker) {
      await worker.terminate();
    }
  }
}

/**
 * Extract text from base64 image data
 */
export async function extractTextFromBase64(
  base64Data: string,
  language: string = "kor+eng"
): Promise<string> {
  // Convert base64 to data URL if needed
  const dataUrl = base64Data.startsWith("data:")
    ? base64Data
    : `data:image/png;base64,${base64Data}`;

  return extractTextFromImage(dataUrl, language);
}

/**
 * Validate if text extraction was successful
 */
export function isValidExtractedText(text: string, minLength: number = 10): boolean {
  return text.length >= minLength;
}
