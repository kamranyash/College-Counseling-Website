import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPageContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">College Counseling Platform</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              College Counseling Platform
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A comprehensive platform for managing college applications, essays, deadlines, and
              counselor-student collaboration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/login">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>For Students</CardTitle>
                <CardDescription>
                  Track your applications, manage deadlines, get essay feedback, and stay organized.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>For Counselors</CardTitle>
                <CardDescription>
                  Manage multiple students, assign tasks, provide feedback, and track progress.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>For Parents</CardTitle>
                <CardDescription>
                  Stay informed about your student's progress and communicate with counselors.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-12 text-center text-sm text-muted-foreground">
          <p>© 2024 College Counseling Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
