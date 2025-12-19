import { PrismaClient, UserRole, TaskStatus, DeadlineType, CollegeStatus, FileCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean up existing data (optional - comment out if you want to keep existing data)
  // await prisma.notificationLog.deleteMany()
  // await prisma.essayComment.deleteMany()
  // await prisma.essayVersion.deleteMany()
  // await prisma.essay.deleteMany()
  // await prisma.college.deleteMany()
  // await prisma.intakeResponse.deleteMany()
  // await prisma.chatMessage.deleteMany()
  // await prisma.chatThreadParticipant.deleteMany()
  // await prisma.chatThread.deleteMany()
  // await prisma.fileUpload.deleteMany()
  // await prisma.deadline.deleteMany()
  // await prisma.task.deleteMany()
  // await prisma.studentCounselorAssignment.deleteMany()
  // await prisma.parentStudentLink.deleteMany()
  // await prisma.invite.deleteMany()
  // await prisma.counselorProfile.deleteMany()
  // await prisma.parentProfile.deleteMany()
  // await prisma.studentProfile.deleteMany()
  // await prisma.account.deleteMany()
  // await prisma.session.deleteMany()
  // await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Super Admin
  console.log('Creating Super Admin...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  })

  // Create Counselor
  console.log('Creating Counselor...')
  const counselor = await prisma.user.create({
    data: {
      email: 'counselor@example.com',
      name: 'John Counselor',
      password: hashedPassword,
      role: UserRole.COUNSELOR,
      emailVerified: new Date(),
      counselorProfile: {
        create: {
          calendly30Url: 'https://calendly.com/counselor/30min',
          calendly60Url: 'https://calendly.com/counselor/60min',
        },
      },
    },
    include: { counselorProfile: true },
  })

  // Create Student
  console.log('Creating Student...')
  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      name: 'Jane Student',
      password: hashedPassword,
      role: UserRole.STUDENT,
      emailVerified: new Date(),
      studentProfile: {
        create: {},
      },
    },
    include: { studentProfile: true },
  })

  // Create Parent
  console.log('Creating Parent...')
  const parent = await prisma.user.create({
    data: {
      email: 'parent@example.com',
      name: 'Jane Parent',
      password: hashedPassword,
      role: UserRole.PARENT,
      emailVerified: new Date(),
      parentProfile: {
        create: {},
      },
    },
    include: { parentProfile: true },
  })

  // Link parent to student
  if (student.studentProfile && parent.parentProfile) {
    await prisma.parentStudentLink.create({
      data: {
        parentId: parent.parentProfile.id,
        studentId: student.studentProfile.id,
      },
    })

    // Create chat thread for student
    const chatThread = await prisma.chatThread.create({
      data: {
        studentId: student.studentProfile.id,
      },
    })

    // Add participants to chat thread
    await prisma.chatThreadParticipant.createMany({
      data: [
        { threadId: chatThread.id, userId: student.id },
        { threadId: chatThread.id, userId: parent.id },
        { threadId: chatThread.id, userId: counselor.id },
        { threadId: chatThread.id, userId: admin.id },
      ],
    })

    // Add sample messages
    await prisma.chatMessage.createMany({
      data: [
        {
          threadId: chatThread.id,
          authorId: counselor.id,
          body: 'Welcome! I\'m looking forward to working with you on your college applications.',
        },
        {
          threadId: chatThread.id,
          authorId: student.id,
          body: 'Thank you! I\'m excited to get started.',
        },
      ],
    })

    // Assign counselor to student
    if (counselor.counselorProfile) {
      await prisma.studentCounselorAssignment.create({
        data: {
          studentId: student.studentProfile.id,
          counselorId: counselor.counselorProfile.id,
        },
      })
    }

    // Create sample tasks
    console.log('Creating sample tasks...')
    await prisma.task.createMany({
      data: [
        {
          studentId: student.studentProfile.id,
          createdById: counselor.id,
          title: 'Complete Intake Form',
          description: 'Fill out the initial intake questionnaire with your academic history and interests.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          status: TaskStatus.PENDING,
        },
        {
          studentId: student.studentProfile.id,
          createdById: counselor.id,
          title: 'Draft Personal Statement',
          description: 'Write the first draft of your personal statement essay.',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          status: TaskStatus.IN_PROGRESS,
        },
        {
          studentId: student.studentProfile.id,
          createdById: counselor.id,
          title: 'Request Transcript',
          description: 'Request official transcripts from your high school.',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          status: TaskStatus.PENDING,
        },
      ],
    })

    // Create sample deadlines
    console.log('Creating sample deadlines...')
    await prisma.deadline.createMany({
      data: [
        {
          studentId: student.studentProfile.id,
          title: 'Early Decision Deadline - MIT',
          type: DeadlineType.ED,
          dueDate: new Date('2024-11-01'),
          notes: 'Application must be submitted by 11:59 PM EST',
        },
        {
          studentId: student.studentProfile.id,
          title: 'Early Action Deadline - Stanford',
          type: DeadlineType.EA,
          dueDate: new Date('2024-11-01'),
        },
        {
          studentId: student.studentProfile.id,
          title: 'Regular Decision Deadline - Harvard',
          type: DeadlineType.RD,
          dueDate: new Date('2025-01-01'),
        },
      ],
    })

    // Create sample colleges
    console.log('Creating sample colleges...')
    await prisma.college.createMany({
      data: [
        {
          studentId: student.studentProfile.id,
          name: 'Massachusetts Institute of Technology',
          deadlineType: DeadlineType.ED,
          deadlineDate: new Date('2024-11-01'),
          status: CollegeStatus.APPLYING,
          notes: 'Dream school - strong engineering programs',
        },
        {
          studentId: student.studentProfile.id,
          name: 'Stanford University',
          deadlineType: DeadlineType.EA,
          deadlineDate: new Date('2024-11-01'),
          status: CollegeStatus.RESEARCHING,
          notes: 'Interested in computer science program',
        },
        {
          studentId: student.studentProfile.id,
          name: 'Harvard University',
          deadlineType: DeadlineType.RD,
          deadlineDate: new Date('2025-01-01'),
          status: CollegeStatus.RESEARCHING,
        },
      ],
    })

    // Create sample essay with versions
    console.log('Creating sample essay...')
    const essay = await prisma.essay.create({
      data: {
        studentId: student.studentProfile.id,
        title: 'Personal Statement',
      },
    })

    const essayVersion1 = await prisma.essayVersion.create({
      data: {
        essayId: essay.id,
        versionNumber: 1,
        authorId: student.id,
        content: 'This is the first draft of my personal statement. I want to write about my passion for computer science and how it started...',
      },
    })

    const essayVersion2 = await prisma.essayVersion.create({
      data: {
        essayId: essay.id,
        versionNumber: 2,
        authorId: student.id,
        content: 'This is the revised version. I\'ve incorporated feedback and expanded on my experiences...',
      },
    })

    // Create comments on essay versions
    await prisma.essayComment.createMany({
      data: [
        {
          essayVersionId: essayVersion1.id,
          authorId: counselor.id,
          body: 'Great start! Consider adding more specific examples of your projects.',
          isPrivate: false,
        },
        {
          essayVersionId: essayVersion1.id,
          authorId: counselor.id,
          body: 'Note to self: Student shows strong technical skills but needs to highlight leadership.',
          isPrivate: true,
        },
        {
          essayVersionId: essayVersion2.id,
          authorId: counselor.id,
          body: 'Much better! The examples really strengthen your narrative.',
          isPrivate: false,
        },
      ],
    })
  }

  console.log('✅ Seed completed!')
  console.log('\n📝 Login Credentials:')
  console.log('Super Admin: admin@example.com / password123')
  console.log('Counselor: counselor@example.com / password123')
  console.log('Student: student@example.com / password123')
  console.log('Parent: parent@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
