/**
 * File Parser for CV documents
 * Supports PDF and DOCX formats
 */

// Dynamic imports for PDF and DOCX parsing
export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Use pdf-parse for PDF extraction
    const pdfParse = (await import("pdf-parse")).default
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error("PDF parsing error:", error)
    throw new Error("Failed to parse PDF file")
  }
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    // Use mammoth for DOCX extraction
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error("DOCX parsing error:", error)
    throw new Error("Failed to parse DOCX file")
  }
}

export async function parseCVFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return parsePDF(buffer)
  }
  
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return parseDOCX(buffer)
  }
  
  throw new Error(`Unsupported file type: ${mimeType}`)
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export function isSupportedCVFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ["pdf", "docx", "doc"].includes(ext)
}
