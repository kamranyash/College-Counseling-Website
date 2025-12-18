import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Role-based redirect
  switch (session.user.role) {
    case UserRole.SUPER_ADMIN:
      redirect("/admin")
    case UserRole.STUDENT:
      redirect("/student")
    case UserRole.PARENT:
      redirect("/parent")
    case UserRole.COUNSELOR:
      redirect("/counselor")
    default:
      redirect("/auth/login")
  }
}
