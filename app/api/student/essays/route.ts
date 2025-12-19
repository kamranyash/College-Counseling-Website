import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, title } = await req.json()

    if (!studentId || !title) {
      return NextResponse.json(
        { error: "Student ID and title are required" },
        { status: 400 }
      )
    }

    // Verify student owns this profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!student || student.id !== studentId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const essay = await prisma.essay.create({
      data: {
        studentId,
        title,
      },
    })

    return NextResponse.json(essay, { status: 201 })
  } catch (error: any) {
    console.error("Error creating essay:", error)
    return NextResponse.json(
      { error: "Failed to create essay" },
      { status: 500 }
    )
  }
}
