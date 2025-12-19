import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CollegeList } from "@/components/student/college-list"

export default async function StudentCollegesPage() {
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

  const colleges = await prisma.college.findMany({
    where: { studentId: student.id },
    orderBy: { deadlineDate: "asc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">College List</h1>
          <p className="text-muted-foreground">Track your college applications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <CollegeList colleges={colleges} studentId={student.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
