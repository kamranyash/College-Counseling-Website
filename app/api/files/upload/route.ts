import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FileCategory } from "@prisma/client"
import { canAccessStudent } from "@/lib/permissions"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, files } = await req.json()

    if (!studentId || !files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: "Student ID and files are required" },
        { status: 400 }
      )
    }

    // Verify access
    const hasAccess = await canAccessStudent(
      { userId: session.user.id, role: session.user.role },
      studentId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Create file upload records
    const uploads = await prisma.fileUpload.createMany({
      data: files.map((file: any) => ({
        studentId,
        uploadedById: session.user.id,
        name: file.name,
        url: file.url,
        size: file.size || null,
        category: (file.category as FileCategory) || FileCategory.OTHER,
      })),
    })

    return NextResponse.json({ success: true, count: uploads.count }, { status: 201 })
  } catch (error: any) {
    console.error("Error uploading files:", error)
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    )
  }
}
