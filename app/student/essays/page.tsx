import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EssayList } from "@/components/student/essay-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function StudentEssaysPage() {
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

  const essays = await prisma.essay.findMany({
    where: { studentId: student.id },
    include: {
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
        orderBy: { versionNumber: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Essays</h1>
            <p className="text-muted-foreground">Manage your essay submissions and reviews</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Essays</CardTitle>
          </CardHeader>
          <CardContent>
            <EssayList essays={essays} studentId={student.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
