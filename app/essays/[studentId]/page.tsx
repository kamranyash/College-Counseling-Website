import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { canAccessStudent } from "@/lib/permissions"
import { EssayViewer } from "@/components/essay/essay-viewer"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"

export default async function EssayViewPage({
  params,
  searchParams,
}: {
  params: { studentId: string }
  searchParams: { essayId?: string }
}) {
  const session = await requireAuth()

  const hasAccess = await canAccessStudent(
    { userId: session.user.id, role: session.user.role },
    params.studentId
  )

  if (!hasAccess) {
    return (
      <DashboardLayout>
        <div>Access denied</div>
      </DashboardLayout>
    )
  }

  if (!searchParams.essayId) {
    return (
      <DashboardLayout>
        <Card className="p-6">
          <p>Please select an essay to view</p>
        </Card>
      </DashboardLayout>
    )
  }

  const essay = await prisma.essay.findFirst({
    where: {
      id: searchParams.essayId,
      studentId: params.studentId,
    },
    include: {
      student: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
      versions: {
        include: {
          author: {
            select: { name: true, email: true },
          },
          comments: {
            include: {
              author: {
                select: { name: true, email: true },
              },
            },
          },
        },
        orderBy: { versionNumber: "asc" },
      },
    },
  })

  if (!essay) {
    notFound()
  }

  const canViewPrivateNotes =
    session.user.role === "SUPER_ADMIN" || session.user.role === "COUNSELOR"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{essay.title}</h1>
          <p className="text-muted-foreground">
            Student: {essay.student.user.name || essay.student.user.email}
          </p>
        </div>

        <EssayViewer
          essay={essay as any}
          currentUserId={session.user.id}
          currentUserRole={session.user.role}
          canViewPrivateNotes={canViewPrivateNotes}
        />
      </div>
    </DashboardLayout>
  )
}
