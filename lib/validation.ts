// Shared validation utilities
// Used by API routes and components to ensure consistent validation

/**
 * Validates an email address using a standard regex pattern
 * Checks for: non-empty, contains @, has domain part
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.trim())
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * Used when displaying user input or storing in databases
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Sanitizes a string by trimming whitespace and limiting length
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return ''
  return input.trim().slice(0, maxLength)
}
