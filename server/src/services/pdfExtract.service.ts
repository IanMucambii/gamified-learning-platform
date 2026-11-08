import fs from "fs";
import * as pdfParseModule from "pdf-parse";

const pdfParse = pdfParseModule as unknown as (buffer: Buffer) => Promise<{text: string}>;

export default async function extractTextFromPDF(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}