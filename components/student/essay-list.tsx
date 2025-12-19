"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { CreateEssayDialog } from "./create-essay-dialog"
import Link from "next/link"

interface Essay {
  id: string
  title: string
  createdAt: Date
  versions: Array<{
    id: string
    versionNumber: number
    createdAt: Date
    author: {
      name: string | null
      email: string
    }
    comments: Array<{
      id: string
      body: string
      isPrivate: boolean
      author: {
        name: string | null
        email: string
      }
    }>
  }>
}

interface EssayListProps {
  essays: Essay[]
  studentId: string
}

export function EssayList({ essays, studentId }: EssayListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateEssayDialog studentId={studentId} onSuccess={() => window.location.reload()} />
      </div>

      {essays.length === 0 ? (
        <p className="text-sm text-muted-foreground">No essays yet</p>
      ) : (
        <div className="space-y-4">
          {essays.map((essay) => {
            const latestVersion = essay.versions[0]
            const sharedComments = latestVersion?.comments.filter((c) => !c.isPrivate) || []

            return (
              <div key={essay.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{essay.title}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {essay.versions.length} version(s) • Last updated{" "}
                      {latestVersion
                        ? format(new Date(latestVersion.createdAt), "MMM d, yyyy")
                        : "Never"}
                    </div>
                    {sharedComments.length > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {sharedComments.length} comment(s) on latest version
                      </div>
                    )}
                  </div>
                  <Link href={`/essays/${studentId}?essayId=${essay.id}`}>
                    <Button variant="outline">View Essay</Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
