"use client"

import { UploadButton as UploadThingButton } from "@uploadthing/react"
import "@uploadthing/react/styles.css"

interface UploadButtonProps {
  studentId: string
}

export function UploadButton({ studentId }: UploadButtonProps) {
  return (
    <UploadThingButton
      endpoint="fileUploader"
      onClientUploadComplete={(res) => {
        // Call API to save file metadata
        if (res && res.length > 0) {
          fetch("/api/files/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId,
              files: res.map((file) => ({
                name: file.name,
                url: file.url,
                size: file.size,
                category: "OTHER", // Default category, can be updated
              })),
            }),
          }).then(() => {
            window.location.reload()
          })
        }
      }}
      onUploadError={(error: Error) => {
        alert(`Upload failed: ${error.message}`)
      }}
    />
  )
}
