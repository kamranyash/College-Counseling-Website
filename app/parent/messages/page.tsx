import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat/chat-interface"
import { redirect } from "next/navigation"

export default async function ParentMessagesPage({
  searchParams,
}: {
  searchParams: { studentId?: string }
}) {
  const session = await requireAuth()

  const parent = await prisma.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      studentLinks: {
        include: {
          student: {
            include: {
              chatThread: {
                include: {
                  messages: {
                    include: {
                      author: {
                        select: { id: true, name: true, email: true, image: true },
                      },
                    },
                    orderBy: { createdAt: "asc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!parent || parent.studentLinks.length === 0) {
    return (
      <DashboardLayout>
        <Card className="p-6">
          <p>No student linked to your account.</p>
        </Card>
      </DashboardLayout>
    )
  }

  const student = parent.studentLinks[0].student

  if (!student.chatThread) {
    return (
      <DashboardLayout>
        <Card className="p-6">
          <p>No chat thread found. Please contact support.</p>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate about {student.user?.name || student.user?.email || "your student"}
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <ChatInterface
              threadId={student.chatThread.id}
              currentUserId={session.user.id}
              messages={student.chatThread.messages}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
