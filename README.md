# College Counseling Platform

A comprehensive full-stack college counseling web application built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- **Role-based Access Control**: Super Admin, Counselor, Student, and Parent roles
- **Invite-only Signup**: Secure invitation system with email codes
- **Authentication**: Google OAuth + Email/Password support
- **Student Dashboard**: Tasks, deadlines, documents, college list, essays, and messaging
- **Counselor Dashboard**: Student management, task assignment, notes (private/shared)
- **Parent Dashboard**: View student progress and communications
- **Admin Panel**: User management, invite creation, analytics
- **Real-time Messaging**: Family group chat threads
- **File Uploads**: Essay, resume, transcript, and other document management
- **Essay Review Workflow**: Version control and commenting system
- **College List Tracker**: Application deadline and status tracking
- **Intake Forms**: Student information collection
- **Email Notifications**: Automated reminders and updates

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **UI**: TailwindCSS + shadcn/ui
- **File Uploads**: UploadThing
- **Email**: Resend
- **Real-time**: Socket.io (to be implemented)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials (for Google sign-in)
- Resend API key (for emails)
- UploadThing account (for file uploads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd college-counseling-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `RESEND_API_KEY`: From Resend dashboard
- `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID`: From UploadThing dashboard

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Seed the database (optional):
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── student/           # Student dashboard pages
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── layout/           # Layout components
│   ├── student/          # Student-specific components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and helpers
├── prisma/                # Prisma schema and migrations
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Role Permissions

- **Super Admin**: Full access to all features and user management
- **Counselor**: Access to assigned students, can create tasks/deadlines, view private notes
- **Student**: Access to own dashboard, tasks, documents, essays, and messages
- **Parent**: View linked student's progress and messages (no private counselor notes)

## Deployment

This application is designed to be deployed on Vercel. Make sure to:

1. Set all environment variables in Vercel dashboard
2. Set up PostgreSQL database (recommended: Vercel Postgres or Supabase)
3. Run migrations: `npx prisma migrate deploy` (or `prisma db push` for initial setup)
4. Configure OAuth redirect URLs in Google Cloud Console

## License

Private project - All rights reserved
