"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeadlineType } from "@prisma/client"

interface CreateCollegeDialogProps {
  studentId: string
  onSuccess?: () => void
}

export function CreateCollegeDialog({ studentId, onSuccess }: CreateCollegeDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [deadlineType, setDeadlineType] = useState<DeadlineType>(DeadlineType.RD)
  const [deadlineDate, setDeadlineDate] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/student/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          name,
          deadlineType,
          deadlineDate: new Date(deadlineDate).toISOString(),
        }),
      })

      if (response.ok) {
        setOpen(false)
        setName("")
        setDeadlineType(DeadlineType.RD)
        setDeadlineDate("")
        onSuccess?.()
      }
    } catch (error) {
      console.error("Error creating college:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add College</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add College</DialogTitle>
            <DialogDescription>Add a new college to your list</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">College Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlineType">Deadline Type *</Label>
              <Select
                value={deadlineType}
                onValueChange={(value) => setDeadlineType(value as DeadlineType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DeadlineType.ED}>Early Decision (ED)</SelectItem>
                  <SelectItem value={DeadlineType.EA}>Early Action (EA)</SelectItem>
                  <SelectItem value={DeadlineType.REA}>Restrictive Early Action (REA)</SelectItem>
                  <SelectItem value={DeadlineType.RD}>Regular Decision (RD)</SelectItem>
                  <SelectItem value={DeadlineType.ROLLING}>Rolling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlineDate">Deadline Date *</Label>
              <Input
                id="deadlineDate"
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add College"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
