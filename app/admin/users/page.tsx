import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAdmin } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminUsersPage() {
  await requireAdmin()

  const users = await prisma.user.findMany({
    include: {
      studentProfile: true,
      parentProfile: true,
      counselorProfile: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-muted-foreground">Manage all user accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users yet</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name || "No name"}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="mt-1 flex gap-2">
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                          {user.role}
                        </span>
                        {user.studentProfile && (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                            Student Profile
                          </span>
                        )}
                        {user.parentProfile && (
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                            Parent Profile
                          </span>
                        )}
                        {user.counselorProfile && (
                          <span className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                            Counselor Profile
                          </span>
                        )}
                      </div>
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
