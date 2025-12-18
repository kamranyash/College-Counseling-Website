"use client"

import { signOut } from "next-auth/react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserNavProps {
  user: {
    name?: string | null
    email: string
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || user.email}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name || "User"}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
      >
        Sign out
      </Button>
    </div>
  )
}
