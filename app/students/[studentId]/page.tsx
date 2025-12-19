import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { canAccessStudent } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentProfileView } from "@/components/counselor/student-profile-view"
import { notFound } from "next/navigation"

export default async function StudentProfilePage({
  params,
}: {
  params: { studentId: string }
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

  const student = await prisma.studentProfile.findUnique({
    where: { id: params.studentId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      tasks: {
        include: {
          creator: {
            select: { name: true, email: true },
          },
        },
        orderBy: { dueDate: "asc" },
      },
      deadlines: {
        orderBy: { dueDate: "asc" },
      },
      colleges: {
        orderBy: { deadlineDate: "asc" },
      },
      essays: {
        include: {
          versions: {
            include: {
              author: {
                select: { name: true, email: true },
              },
            },
            orderBy: { versionNumber: "desc" },
          },
        },
      },
      intakeResponses: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (!student) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {student.user.name || student.user.email}
          </h1>
          <p className="text-muted-foreground">Student Profile</p>
        </div>

        <StudentProfileView student={student as any} currentUserRole={session.user.role} />
      </div>
    </DashboardLayout>
  )
}
