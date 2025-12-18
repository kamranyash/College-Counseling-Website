"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserRole } from "@prisma/client"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Settings,
  UserPlus,
  BarChart3,
  FileCheck,
} from "lucide-react"

interface SidebarProps {
  role: UserRole
}

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/invites", label: "Invites", icon: UserPlus },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/counselors", label: "Counselors", icon: GraduationCap },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

const studentNavItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/tasks", label: "Tasks", icon: FileCheck },
  { href: "/student/deadlines", label: "Deadlines", icon: Calendar },
  { href: "/student/documents", label: "Documents", icon: FileText },
  { href: "/student/colleges", label: "College List", icon: GraduationCap },
  { href: "/student/essays", label: "Essays", icon: BookOpen },
  { href: "/student/intake", label: "Intake Form", icon: FileText },
  { href: "/student/messages", label: "Messages", icon: MessageSquare },
]

const parentNavItems = [
  { href: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parent/documents", label: "Documents", icon: FileText },
  { href: "/parent/messages", label: "Messages", icon: MessageSquare },
]

const counselorNavItems = [
  { href: "/counselor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/counselor/students", label: "Students", icon: Users },
  { href: "/counselor/messages", label: "Messages", icon: MessageSquare },
]

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  let navItems = []
  switch (role) {
    case UserRole.SUPER_ADMIN:
      navItems = adminNavItems
      break
    case UserRole.STUDENT:
      navItems = studentNavItems
      break
    case UserRole.PARENT:
      navItems = parentNavItems
      break
    case UserRole.COUNSELOR:
      navItems = counselorNavItems
      break
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">College Counseling</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
