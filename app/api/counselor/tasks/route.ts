import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
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

    const { studentId, title, description, dueDate } = await req.json()

    if (!studentId || !title || !dueDate) {
      return NextResponse.json(
        { error: "Student ID, title, and due date are required" },
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

    const task = await prisma.task.create({
      data: {
        studentId,
        createdById: session.user.id,
        title,
        description: description || null,
        dueDate: new Date(dueDate),
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
