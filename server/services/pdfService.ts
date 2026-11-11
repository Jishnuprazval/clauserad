import { PDFParse } from 'pdf-parse';

export interface ExtractedPdfResult {
  text: string;
  numPages: number;
  pages?: { num: number; text: string }[];
}

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<ExtractedPdfResult> {
  try {
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const cleanedText = (textResult.text || '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    return {
      text: cleanedText,
      numPages: textResult.total || 1,
      pages: textResult.pages || [],
    };
  } catch (error: any) {
    console.error('PDF extraction error in PDFParse:', error);
    const fallbackText = buffer.toString('utf-8').trim();
    if (fallbackText.length > 50) {
      return {
        text: fallbackText,
        numPages: 1,
      };
    }
    throw new Error('Failed to parse PDF document. The file may be corrupt, password-protected, or scanned image-only.');
  }
}
