import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { validateEnv } from '@/lib/env'

// Validate environment on module load
validateEnv()

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Simple email validation
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// HTML escape to prevent XSS in email
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Honeypot check (simple spam prevention)
function checkHoneypot(body: any): boolean {
  // If there's a 'website' field (honeypot), reject
  return !body.website
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Honeypot check
    if (!checkHoneypot(body)) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      )
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // If Resend API key is configured, add to audience
    if (resend) {
      try {
        // Option 1: Send to yourself as notification
        await resend.emails.send({
          from: 'HandToMouse Landing <onboarding@resend.dev>',
          to: process.env.NOTIFICATION_EMAIL || 'hello@handtomouse.org',
          subject: '🎯 New Landing Page Signup',
          html: `
            <h2>New subscriber from HandToMouse landing page</h2>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          `,
        })

        // Option 2: Add to Resend Audience (if you have one set up)
        // Uncomment and configure if you want to use Resend Audiences
        /*
        await resend.contacts.create({
          email,
          audienceId: process.env.RESEND_AUDIENCE_ID!,
        })
        */

        return NextResponse.json(
          { success: true, message: 'Subscribed successfully!' },
          { status: 200 }
        )
      } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Resend error:', error)
        }
        // Fall through to simple logging if Resend fails
      }
    }

    // Fallback: Simple logging (if Resend not configured)
    if (process.env.NODE_ENV === 'development') {
      console.log('[EMAIL SIGNUP]', {
        email,
        timestamp: new Date().toISOString(),
      })
    }

    // TODO: In production, you might want to:
    // - Store in Vercel KV/Postgres
    // - Add to Mailchimp list
    // - Send to Google Sheets
    // - etc.

    return NextResponse.json(
      { success: true, message: 'Thanks for subscribing!' },
      { status: 200 }
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Subscription error:', error)
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
