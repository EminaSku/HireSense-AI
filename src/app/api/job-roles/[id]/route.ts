import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get a single job role
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const jobRole = await db.jobRole.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!jobRole) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 })
    }

    return NextResponse.json(jobRole)
  } catch (error) {
    console.error("Error fetching job role:", error)
    return NextResponse.json(
      { error: "Failed to fetch job role" },
      { status: 500 }
    )
  }
}

// PUT - Update a job role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existingRole = await db.jobRole.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existingRole) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 })
    }

    const jobRole = await db.jobRole.update({
      where: { id },
      data: {
        title: body.title,
        department: body.department,
        seniority: body.seniority,
        location: body.location,
        remoteType: body.remoteType,
        jdText: body.jdText,
        requiredSkills: JSON.stringify(body.requiredSkills || []),
        niceToHaveSkills: JSON.stringify(body.niceToHaveSkills || []),
        responsibilities: JSON.stringify(body.responsibilities || []),
        yearsExperience: body.yearsExperience,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        mustHaveKeywords: JSON.stringify(body.mustHaveKeywords || []),
      },
    })

    return NextResponse.json(jobRole)
  } catch (error) {
    console.error("Error updating job role:", error)
    return NextResponse.json(
      { error: "Failed to update job role" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a job role
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const existingRole = await db.jobRole.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existingRole) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 })
    }

    await db.jobRole.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job role:", error)
    return NextResponse.json(
      { error: "Failed to delete job role" },
      { status: 500 }
    )
  }
}
