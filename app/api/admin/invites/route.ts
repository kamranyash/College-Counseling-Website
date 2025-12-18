import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateInviteCode } from "@/lib/utils"
import { sendInviteEmail, logNotification } from "@/lib/email"
import { UserRole } from "@prisma/client"
import { addDays } from "date-fns"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invites = await prisma.invite.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(invites)
  } catch (error: any) {
    console.error("Error fetching invites:", error)
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, role, studentId, counselorId } = await req.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Generate unique invite code
    let code = generateInviteCode()
    let codeExists = true
    while (codeExists) {
      const existing = await prisma.invite.findUnique({ where: { code } })
      if (!existing) {
        codeExists = false
      } else {
        code = generateInviteCode()
      }
    }

    // Create invite
    const invite = await prisma.invite.create({
      data: {
        code,
        email: email.toLowerCase(),
        role,
        expiresAt: addDays(new Date(), 14),
        createdById: session.user.id,
        studentId: studentId || null,
        counselorId: counselorId || null,
      },
    })

    // Send invite email
    const emailResult = await sendInviteEmail(email, code, role)
    await logNotification(
      "invite_created",
      email,
      emailResult.success,
      emailResult.error?.message,
      session.user.id,
      { inviteId: invite.id, role }
    )

    return NextResponse.json(invite, { status: 201 })
  } catch (error: any) {
    console.error("Error creating invite:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create invite" },
      { status: 500 }
    )
  }
}
