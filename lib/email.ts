import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail(
  email: string,
  inviteCode: string,
  role: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
      to: email,
      subject: `Invitation to College Counseling Platform`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>You've been invited!</h1>
          <p>You've been invited to join the College Counseling Platform as a <strong>${role}</strong>.</p>
          <p>Your invitation code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${inviteCode}
          </div>
          <p>Please use this code when signing up. This code will expire in 14 days.</p>
          <p><a href="${process.env.NEXTAUTH_URL}/auth/signup?code=${inviteCode}" style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Sign Up Now</a></p>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export async function sendNotificationEmail(
  email: string,
  subject: string,
  html: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
      to: email,
      subject,
      html,
    })

    if (error) {
      console.error("Error sending notification email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending notification email:", error)
    return { success: false, error }
  }
}

// Log notification attempts to database
export async function logNotification(
  type: string,
  email: string,
  success: boolean,
  error?: string,
  userId?: string,
  metadata?: any
) {
  const { prisma } = await import("./prisma")
  
  try {
    await prisma.notificationLog.create({
      data: {
        type,
        email,
        success,
        error,
        userId: userId || null,
        metadata: metadata || null,
      },
    })
  } catch (err) {
    console.error("Error logging notification:", err)
  }
}
