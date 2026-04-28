import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// GET - Get a single evaluation with full details
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

    const evaluation = await db.evaluation.findFirst({
      where: { id, ownerId: session.user.id },
      include: {
        candidate: true,
        jobRole: true,
        shareLinks: true,
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Error fetching evaluation:", error)
    return NextResponse.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an evaluation
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

    const existingEvaluation = await db.evaluation.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!existingEvaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    await db.evaluation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting evaluation:", error)
    return NextResponse.json(
      { error: "Failed to delete evaluation" },
      { status: 500 }
    )
  }
}

// POST - Create shareable link
export async function POST(
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
    const { expiresInDays } = body

    const evaluation = await db.evaluation.findFirst({
      where: { id, ownerId: session.user.id },
    })

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    const token = uuidv4()
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null

    const shareLink = await db.shareLink.create({
      data: {
        evaluationId: id,
        token,
        expiresAt,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(shareLink, { status: 201 })
  } catch (error) {
    console.error("Error creating share link:", error)
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    )
  }
}
