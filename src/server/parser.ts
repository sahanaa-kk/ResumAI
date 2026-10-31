import mammoth from 'mammoth';

/**
 * Clean extracted PDF text by removing pagination markers and normalizing whitespace
 */
function cleanExtractedText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '') // remove pagination headers
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Fallback heuristic extractor for simple text-based PDFs with uncompressed text streams
 */
function extractFromStreams(buffer: Buffer): string {
  try {
    const raw = buffer.toString('latin1');
    const matches: string[] = [];
    
    // Look for text operators between BT (Begin Text) and ET (End Text)
    const btRegex = /BT([\s\S]*?)ET/g;
    let btMatch: RegExpExecArray | null;
    while ((btMatch = btRegex.exec(raw)) !== null) {
      const block = btMatch[1];
      // Match string literals: (Text here) Tj or [(T) -10 (ext)] TJ
      const tjRegex = /\((.*?)\)\s*Tj/g;
      let tjMatch: RegExpExecArray | null;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        matches.push(tjMatch[1]);
      }

      // Match array of strings: [(string1) 120 (string2)] TJ
      const arrayTjRegex = /\[(.*?)\]\s*TJ/g;
      let arrayMatch: RegExpExecArray | null;
      while ((arrayMatch = arrayTjRegex.exec(block)) !== null) {
        const inner = arrayMatch[1];
        const innerStrRegex = /\((.*?)\)/g;
        let innerStrMatch: RegExpExecArray | null;
        while ((innerStrMatch = innerStrRegex.exec(inner)) !== null) {
          matches.push(innerStrMatch[1]);
        }
      }
    }

    if (matches.length > 5) {
      return cleanExtractedText(matches.join(' '));
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Robust PDF Buffer parser supporting class-based PDFParse (v2+) and legacy function-based pdf-parse (v1)
 */
export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  let extractedText = '';

  try {
    const pdfModule = (await import('pdf-parse')) as any;

    // 1. Try class-based PDFParse (v2.x ESM/CJS)
    if (pdfModule.PDFParse) {
      try {
        const parser = new pdfModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        if (result && result.text && result.text.trim()) {
          extractedText = cleanExtractedText(result.text);
        }
      } catch (classErr) {
        console.warn('PDFParse class extraction attempt failed, trying fallback:', classErr);
      }
    }

    // 2. Try function-based default export (v1.x)
    if (!extractedText && (typeof pdfModule.default === 'function' || typeof pdfModule === 'function')) {
      try {
        const fn = typeof pdfModule.default === 'function' ? pdfModule.default : pdfModule;
        const result = await fn(buffer);
        if (result && result.text && result.text.trim()) {
          extractedText = cleanExtractedText(result.text);
        }
      } catch (fnErr) {
        console.warn('pdf-parse function extraction attempt failed:', fnErr);
      }
    }

    // 3. Try pdf2json fallback
    if (!extractedText) {
      try {
        const { default: PDFParser } = (await import('pdf2json')) as any;
        const parsedViaJson = await new Promise<string>((resolve) => {
          const parser = new PDFParser(null, 1);
          parser.on('pdfParser_dataReady', () => {
            const raw = parser.getRawTextContent();
            resolve(raw || '');
          });
          parser.on('pdfParser_dataError', () => {
            resolve('');
          });
          parser.parseBuffer(buffer);
        });

        if (parsedViaJson && parsedViaJson.trim()) {
          extractedText = cleanExtractedText(parsedViaJson);
        }
      } catch (jsonErr) {
        console.warn('pdf2json extraction attempt failed:', jsonErr);
      }
    }

    // 4. Try raw stream heuristic as final safety net
    if (!extractedText) {
      const streamText = extractFromStreams(buffer);
      if (streamText && streamText.trim().length > 30) {
        extractedText = streamText;
      }
    }

    if (extractedText && extractedText.trim()) {
      return extractedText;
    }

    throw new Error(
      'No selectable text could be found in this PDF. It might be a scanned image without OCR, or password-protected. You can paste your resume text directly below.'
    );
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    throw new Error(
      error.message || 'Failed to parse PDF document. Ensure the file has selectable text or paste the text below.'
    );
  }
}

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return cleanExtractedText(result.value || '');
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX document.');
  }
}

export function extractStats(text: string) {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = clean.length;
  const pageEstimate = Math.max(1, Math.ceil(wordCount / 450));
  return { wordCount, charCount, pageEstimate };
}
