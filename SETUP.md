# Setup Instructions

## Quick Start Guide

### 1. Install Dependencies ✅
Already done! Dependencies are installed.

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database - You need a PostgreSQL database URL
# For local development, you can use:
# - Local PostgreSQL: postgresql://user:password@localhost:5432/college_counseling
# - Supabase (free): Get connection string from supabase.com
# - Neon (free): Get connection string from neon.tech
DATABASE_URL="postgresql://user:password@localhost:5432/college_counseling?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional for now - can skip if you only want email/password)
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# UploadThing (Optional for now - needed for file uploads)
# Get from: https://uploadthing.com
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Resend (Optional for now - needed for emails)
# Get from: https://resend.com
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Node Environment
NODE_ENV="development"
```

**Minimum required for local development:**
- `DATABASE_URL` - PostgreSQL database connection string
- `NEXTAUTH_URL` - http://localhost:3000
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

### 3. Set Up Database

Run Prisma migrations to create the database schema:

```bash
npx prisma db push
```

This will create all the tables in your database.

### 4. (Optional) Seed the Database

Run the seed script to create sample data:

```bash
npm run db:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The website will be available at: **http://localhost:3000**

## Getting a Database

### Option 1: Local PostgreSQL
- Install PostgreSQL on your Mac: `brew install postgresql@14`
- Start it: `brew services start postgresql@14`
- Create database: `createdb college_counseling`
- Use: `DATABASE_URL="postgresql://localhost:5432/college_counseling"`

### Option 2: Supabase (Free, Recommended for Quick Start)
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string (use the URI format)
6. Replace `[YOUR-PASSWORD]` with your database password

### Option 3: Neon (Free)
1. Go to https://neon.tech
2. Sign up for free
3. Create a new project
4. Copy the connection string

## First Login

After setting up the database and running the seed script, you can log in with:
- **Super Admin**: Created by the seed script
- **Email/Password**: As configured in seed script

Or create your first admin user manually through the database/seed script.

