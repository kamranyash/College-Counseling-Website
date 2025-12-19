import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, GraduationCap, MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ParentDashboard() {
  const session = await requireAuth()

  const parent = await prisma.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      studentLinks: {
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
                  fileUploads: true,
                  colleges: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!parent) {
    return (
      <DashboardLayout>
        <div>Parent profile not found</div>
      </DashboardLayout>
    )
  }

  const student = parent.studentLinks[0]?.student

  if (!student) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
            <p className="text-muted-foreground">No student linked to your account yet.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const pendingTasks = await prisma.task.count({
    where: {
      studentId: student.id,
      status: { not: "COMPLETED" },
    },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Viewing progress for {student.user.name || student.user.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student._count.deadlines}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student._count.fileUploads}</div>
              <Link href={`/parent/documents?studentId=${student.id}`}>
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
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href={`/parent/messages?studentId=${student.id}`}>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href={`/parent/documents?studentId=${student.id}`}>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
