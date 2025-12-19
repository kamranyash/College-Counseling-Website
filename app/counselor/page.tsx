import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileCheck, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CounselorDashboard() {
  const session = await requireAuth()

  const counselor = await prisma.counselorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      studentAssignments: {
        include: {
          student: {
            include: {
              user: {
                select: { name: true, email: true },
              },
              _count: {
                select: {
                  tasks: true,
                  deadlines: true,
                  essays: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!counselor) {
    return (
      <DashboardLayout>
        <div>Counselor profile not found</div>
      </DashboardLayout>
    )
  }

  const students = counselor.studentAssignments.map((assignment) => assignment.student)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Students ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students assigned yet</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => {
                  const pendingTasks = student._count.tasks
                  const upcomingDeadlines = student._count.deadlines

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {student.user.name || student.user.email}
                        </h3>
                        <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                          <span>{pendingTasks} tasks</span>
                          <span>{upcomingDeadlines} deadlines</span>
                          <span>{student._count.essays} essays</span>
                        </div>
                      </div>
                      <Link href={`/students/${student.id}`}>
                        <Button variant="outline">View Profile</Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
