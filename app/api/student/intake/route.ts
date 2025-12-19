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

    const { studentId, data } = await req.json()

    if (!studentId || !data) {
      return NextResponse.json(
        { error: "Student ID and form data are required" },
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

    const intakeResponse = await prisma.intakeResponse.create({
      data: {
        studentId,
        userId: session.user.id,
        data,
      },
    })

    return NextResponse.json(intakeResponse, { status: 201 })
  } catch (error: any) {
    console.error("Error submitting intake form:", error)
    return NextResponse.json(
      { error: "Failed to submit intake form" },
      { status: 500 }
    )
  }
}
