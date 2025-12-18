"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRole } from "@prisma/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CreateInviteForm() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT)
  const [studentId, setStudentId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          studentId: studentId || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create invite")
        return
      }

      setSuccess(`Invite sent to ${email}`)
      setEmail("")
      setStudentId("")
      // Refresh the invite list
      window.location.reload()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
            <SelectItem value={UserRole.PARENT}>Parent</SelectItem>
            <SelectItem value={UserRole.COUNSELOR}>Counselor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(role === UserRole.PARENT || role === UserRole.COUNSELOR) && (
        <div className="space-y-2">
          <Label htmlFor="studentId">
            Student ID {role === UserRole.PARENT ? "(Link Parent)" : "(Assign Counselor)"}
          </Label>
          <Input
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Optional: Student profile ID"
            disabled={loading}
          />
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Invite"}
      </Button>
    </form>
  )
}
