import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { validateEnv } from '@/lib/env'
import { isValidEmail, escapeHtml } from '@/lib/validation'

// Validate environment on module load
validateEnv()

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Request body interface
interface SubscribeFormData {
  email: string
  website?: string // Honeypot field
  timestamp?: number // Bot detection
}

// Rate limiting: Simple in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // 5 subscriptions per hour

// Honeypot check (simple spam prevention)
function checkHoneypot(body: SubscribeFormData): boolean {
  return !body.website
}

// Timestamp check (reject submissions completed in < 2 seconds)
function checkTimestamp(body: SubscribeFormData): boolean {
  if (!body.timestamp) return true
  const submissionTime = Date.now() - body.timestamp
  return submissionTime >= 2000
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000 / 60)
    return { allowed: false, retryAfter }
  }

  record.count++
  return { allowed: true }
}

// Get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIp || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SubscribeFormData
    const { email } = body

    // Honeypot check
    if (!checkHoneypot(body)) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      )
    }

    // Timestamp check (bot prevention)
    if (!checkTimestamp(body)) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      )
    }

    // Rate limiting
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${rateLimit.retryAfter} minutes.` },
        { status: 429 }
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
        await resend.emails.send({
          from: 'HandToMouse Landing <onboarding@resend.dev>',
          to: process.env.NOTIFICATION_EMAIL || 'hello@handtomouse.org',
          subject: '🎯 New Landing Page Signup',
          html: `
            <h2>New subscriber from HandToMouse landing page</h2>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
          `,
        })

        return NextResponse.json(
          { success: true, message: 'Subscribed successfully!' },
          { status: 200 }
        )
      } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Resend error:', error)
        }
      }
    }

    // Fallback: Simple logging (if Resend not configured)
    if (process.env.NODE_ENV === 'development') {
      console.log('[EMAIL SIGNUP]', {
        email,
        timestamp: new Date().toISOString(),
      })
    }

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
