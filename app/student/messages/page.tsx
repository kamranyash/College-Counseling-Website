import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat/chat-interface"

export default async function StudentMessagesPage() {
  const session = await requireAuth()

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
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
          participants: {
            include: {
              user: {
                select: { name: true, email: true, image: true, role: true },
              },
            },
          },
        },
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
          <p className="text-muted-foreground">Communicate with your counselor and family</p>
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
