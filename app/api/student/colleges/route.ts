import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DeadlineType } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, name, deadlineType, deadlineDate } = await req.json()

    if (!studentId || !name || !deadlineType || !deadlineDate) {
      return NextResponse.json(
        { error: "Student ID, name, deadline type, and deadline date are required" },
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

    const college = await prisma.college.create({
      data: {
        studentId,
        name,
        deadlineType: deadlineType as DeadlineType,
        deadlineDate: new Date(deadlineDate),
      },
    })

    return NextResponse.json(college, { status: 201 })
  } catch (error: any) {
    console.error("Error creating college:", error)
    return NextResponse.json(
      { error: "Failed to create college" },
      { status: 500 }
    )
  }
}
