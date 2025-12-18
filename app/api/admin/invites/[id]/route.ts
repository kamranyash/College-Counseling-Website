import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.invite.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Invite deleted" })
  } catch (error: any) {
    console.error("Error deleting invite:", error)
    return NextResponse.json(
      { error: "Failed to delete invite" },
      { status: 500 }
    )
  }
}
