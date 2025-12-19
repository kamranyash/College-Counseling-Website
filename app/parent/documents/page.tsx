import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { FileCategory } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ParentDocumentsPage({
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
              user: {
                select: { name: true, email: true },
              },
              fileUploads: {
                include: {
                  uploadedBy: {
                    select: { name: true, email: true },
                  },
                },
                orderBy: { createdAt: "desc" },
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
  const files = student.fileUploads

  const categoryLabels: Record<FileCategory, string> = {
    ESSAY: "Essay",
    RESUME: "Resume",
    TRANSCRIPT: "Transcript",
    OTHER: "Other",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            View documents for {student.user.name || student.user.email}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Documents ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{file.name}</h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                          {categoryLabels[file.category]}
                        </span>
                        <span>
                          Uploaded by {file.uploadedBy.name || file.uploadedBy.email} on{" "}
                          {format(new Date(file.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={file.url} target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <a href={file.url} download>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </a>
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
