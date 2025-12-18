import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

// This route handles OAuth signup completion after user authenticates with Google
// The invite code should be stored and retrieved to complete the signup
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.redirect("/auth/login?error=session_required")
    }

    // Check if user already has a profile (already signed up)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        studentProfile: true,
        parentProfile: true,
        counselorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.redirect("/auth/login?error=user_not_found")
    }

    // If user already has a profile, redirect to dashboard
    if (user.studentProfile || user.parentProfile || user.counselorProfile) {
      return NextResponse.redirect("/dashboard")
    }

    // TODO: Retrieve invite code from sessionStorage or pass it via URL parameter
    // For now, redirect to signup page to enter invite code manually
    // In production, you'd want to store the invite code in a session/cookie before OAuth redirect
    return NextResponse.redirect("/auth/signup?error=invite_code_required&oauth=1")
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect("/auth/login?error=oauth_callback_failed")
  }
}
