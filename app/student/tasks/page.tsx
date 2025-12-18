import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/student/task-list"

export default async function StudentTasksPage() {
  const session = await requireAuth()

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!student) {
    return (
      <DashboardLayout>
        <div>Student profile not found</div>
      </DashboardLayout>
    )
  }

  const tasks = await prisma.task.findMany({
    where: { studentId: student.id },
    include: {
      creator: {
        select: { name: true, email: true },
      },
    },
    orderBy: { dueDate: "asc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">View and manage your tasks</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={tasks} studentId={student.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
