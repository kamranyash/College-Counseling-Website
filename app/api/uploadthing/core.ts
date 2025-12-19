import { createUploadthing, type FileRouter } from "@uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  fileUploader: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      // File uploaded successfully
      console.log("Upload complete for userId:", metadata?.userId)
      console.log("file url", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
