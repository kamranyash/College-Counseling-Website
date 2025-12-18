"use client"

import { useState } from "react"
import { format } from "date-fns"
import { TaskStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: Date
  status: TaskStatus
  createdAt: Date
  creator: {
    name: string | null
    email: string
  }
}

interface TaskListProps {
  tasks: Task[]
  studentId: string
}

export function TaskList({ tasks, studentId }: TaskListProps) {
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>(
    tasks.reduce((acc, task) => {
      acc[task.id] = task.status
      return acc
    }, {} as Record<string, TaskStatus>)
  )

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`/api/student/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: newStatus }))
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks yet</p>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const status = taskStatuses[task.id] || task.status
        const isOverdue = new Date(task.dueDate) < new Date() && status !== "COMPLETED"

        return (
          <div
            key={task.id}
            className={`rounded-lg border p-4 ${
              isOverdue ? "border-red-200 bg-red-50" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                  <span>From: {task.creator.name || task.creator.email}</span>
                </div>
              </div>
              <Select
                value={status}
                onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={TaskStatus.OVERDUE}>Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      })}
    </div>
  )
}
