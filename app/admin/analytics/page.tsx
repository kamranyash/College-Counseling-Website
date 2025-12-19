import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAdmin } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, FileCheck, Calendar, DollarSign } from "lucide-react"
import { subDays, startOfWeek } from "date-fns"

export default async function AdminAnalyticsPage() {
  await requireAdmin()

  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekAgo = subDays(now, 7)

  const [
    totalStudents,
    totalCounselors,
    totalTasks,
    completedTasksThisWeek,
    createdTasksThisWeek,
    upcomingDeadlines,
    totalSessionsBooked,
    revenue,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.counselorProfile.count(),
    prisma.task.count(),
    prisma.task.count({
      where: {
        status: "COMPLETED",
        updatedAt: { gte: weekStart },
      },
    }),
    prisma.task.count({
      where: {
        createdAt: { gte: weekStart },
      },
    }),
    prisma.deadline.count({
      where: {
        dueDate: { gte: now },
      },
    }),
    // Placeholder for sessions booked (Calendly integration would track this)
    Promise.resolve(0),
    // Placeholder for revenue (payments not implemented yet)
    Promise.resolve(0),
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform statistics and metrics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Counselors</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCounselors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {createdTasksThisWeek} created this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed (Week)</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasksThisWeek}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingDeadlines}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Booked</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessionsBooked}</div>
              <p className="text-xs text-muted-foreground">
                Placeholder - Calendly integration needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Placeholder - Payments not implemented</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
