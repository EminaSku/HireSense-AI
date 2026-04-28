import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all job roles for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobRoles = await db.jobRole.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(jobRoles)
  } catch (error) {
    console.error("Error fetching job roles:", error)
    return NextResponse.json(
      { error: "Failed to fetch job roles" },
      { status: 500 }
    )
  }
}

// POST - Create a new job role
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      department,
      seniority,
      location,
      remoteType,
      jdText,
      requiredSkills,
      niceToHaveSkills,
      responsibilities,
      yearsExperience,
      salaryMin,
      salaryMax,
      mustHaveKeywords,
    } = body

    const jobRole = await db.jobRole.create({
      data: {
        ownerId: session.user.id,
        title,
        department,
        seniority,
        location,
        remoteType,
        jdText,
        requiredSkills: JSON.stringify(requiredSkills || []),
        niceToHaveSkills: JSON.stringify(niceToHaveSkills || []),
        responsibilities: JSON.stringify(responsibilities || []),
        yearsExperience,
        salaryMin,
        salaryMax,
        mustHaveKeywords: JSON.stringify(mustHaveKeywords || []),
      },
    })

    return NextResponse.json(jobRole, { status: 201 })
  } catch (error) {
    console.error("Error creating job role:", error)
    return NextResponse.json(
      { error: "Failed to create job role" },
      { status: 500 }
    )
  }
}
