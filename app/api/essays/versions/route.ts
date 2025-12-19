import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canAccessStudent } from "@/lib/permissions"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { essayId, versionNumber, content, fileUrl } = await req.json()

    if (!essayId || !versionNumber) {
      return NextResponse.json(
        { error: "Essay ID and version number are required" },
        { status: 400 }
      )
    }

    // Get essay to check access
    const essay = await prisma.essay.findUnique({
      where: { id: essayId },
      include: {
        student: true,
      },
    })

    if (!essay) {
      return NextResponse.json({ error: "Essay not found" }, { status: 404 })
    }

    // Verify access to student
    const hasAccess = await canAccessStudent(
      { userId: session.user.id, role: session.user.role },
      essay.student.id
    )

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const version = await prisma.essayVersion.create({
      data: {
        essayId,
        versionNumber: parseInt(versionNumber),
        authorId: session.user.id,
        content: content || null,
        fileUrl: fileUrl || null,
      },
    })

    return NextResponse.json(version, { status: 201 })
  } catch (error: any) {
    console.error("Error creating essay version:", error)
    return NextResponse.json(
      { error: "Failed to create essay version" },
      { status: 500 }
    )
  }
}
