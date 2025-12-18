import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, Calendar, FileText, GraduationCap, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function StudentDashboard() {
  const session = await requireAuth()

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      tasks: {
        take: 5,
        orderBy: { dueDate: "asc" },
        include: {
          creator: {
            select: { name: true, email: true },
          },
        },
      },
      deadlines: {
        take: 5,
        orderBy: { dueDate: "asc" },
      },
      _count: {
        select: {
          fileUploads: true,
          colleges: true,
          essays: true,
        },
      },
    },
  })

  if (!student) {
    return (
      <DashboardLayout>
        <div>Student profile not found</div>
      </DashboardLayout>
    )
  }

  const pendingTasks = student.tasks.filter((t) => t.status !== "COMPLETED").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name || "Student"}!</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <Link href="/student/tasks">
                <Button variant="link" className="p-0">
                  View all tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.deadlines.length}</div>
              <Link href="/student/deadlines">
                <Button variant="link" className="p-0">
                  View all deadlines
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student._count.fileUploads}</div>
              <Link href="/student/documents">
                <Button variant="link" className="p-0">
                  View documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colleges</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student._count.colleges}</div>
              <Link href="/student/colleges">
                <Button variant="link" className="p-0">
                  View college list
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Essays</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student._count.essays}</div>
              <Link href="/student/essays">
                <Button variant="link" className="p-0">
                  View essays
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/student/messages">
                <Button variant="link" className="p-0">
                  Open messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {student.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {student.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          task.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : task.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              {student.deadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deadlines yet</p>
              ) : (
                <div className="space-y-3">
                  {student.deadlines.map((deadline) => (
                    <div key={deadline.id} className="border-b pb-2">
                      <p className="font-medium">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {deadline.type} • {new Date(deadline.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
