import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CounselorStudentsPage() {
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
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-muted-foreground">View and manage your assigned students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students assigned yet</p>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {student.user.name || student.user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">{student.user.email}</p>
                    </div>
                    <Link href={`/students/${student.id}`}>
                      <Button>View Full Profile</Button>
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
