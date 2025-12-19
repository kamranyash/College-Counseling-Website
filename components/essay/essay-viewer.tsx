"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { UserRole } from "@prisma/client"
import { CreateEssayVersionDialog } from "./create-essay-version-dialog"

interface EssayViewerProps {
  essay: any
  currentUserId: string
  currentUserRole: UserRole
  canViewPrivateNotes: boolean
}

export function EssayViewer({
  essay,
  currentUserId,
  currentUserRole,
  canViewPrivateNotes,
}: EssayViewerProps) {
  const [selectedVersion, setSelectedVersion] = useState(essay.versions[0]?.id || null)
  const [newComment, setNewComment] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  const selectedVersionData = essay.versions.find((v: any) => v.id === selectedVersion)

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedVersion) return

    setCommentLoading(true)
    try {
      const response = await fetch("/api/essays/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essayVersionId: selectedVersion,
          body: newComment,
          isPrivate: isPrivate && canViewPrivateNotes,
        }),
      })

      if (response.ok) {
        setNewComment("")
        setIsPrivate(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setCommentLoading(false)
    }
  }

  const visibleComments = selectedVersionData?.comments.filter((c: any) =>
    c.isPrivate ? canViewPrivateNotes : true
  )

  return (
    <Tabs defaultValue="latest" className="space-y-4">
      <TabsList>
        <TabsTrigger value="latest">Latest Version</TabsTrigger>
        <TabsTrigger value="history">Version History</TabsTrigger>
      </TabsList>

      <TabsContent value="latest" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Version {selectedVersionData?.versionNumber || "N/A"}</CardTitle>
              <CreateEssayVersionDialog
                essayId={essay.id}
                nextVersionNumber={essay.versions.length + 1}
                onSuccess={() => window.location.reload()}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedVersionData ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Created by {selectedVersionData.author.name || selectedVersionData.author.email}{" "}
                  on {format(new Date(selectedVersionData.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
                {selectedVersionData.content ? (
                  <div className="rounded border bg-gray-50 p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {selectedVersionData.content}
                    </pre>
                  </div>
                ) : selectedVersionData.fileUrl ? (
                  <div>
                    <a
                      href={selectedVersionData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View File: {selectedVersionData.fileUrl}
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No content yet</p>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Comments</h3>
                  {visibleComments && visibleComments.length > 0 ? (
                    <div className="space-y-3">
                      {visibleComments.map((comment: any) => (
                        <div
                          key={comment.id}
                          className={`rounded p-3 ${
                            comment.isPrivate ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
                          }`}
                        >
                          {comment.isPrivate && (
                            <div className="text-xs font-semibold text-yellow-800 mb-1">
                              🔒 Private Note (Counselor/Admin only)
                            </div>
                          )}
                          <div className="text-sm">{comment.body}</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {comment.author.name || comment.author.email} •{" "}
                            {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  )}

                  {(currentUserRole === "COUNSELOR" ||
                    currentUserRole === "SUPER_ADMIN" ||
                    currentUserId === selectedVersionData.author.id) && (
                    <div className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="comment">Add Comment</Label>
                        <Textarea
                          id="comment"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add your comment or feedback..."
                          className="min-h-[100px]"
                        />
                      </div>
                      {canViewPrivateNotes && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="private"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                          />
                          <Label htmlFor="private" className="text-sm">
                            Private note (only visible to counselors/admin)
                          </Label>
                        </div>
                      )}
                      <Button onClick={handleAddComment} disabled={commentLoading || !newComment.trim()}>
                        {commentLoading ? "Adding..." : "Add Comment"}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No versions yet</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            {essay.versions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No versions yet</p>
            ) : (
              <div className="space-y-3">
                {essay.versions.map((version: any) => (
                  <div
                    key={version.id}
                    className={`cursor-pointer rounded border p-3 transition-colors ${
                      selectedVersion === version.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedVersion(version.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Version {version.versionNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {version.author.name || version.author.email} •{" "}
                          {format(new Date(version.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVersion(version.id)
                          document.querySelector('[value="latest"]')?.click()
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
