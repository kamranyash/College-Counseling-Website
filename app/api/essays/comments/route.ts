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

    const { essayVersionId, body, isPrivate } = await req.json()

    if (!essayVersionId || !body) {
      return NextResponse.json(
        { error: "Essay version ID and body are required" },
        { status: 400 }
      )
    }

    // Get essay version to check access
    const essayVersion = await prisma.essayVersion.findUnique({
      where: { id: essayVersionId },
      include: {
        essay: {
          include: {
            student: true,
          },
        },
      },
    })

    if (!essayVersion) {
      return NextResponse.json({ error: "Essay version not found" }, { status: 404 })
    }

    // Verify access to student
    const hasAccess = await canAccessStudent(
      { userId: session.user.id, role: session.user.role },
      essayVersion.essay.student.id
    )

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Only counselors and admins can create private notes
    const canCreatePrivate =
      (session.user.role === UserRole.COUNSELOR || session.user.role === UserRole.SUPER_ADMIN) &&
      isPrivate

    const comment = await prisma.essayComment.create({
      data: {
        essayVersionId,
        authorId: session.user.id,
        body,
        isPrivate: canCreatePrivate || false,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error: any) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
