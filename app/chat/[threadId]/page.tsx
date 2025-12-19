import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat/chat-interface"
import { notFound } from "next/navigation"

export default async function ChatPage({ params }: { params: { threadId: string } }) {
  const session = await requireAuth()

  // Verify user is a participant
  const participant = await prisma.chatThreadParticipant.findFirst({
    where: {
      threadId: params.threadId,
      userId: session.user.id,
    },
    include: {
      thread: {
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
  })

  if (!participant) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <ChatInterface
              threadId={params.threadId}
              currentUserId={session.user.id}
              messages={participant.thread.messages}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
