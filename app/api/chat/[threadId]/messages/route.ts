import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.chatMessage.findMany({
      where: { threadId: params.threadId },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { body } = await req.json()

    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 }
      )
    }

    // Verify user is a participant in the thread
    const participant = await prisma.chatThreadParticipant.findFirst({
      where: {
        threadId: params.threadId,
        userId: session.user.id,
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const message = await prisma.chatMessage.create({
      data: {
        threadId: params.threadId,
        authorId: session.user.id,
        body,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}
