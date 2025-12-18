import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireAdmin } from "@/lib/server-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InviteList } from "@/components/admin/invite-list"
import { CreateInviteForm } from "@/components/admin/create-invite-form"

export default async function AdminInvitesPage() {
  await requireAdmin()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Invites</h1>
          <p className="text-muted-foreground">Create and manage invitation codes</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Invite</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateInviteForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <InviteList />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
