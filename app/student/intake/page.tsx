import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IntakeForm } from "@/components/student/intake-form"

export default async function StudentIntakePage() {
  const session = await requireAuth()

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
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
    return (
      <DashboardLayout>
        <div>Student profile not found</div>
      </DashboardLayout>
    )
  }

  const existingResponse = student.intakeResponses[0]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Intake Form</h1>
          <p className="text-muted-foreground">
            Please fill out this form to help us understand your academic background and goals
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Intake Questionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            {existingResponse && (
              <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
                You previously submitted this form on{" "}
                {new Date(existingResponse.createdAt).toLocaleDateString()}. You can update your
                responses below.
              </div>
            )}
            <IntakeForm studentId={student.id} existingData={existingResponse?.data} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
