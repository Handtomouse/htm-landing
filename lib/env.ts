// Environment variable validation
// This runs at build time to catch missing required variables early

const requiredEnvVars = [
  // No required env vars - all are optional
  // RESEND_API_KEY is optional (falls back to logging)
  // NOTIFICATION_EMAIL is optional (has default)
] as const

const optionalEnvVars = [
  'RESEND_API_KEY',
  'NOTIFICATION_EMAIL',
  'NODE_ENV',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n` +
      `Please add them to your .env.local file.`
    )
  }

  // Log optional env vars status in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📋 Environment configuration:')
    for (const envVar of optionalEnvVars) {
      const status = process.env[envVar] ? '✓' : '✗'
      console.log(`  ${status} ${envVar}`)
    }
  }
}
