import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateInviteCode } from "@/lib/utils"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { inviteCode, email, password, name } = await req.json()

    if (!inviteCode || !email || !password) {
      return NextResponse.json(
        { error: "Invite code, email, and password are required" },
        { status: 400 }
      )
    }

    // Find and validate invite
    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode.toUpperCase() },
    })

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invite code" },
        { status: 400 }
      )
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { error: "This invite code has already been used" },
        { status: 400 }
      )
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This invite code has expired" },
        { status: 400 }
      )
    }

    if (invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Email does not match the invite" },
        { status: 400 }
      )
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with transaction to ensure profile creation
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name: name || null,
          password: hashedPassword,
          role: invite.role,
        },
      })

      // Create profile based on role
      if (invite.role === UserRole.STUDENT) {
        const studentProfile = await tx.studentProfile.create({
          data: { userId: user.id },
        })

        // Create chat thread for student
        await tx.chatThread.create({
          data: { studentId: studentProfile.id },
        })
      } else if (invite.role === UserRole.PARENT) {
        const parentProfile = await tx.parentProfile.create({
          data: { userId: user.id },
        })

        // Link parent to student if studentId provided
        if (invite.studentId) {
          await tx.parentStudentLink.create({
            data: {
              parentId: parentProfile.id,
              studentId: invite.studentId,
            },
          })
        }
      } else if (invite.role === UserRole.COUNSELOR) {
        const counselorProfile = await tx.counselorProfile.create({
          data: { userId: user.id },
        })

        // Assign counselor to student if studentId provided
        if (invite.studentId) {
          await tx.studentCounselorAssignment.create({
            data: {
              studentId: invite.studentId,
              counselorId: counselorProfile.id,
            },
          })
        }
      }

      // Mark invite as used
      await tx.invite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      })

      return user
    })

    return NextResponse.json(
      { message: "Account created successfully", userId: result.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    )
  }
}
