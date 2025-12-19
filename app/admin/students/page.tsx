import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAdmin } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminStudentsPage() {
  await requireAdmin()

  const students = await prisma.studentProfile.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      _count: {
        select: {
          tasks: true,
          colleges: true,
          essays: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">All Students</h1>
          <p className="text-muted-foreground">Manage all student accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student List ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students yet</p>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {student.user.name || student.user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">{student.user.email}</p>
                      <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                        <span>{student._count.tasks} tasks</span>
                        <span>{student._count.colleges} colleges</span>
                        <span>{student._count.essays} essays</span>
                      </div>
                    </div>
                    <Link href={`/students/${student.id}`}>
                      <Button variant="outline">View Profile</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
