import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAuth } from "@/lib/server-actions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploadList } from "@/components/student/file-upload-list"

export default async function StudentDocumentsPage() {
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

  const files = await prisma.fileUpload.findMany({
    where: { studentId: student.id },
    include: {
      uploadedBy: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your documents</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadList files={files} studentId={student.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
