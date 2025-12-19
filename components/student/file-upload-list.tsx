"use client"

import { format } from "date-fns"
import { FileCategory } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/components/uploadthing-button"
import Link from "next/link"

interface FileUpload {
  id: string
  name: string
  url: string
  category: FileCategory
  createdAt: Date
  uploadedBy: {
    name: string | null
    email: string
  }
}

interface FileUploadListProps {
  files: FileUpload[]
  studentId: string
}

export function FileUploadList({ files, studentId }: FileUploadListProps) {
  const categoryLabels: Record<FileCategory, string> = {
    ESSAY: "Essay",
    RESUME: "Resume",
    TRANSCRIPT: "Transcript",
    OTHER: "Other",
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <UploadButton studentId={studentId} />
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between rounded-lg border p-4">
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
    </div>
  )
}
