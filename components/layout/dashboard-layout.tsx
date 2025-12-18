import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "./sidebar"
import { UserNav } from "./user-nav"

export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen">
      <Sidebar role={session.user.role} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            {/* Breadcrumbs or page title can go here */}
          </div>
          <UserNav user={session.user} />
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
