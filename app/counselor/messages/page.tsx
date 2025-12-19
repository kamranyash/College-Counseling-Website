import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CounselorMessagesPage() {
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
              chatThread: {
                include: {
                  messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                  },
                },
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">View messages from your students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {counselor.studentAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students assigned yet</p>
            ) : (
              <div className="space-y-3">
                {counselor.studentAssignments.map((assignment) => {
                  const student = assignment.student
                  const lastMessage = student.chatThread?.messages[0]

                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {student.user.name || student.user.email}
                        </h3>
                        {lastMessage && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {lastMessage.body}
                          </p>
                        )}
                      </div>
                      {student.chatThread && (
                        <Link href={`/chat/${student.chatThread.id}`}>
                          <Button variant="outline">Open Chat</Button>
                        </Link>
                      )}
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
