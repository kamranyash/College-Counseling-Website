"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CollegeStatus, DeadlineType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateCollegeDialog } from "./create-college-dialog"
import { Textarea } from "@/components/ui/textarea"

interface College {
  id: string
  name: string
  deadlineType: DeadlineType
  deadlineDate: Date
  status: CollegeStatus
  notes: string | null
}

interface CollegeListProps {
  colleges: College[]
  studentId: string
}

export function CollegeList({ colleges: initialColleges, studentId }: CollegeListProps) {
  const [colleges, setColleges] = useState(initialColleges)

  const handleStatusChange = async (collegeId: string, newStatus: CollegeStatus) => {
    try {
      const response = await fetch(`/api/student/colleges/${collegeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setColleges((prev) =>
          prev.map((c) => (c.id === collegeId ? { ...c, status: newStatus } : c))
        )
      }
    } catch (error) {
      console.error("Error updating college status:", error)
    }
  }

  const handleNotesUpdate = async (collegeId: string, notes: string) => {
    try {
      const response = await fetch(`/api/student/colleges/${collegeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })

      if (response.ok) {
        setColleges((prev) =>
          prev.map((c) => (c.id === collegeId ? { ...c, notes } : c))
        )
      }
    } catch (error) {
      console.error("Error updating college notes:", error)
    }
  }

  const statusLabels: Record<CollegeStatus, string> = {
    RESEARCHING: "Researching",
    APPLYING: "Applying",
    SUBMITTED: "Submitted",
    ACCEPTED: "Accepted",
    DENIED: "Denied",
    WAITLISTED: "Waitlisted",
  }

  const typeLabels: Record<DeadlineType, string> = {
    ED: "Early Decision",
    EA: "Early Action",
    REA: "Restrictive Early Action",
    RD: "Regular Decision",
    ROLLING: "Rolling",
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateCollegeDialog studentId={studentId} onSuccess={() => window.location.reload()} />
      </div>

      {colleges.length === 0 ? (
        <p className="text-sm text-muted-foreground">No colleges added yet</p>
      ) : (
        <div className="space-y-4">
          {colleges.map((college) => (
            <div key={college.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{college.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{typeLabels[college.deadlineType]}</span>
                    <span>Deadline: {format(new Date(college.deadlineDate), "MMM d, yyyy")}</span>
                  </div>
                  {college.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">{college.notes}</p>
                  )}
                  <div className="mt-3">
                    <Textarea
                      placeholder="Add notes..."
                      defaultValue={college.notes || ""}
                      onBlur={(e) => handleNotesUpdate(college.id, e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
                <Select
                  value={college.status}
                  onValueChange={(value) => handleStatusChange(college.id, value as CollegeStatus)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
