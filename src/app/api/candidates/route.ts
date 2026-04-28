import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// GET - List all candidates
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const candidates = await db.candidate.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(candidates)
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    )
  }
}

// POST - Create a new candidate with CV upload
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - please sign in again" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const name = formData.get("name") as string | null
    const email = formData.get("email") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    // Also check by extension as fallback
    const ext = file.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = ["pdf", "docx", "doc"]
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext || "")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or DOCX file." },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Save file
    const fileExtension = ext || "pdf"
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Try to parse CV text
    let cvText = ""
    try {
      // Dynamic import for PDF/DOCX parsing
      if (fileExtension === "pdf") {
        const pdfParse = (await import("pdf-parse")).default
        const data = await pdfParse(buffer)
        cvText = data.text
      } else if (fileExtension === "docx" || fileExtension === "doc") {
        const mammoth = await import("mammoth")
        const result = await mammoth.extractRawText({ buffer })
        cvText = result.value
      }
    } catch (parseError) {
      console.error("File parsing error:", parseError)
      // Continue without parsed text
    }

    // Extract basic info from text using regex
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/)
    const phoneMatch = cvText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)
    
    // Extract potential name (first non-empty line that looks like a name)
    const lines = cvText.split("\n").map(l => l.trim()).filter(l => l.length > 0)
    let extractedName: string | null = null
    for (const line of lines.slice(0, 5)) {
      // Check if line looks like a name (2-4 words, each capitalized)
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(line)) {
        extractedName = line
        break
      }
    }

    // Try AI parsing (will fall back to mock if not configured)
    let extractedData: {
      name: string | null
      email: string | null
      phone: string | null
      location: string | null
      linkedin: string | null
      website: string | null
      github: string | null
      summary: string | null
      skills: string[]
      experience: any[]
      education: any[]
      certifications: string[]
      languages: string[]
      projects: any[]
    } = {
      name: extractedName,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      location: null,
      linkedin: null,
      website: null,
      github: null,
      summary: null,
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      languages: [],
      projects: [],
    }

    // Try AI parsing
    try {
      const { parseCV } = await import("@/lib/ai-service")
      extractedData = await parseCV(cvText)
    } catch (aiError) {
      console.log("AI parsing skipped:", aiError)
      // Use regex-extracted data
    }

    // Create candidate record
    const candidate = await db.candidate.create({
      data: {
        ownerId: session.user.id,
        name: name || extractedData.name || "Unknown Candidate",
        email: email || extractedData.email,
        phone: extractedData.phone,
        location: extractedData.location,
        linkedin: extractedData.linkedin,
        website: extractedData.website,
        github: extractedData.github,
        summary: extractedData.summary || (cvText ? cvText.substring(0, 500) + "..." : null),
        skills: JSON.stringify(extractedData.skills),
        experience: JSON.stringify(extractedData.experience),
        education: JSON.stringify(extractedData.education),
        certifications: JSON.stringify(extractedData.certifications),
        languages: JSON.stringify(extractedData.languages),
        projects: JSON.stringify(extractedData.projects),
        cvFilePath: fileName,
        cvText: cvText || null,
        extractedJson: JSON.stringify(extractedData),
      },
    })

    return NextResponse.json(candidate, { status: 201 })
  } catch (error) {
    console.error("Error creating candidate:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create candidate" },
      { status: 500 }
    )
  }
}
