import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get a single candidate
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

    const candidate = await db.candidate.findFirst({
      where: { id, ownerId: session.user.id },
      include: {
        notes: {
          include: {
            author: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: "desc" }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    return NextResponse.json(candidate)
  } catch (error) {
    console.error("Error fetching candidate:", error)
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    )
  }
}

// PUT - Update a candidate
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

    const existingCandidate = await db.candidate.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existingCandidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    const candidate = await db.candidate.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        location: body.location,
        linkedin: body.linkedin,
        website: body.website,
        github: body.github,
        summary: body.summary,
        skills: JSON.stringify(body.skills),
        experience: JSON.stringify(body.experience),
        education: JSON.stringify(body.education),
        status: body.status,
      },
    })

    return NextResponse.json(candidate)
  } catch (error) {
    console.error("Error updating candidate:", error)
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a candidate
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

    const existingCandidate = await db.candidate.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existingCandidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    await db.candidate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting candidate:", error)
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    )
  }
}
