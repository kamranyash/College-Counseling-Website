import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CollegeStatus } from "@prisma/client"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, notes } = await req.json()

    // Verify student owns this college
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const college = await prisma.college.findFirst({
      where: {
        id: params.id,
        studentId: student.id,
      },
    })

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 })
    }

    const updatedCollege = await prisma.college.update({
      where: { id: params.id },
      data: {
        ...(status && { status: status as CollegeStatus }),
        ...(notes !== undefined && { notes }),
      },
    })

    return NextResponse.json(updatedCollege)
  } catch (error: any) {
    console.error("Error updating college:", error)
    return NextResponse.json(
      { error: "Failed to update college" },
      { status: 500 }
    )
  }
}
