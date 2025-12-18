import { UserRole } from "@prisma/client"
import { prisma } from "./prisma"

export interface PermissionContext {
  userId: string
  role: UserRole
}

/**
 * Check if user can access a student's data
 */
export async function canAccessStudent(
  context: PermissionContext,
  studentId: string
): Promise<boolean> {
  if (context.role === UserRole.SUPER_ADMIN) {
    return true
  }

  if (context.role === UserRole.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: context.userId },
    })
    return student?.id === studentId
  }

  if (context.role === UserRole.PARENT) {
    const parent = await prisma.parentProfile.findUnique({
      where: { userId: context.userId },
      include: { studentLinks: true },
    })
    return parent?.studentLinks.some((link) => link.studentId === studentId) ?? false
  }

  if (context.role === UserRole.COUNSELOR) {
    const counselor = await prisma.counselorProfile.findUnique({
      where: { userId: context.userId },
      include: { studentAssignments: true },
    })
    return counselor?.studentAssignments.some((assignment) => assignment.studentId === studentId) ?? false
  }

  return false
}

/**
 * Get all student IDs a user can access
 */
export async function getAccessibleStudentIds(context: PermissionContext): Promise<string[]> {
  if (context.role === UserRole.SUPER_ADMIN) {
    const students = await prisma.studentProfile.findMany({
      select: { id: true },
    })
    return students.map((s) => s.id)
  }

  if (context.role === UserRole.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: context.userId },
      select: { id: true },
    })
    return student ? [student.id] : []
  }

  if (context.role === UserRole.PARENT) {
    const parent = await prisma.parentProfile.findUnique({
      where: { userId: context.userId },
      include: { studentLinks: true },
    })
    return parent?.studentLinks.map((link) => link.studentId) ?? []
  }

  if (context.role === UserRole.COUNSELOR) {
    const counselor = await prisma.counselorProfile.findUnique({
      where: { userId: context.userId },
      include: { studentAssignments: true },
    })
    return counselor?.studentAssignments.map((assignment) => assignment.studentId) ?? []
  }

  return []
}

/**
 * Check if user can see private counselor notes
 */
export function canViewPrivateNotes(context: PermissionContext): boolean {
  return context.role === UserRole.SUPER_ADMIN || context.role === UserRole.COUNSELOR
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN
}

/**
 * Check if user can create invites
 */
export function canCreateInvites(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN
}
