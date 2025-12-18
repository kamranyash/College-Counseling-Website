import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default async function StudentDeadlinesPage() {
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

  const deadlines = await prisma.deadline.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: "asc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Deadlines</h1>
          <p className="text-muted-foreground">View your application deadlines</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {deadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No deadlines yet</p>
            ) : (
              <div className="space-y-4">
                {deadlines.map((deadline) => {
                  const isUpcoming = new Date(deadline.dueDate) > new Date()
                  const daysUntil = Math.ceil(
                    (new Date(deadline.dueDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )

                  return (
                    <div
                      key={deadline.id}
                      className={`rounded-lg border p-4 ${
                        daysUntil <= 7 && isUpcoming ? "border-yellow-200 bg-yellow-50" : ""
                      } ${!isUpcoming ? "border-gray-200 bg-gray-50" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{deadline.title}</h3>
                          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{deadline.type}</span>
                            <span>{format(new Date(deadline.dueDate), "MMM d, yyyy")}</span>
                            {isUpcoming && (
                              <span>
                                {daysUntil === 0
                                  ? "Due today"
                                  : daysUntil === 1
                                  ? "Due tomorrow"
                                  : `${daysUntil} days remaining`}
                              </span>
                            )}
                            {!isUpcoming && <span className="text-red-600">Past deadline</span>}
                          </div>
                          {deadline.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">{deadline.notes}</p>
                          )}
                        </div>
                      </div>
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
