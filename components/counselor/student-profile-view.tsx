"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { TaskStatus, UserRole } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "./create-task-dialog"
import { CreateDeadlineDialog } from "./create-deadline-dialog"
import Link from "next/link"

interface StudentProfileViewProps {
  student: any
  currentUserRole: UserRole
}

export function StudentProfileView({ student, currentUserRole }: StudentProfileViewProps) {
  const canCreateTasks = currentUserRole === "SUPER_ADMIN" || currentUserRole === "COUNSELOR"
  const canViewPrivateNotes = currentUserRole === "SUPER_ADMIN" || currentUserRole === "COUNSELOR"

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
        <TabsTrigger value="colleges">Colleges</TabsTrigger>
        <TabsTrigger value="essays">Essays</TabsTrigger>
        <TabsTrigger value="intake">Intake Form</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.tasks.length}</div>
              <p className="text-sm text-muted-foreground">
                {student.tasks.filter((t: any) => t.status !== "COMPLETED").length} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.deadlines.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Colleges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.colleges.length}</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          {canCreateTasks && <CreateTaskDialog studentId={student.id} />}
        </div>
        <Card>
          <CardContent className="pt-6">
            {student.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            ) : (
              <div className="space-y-4">
                {student.tasks.map((task: any) => (
                  <div key={task.id} className="border-b pb-4 last:border-0">
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
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          task.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : task.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="deadlines" className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Deadlines</CardTitle>
          {canCreateTasks && <CreateDeadlineDialog studentId={student.id} />}
        </div>
        <Card>
          <CardContent className="pt-6">
            {student.deadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No deadlines yet</p>
            ) : (
              <div className="space-y-4">
                {student.deadlines.map((deadline: any) => (
                  <div key={deadline.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-semibold">{deadline.title}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{deadline.type}</span>
                      <span>{format(new Date(deadline.dueDate), "MMM d, yyyy")}</span>
                    </div>
                    {deadline.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{deadline.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="colleges" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>College List</CardTitle>
          </CardHeader>
          <CardContent>
            {student.colleges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No colleges added yet</p>
            ) : (
              <div className="space-y-4">
                {student.colleges.map((college: any) => (
                  <div key={college.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-semibold">{college.name}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{college.deadlineType}</span>
                      <span>{format(new Date(college.deadlineDate), "MMM d, yyyy")}</span>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          college.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : college.status === "DENIED"
                            ? "bg-red-100 text-red-800"
                            : college.status === "WAITLISTED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {college.status}
                      </span>
                    </div>
                    {college.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{college.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="essays" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Essays</CardTitle>
          </CardHeader>
          <CardContent>
            {student.essays.length === 0 ? (
              <p className="text-sm text-muted-foreground">No essays yet</p>
            ) : (
              <div className="space-y-4">
                {student.essays.map((essay: any) => (
                  <div key={essay.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{essay.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {essay.versions.length} version(s)
                        </p>
                      </div>
                      <Link href={`/essays/${student.id}?essayId=${essay.id}`}>
                        <Button variant="outline">View Essay</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="intake" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Intake Form</CardTitle>
          </CardHeader>
          <CardContent>
            {student.intakeResponses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No intake form submitted yet
              </p>
            ) : (
              <div className="space-y-4">
                {student.intakeResponses.map((response: any) => (
                  <div key={response.id} className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Submitted by: {response.user.name || response.user.email}
                    </div>
                    <pre className="rounded bg-gray-50 p-4 text-sm">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                    {response.reviewed && (
                      <div className="text-sm text-green-600">✓ Reviewed</div>
                    )}
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
