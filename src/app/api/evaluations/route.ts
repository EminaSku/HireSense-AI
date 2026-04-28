import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { evaluateCandidate, generateInterviewKit, generateRecruiterSummary } from "@/lib/ai-service"

// GET - List all evaluations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const evaluations = await db.evaluation.findMany({
      where: { ownerId: session.user.id },
      include: {
        candidate: { select: { name: true, email: true } },
        jobRole: { select: { title: true, seniority: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error("Error fetching evaluations:", error)
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    )
  }
}

// POST - Create a new evaluation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { jobRoleId, candidateId } = body

    // Fetch job role and candidate
    const [jobRole, candidate] = await Promise.all([
      db.jobRole.findFirst({
        where: { id: jobRoleId, ownerId: session.user.id },
      }),
      db.candidate.findFirst({
        where: { id: candidateId, ownerId: session.user.id },
      }),
    ])

    if (!jobRole) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 })
    }

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Parse candidate data
    const candidateData = {
      name: candidate.name,
      summary: candidate.summary,
      skills: JSON.parse(candidate.skills || "[]"),
      experience: JSON.parse(candidate.experience || "[]"),
      education: JSON.parse(candidate.education || "[]"),
    }

    // Parse job role data
    const jobRoleData = {
      title: jobRole.title,
      seniority: jobRole.seniority,
      requiredSkills: JSON.parse(jobRole.requiredSkills || "[]"),
      niceToHaveSkills: JSON.parse(jobRole.niceToHaveSkills || "[]"),
      yearsExperience: jobRole.yearsExperience,
      responsibilities: JSON.parse(jobRole.responsibilities || "[]"),
      mustHaveKeywords: JSON.parse(jobRole.mustHaveKeywords || "[]"),
    }

    // Run AI evaluation
    const evaluationResult = await evaluateCandidate(candidateData, jobRoleData)

    // Generate interview kit
    const interviewKit = await generateInterviewKit(
      candidateData,
      jobRoleData,
      evaluationResult.gaps
    )

    // Generate recruiter summary
    const summaryText = await generateRecruiterSummary(
      candidate.name,
      jobRole.title,
      evaluationResult
    )

    // Create evaluation record
    const evaluation = await db.evaluation.create({
      data: {
        ownerId: session.user.id,
        jobRoleId,
        candidateId,
        fitScore: evaluationResult.fitScore,
        categoryScores: JSON.stringify(evaluationResult.categoryScores),
        breakdownJson: JSON.stringify(evaluationResult),
        whyThisScore: JSON.stringify(evaluationResult.whyThisScore),
        matchedKeywords: JSON.stringify(evaluationResult.matchedKeywords),
        gaps: JSON.stringify(evaluationResult.gaps),
        riskFlags: JSON.stringify(evaluationResult.riskFlags),
        interviewKitJson: JSON.stringify(interviewKit),
        summaryText,
        strengths: JSON.stringify(evaluationResult.strengths),
        concerns: JSON.stringify(evaluationResult.concerns),
        recommendation: evaluationResult.recommendation,
        confidence: evaluationResult.confidence,
        modelUsed: process.env.AI_MODE === "local" ? "local-llm" : "gpt-4o",
      },
    })

    return NextResponse.json(evaluation, { status: 201 })
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return NextResponse.json(
      { error: "Failed to create evaluation" },
      { status: 500 }
    )
  }
}
