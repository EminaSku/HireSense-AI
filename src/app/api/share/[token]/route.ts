import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const shareLink = await db.shareLink.findUnique({
      where: { token },
      include: {
        evaluation: {
          include: {
            candidate: true,
            jobRole: true,
          },
        },
      },
    })

    if (!shareLink) {
      return NextResponse.json({ error: "Share link not found" }, { status: 404 })
    }

    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return NextResponse.json({ error: "Share link has expired" }, { status: 410 })
    }

    // Increment view count
    await db.shareLink.update({
      where: { token },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(shareLink.evaluation)
  } catch (error) {
    console.error("Error fetching shared evaluation:", error)
    return NextResponse.json(
      { error: "Failed to fetch shared evaluation" },
      { status: 500 }
    )
  }
}
