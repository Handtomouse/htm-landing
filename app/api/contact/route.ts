import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Rate limiting: Simple in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3 // 3 submissions per hour

// Simple email validation
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Honeypot check (simple spam prevention)
function checkHoneypot(body: any): boolean {
  // If there's a 'website' field (honeypot), reject
  return !body.website
}

// Timestamp check (reject submissions completed in < 2 seconds)
function checkTimestamp(body: any): boolean {
  if (!body.timestamp) return true // Allow if no timestamp
  const submissionTime = Date.now() - body.timestamp
  return submissionTime >= 2000 // Must take at least 2 seconds
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000 / 60) // minutes
    return { allowed: false, retryAfter }
  }

  // Increment count
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
    const body = await request.json()
    const { name, email, subject, message } = body

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

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Please enter a valid name (2-100 characters)' },
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

    // Validate subject
    if (!subject || typeof subject !== 'string' || subject.trim().length < 2 || subject.trim().length > 200) {
      return NextResponse.json(
        { error: 'Please enter a valid subject (2-200 characters)' },
        { status: 400 }
      )
    }

    // Validate message
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a message' },
        { status: 400 }
      )
    }

    const messageLength = message.trim().length
    if (messageLength < 10) {
      return NextResponse.json(
        { error: 'Message is too short (minimum 10 characters)' },
        { status: 400 }
      )
    }

    if (messageLength > 1000) {
      return NextResponse.json(
        { error: 'Message is too long (maximum 1000 characters)' },
        { status: 400 }
      )
    }

    // If Resend API key is configured, send email
    if (resend) {
      try {
        await resend.emails.send({
          from: 'HandToMouse Contact Form <onboarding@resend.dev>',
          to: process.env.NOTIFICATION_EMAIL || 'hello@handtomouse.org',
          replyTo: email,
          subject: `📬 Contact Form: ${subject}`,
          html: `
            <h2>New contact form submission from HandToMouse landing page</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-left: 4px solid #FF9D23;">${message}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">
              <strong>Timestamp:</strong> ${new Date().toISOString()}<br />
              <strong>IP:</strong> ${ip}
            </p>
          `,
        })

        return NextResponse.json(
          { success: true, message: 'Thanks for reaching out! We\'ll get back to you soon.' },
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
      console.log('[CONTACT FORM]', {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        ip,
      })
    }

    return NextResponse.json(
      { success: true, message: 'Thanks for reaching out! We\'ll get back to you soon.' },
      { status: 200 }
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error)
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
