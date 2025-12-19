import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAdmin } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminCounselorsPage() {
  await requireAdmin()

  const counselors = await prisma.counselorProfile.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
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
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">All Counselors</h1>
          <p className="text-muted-foreground">Manage counselor accounts and assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Counselor List ({counselors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {counselors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No counselors yet</p>
            ) : (
              <div className="space-y-4">
                {counselors.map((counselor) => (
                  <div key={counselor.id} className="rounded-lg border p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold">
                        {counselor.user.name || counselor.user.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">{counselor.user.email}</p>
                      {counselor.calendly30Url && (
                        <p className="text-xs text-muted-foreground mt-1">
                          30min: {counselor.calendly30Url}
                        </p>
                      )}
                      {counselor.calendly60Url && (
                        <p className="text-xs text-muted-foreground">
                          60min: {counselor.calendly60Url}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Assigned Students ({counselor.studentAssignments.length}):
                      </p>
                      {counselor.studentAssignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students assigned</p>
                      ) : (
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {counselor.studentAssignments.map((assignment) => (
                            <li key={assignment.id}>
                              {assignment.student.user.name || assignment.student.user.email}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
