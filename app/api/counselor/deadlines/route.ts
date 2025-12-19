import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, DeadlineType } from "@prisma/client"
import { canAccessStudent } from "@/lib/permissions"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.SUPER_ADMIN && session.user.role !== UserRole.COUNSELOR) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { studentId, title, type, dueDate, notes } = await req.json()

    if (!studentId || !title || !type || !dueDate) {
      return NextResponse.json(
        { error: "Student ID, title, type, and due date are required" },
        { status: 400 }
      )
    }

    // Verify access to student
    const hasAccess = await canAccessStudent(
      { userId: session.user.id, role: session.user.role },
      studentId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const deadline = await prisma.deadline.create({
      data: {
        studentId,
        title,
        type: type as DeadlineType,
        dueDate: new Date(dueDate),
        notes: notes || null,
      },
    })

    return NextResponse.json(deadline, { status: 201 })
  } catch (error: any) {
    console.error("Error creating deadline:", error)
    return NextResponse.json(
      { error: "Failed to create deadline" },
      { status: 500 }
    )
  }
}
