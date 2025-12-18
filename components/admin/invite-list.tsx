"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"

interface Invite {
  id: string
  code: string
  email: string
  role: string
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
  createdBy: {
    name: string | null
    email: string
  }
}

export function InviteList() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvites()
  }, [])

  const fetchInvites = async () => {
    try {
      const response = await fetch("/api/admin/invites")
      const data = await response.json()
      setInvites(data)
    } catch (error) {
      console.error("Error fetching invites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invite?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/invites/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchInvites()
      }
    } catch (error) {
      console.error("Error deleting invite:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (invites.length === 0) {
    return <div className="text-sm text-muted-foreground">No invites yet</div>
  }

  return (
    <div className="space-y-2">
      {invites.map((invite) => {
        const isExpired = new Date(invite.expiresAt) < new Date()
        const isUsed = invite.usedAt !== null

        return (
          <div
            key={invite.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{invite.code}</span>
                {isUsed && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    Used
                  </span>
                )}
                {isExpired && !isUsed && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                    Expired
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{invite.email}</div>
              <div className="text-xs text-muted-foreground">
                Role: {invite.role} • Expires: {format(new Date(invite.expiresAt), "MMM d, yyyy")}
              </div>
            </div>
            {!isUsed && (
              <button
                onClick={() => handleDelete(invite.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
