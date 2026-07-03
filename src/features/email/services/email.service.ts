import { Resend } from 'resend'
import {
  RegistrationConfirmationPayload,
  RegistrationApprovedPayload,
  RegistrationRejectedPayload,
  TournamentReminderPayload
} from '../types/email.types'
import {
  getRegistrationConfirmationHtml,
  getRegistrationApprovedHtml,
  getRegistrationRejectedHtml,
  getTournamentReminderHtml
} from '../templates'

export interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[EMAIL] WARNING: RESEND_API_KEY is not defined. Email service will run in mock mode.')
    } else {
      console.log(`[EMAIL] Initializing Resend client with API key prefix: ${apiKey.substring(0, 8)}...`)
    }
    resendClient = new Resend(apiKey || '')
  }
  return resendClient
}

const CONFIGURED_FROM_EMAIL = process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || process.env.NEXT_PUBLIC_DEFAULT_FROM_EMAIL || 'Play To Network <onboarding@resend.dev>'

const VERIFIED_FROM_EMAIL = process.env.RESEND_VERIFIED_FROM_EMAIL || 'Play To Network <onboarding@resend.dev>'

const AUDIT_LOG_PREFIX = '[EMAIL]'

function logSendAttempt(method: string, from: string, to: string, subject: string, extra?: Record<string, unknown>): void {
  const payload = {
    method,
    from,
    to,
    subject,
    apiKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 8) + '...' : 'MISSING',
    ...extra,
  }
  console.log(`${AUDIT_LOG_PREFIX} SEND ATTEMPT:`, JSON.stringify(payload, null, 2))
}

function logFullResponse(method: string, response: any): void {
  console.log(`${AUDIT_LOG_PREFIX} FULL RESPONSE [${method}]:`, JSON.stringify(response, null, 2))
}

function extractStatusCode(error: any): number | null {
  return error?.statusCode ?? null
}

function buildErrorString(error: any): string {
  const code = extractStatusCode(error)
  const msg = error?.message || 'No message'
  return code ? `Resend API error (${code}): ${msg}` : `Resend API error: ${msg}`
}

async function attemptSend(
  resend: Resend,
  from: string,
  to: string,
  subject: string,
  html: string,
  method: string
): Promise<{ data?: { id: string }; error?: any }> {
  logSendAttempt(method, from, to, subject, { attemptFrom: from })
  const response = await resend.emails.send({ from, to, subject, html })
  logFullResponse(method, response)
  return response
}

function isForbiddenError(error: any): boolean {
  return extractStatusCode(error) === 403
}

export const EmailService = {
  async sendRegistrationSubmittedEmail(data: RegistrationConfirmationPayload): Promise<EmailResult> {
    const METHOD = 'sendRegistrationSubmittedEmail'
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: RESEND_API_KEY not set — mock mode.`)
        console.log(`${AUDIT_LOG_PREFIX} ${METHOD} Response: MOCK (no API key)`)
        return { success: false, error: 'RESEND_API_KEY is not configured.' }
      }

      const resend = getResendClient()
      const html = getRegistrationConfirmationHtml(data)

      let fromAddress = CONFIGURED_FROM_EMAIL

      let response = await attemptSend(resend, fromAddress, data.email, 'Registration Submitted – Mini FIFA World Cup 2026', html, METHOD)

      if (response.error) {
        if (isForbiddenError(response.error)) {
          console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: 403 from sender "${fromAddress}" — falling back to verified sender "${VERIFIED_FROM_EMAIL}"`)
          fromAddress = VERIFIED_FROM_EMAIL
          response = await attemptSend(resend, fromAddress, data.email, 'Registration Submitted – Mini FIFA World Cup 2026', html, METHOD)
        }

        if (response.error) {
          console.error(`${AUDIT_LOG_PREFIX} ${METHOD} FAILED:`, buildErrorString(response.error))
          return { success: false, error: buildErrorString(response.error) }
        }
      }

      console.log(`${AUDIT_LOG_PREFIX} ${METHOD} SUCCESS: ID=${response.data?.id}, sender=${fromAddress}, to=${data.email}`)
      return { success: true, id: response.data?.id }
    } catch (error: any) {
      console.error(`${AUDIT_LOG_PREFIX} ${METHOD} EXCEPTION:`, error)
      if (error instanceof Error) {
        console.error(`${AUDIT_LOG_PREFIX} ${METHOD} exception details:`, JSON.stringify({ message: error.message, name: error.name, stack: error.stack }, null, 2))
      }
      return { success: false, error: error.message || String(error) }
    }
  },

  async sendTestEmail(toEmail: string): Promise<EmailResult> {
    const METHOD = 'sendTestEmail'
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        console.info(`${AUDIT_LOG_PREFIX} ${METHOD} MOCK: Sending Test Email to ${toEmail}`)
        return { success: true, id: 'mock_test_id_' + Date.now() }
      }

      const resend = getResendClient()
      const html = '<p>This is a test email from Play To Network.</p>'

      let fromAddress = CONFIGURED_FROM_EMAIL
      let response = await attemptSend(resend, fromAddress, toEmail, 'Play To Network Test Email', html, METHOD)

      if (response.error) {
        if (isForbiddenError(response.error)) {
          console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: 403 from sender "${fromAddress}" — falling back to verified sender "${VERIFIED_FROM_EMAIL}"`)
          fromAddress = VERIFIED_FROM_EMAIL
          response = await attemptSend(resend, fromAddress, toEmail, 'Play To Network Test Email', html, METHOD)
        }

        if (response.error) {
          console.error(`${AUDIT_LOG_PREFIX} ${METHOD} FAILED:`, buildErrorString(response.error))
          return { success: false, error: buildErrorString(response.error) }
        }
      }

      console.info(`${AUDIT_LOG_PREFIX} ${METHOD} SUCCESS: ID=${response.data?.id}, sender=${fromAddress}, to=${toEmail}`)
      return { success: true, id: response.data?.id }
    } catch (error: any) {
      console.error(`${AUDIT_LOG_PREFIX} ${METHOD} EXCEPTION:`, error)
      return { success: false, error: error.message || String(error) }
    }
  },

  async sendRegistrationConfirmation(data: RegistrationConfirmationPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    const METHOD = 'sendRegistrationConfirmation'
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        console.info(`${AUDIT_LOG_PREFIX} ${METHOD} MOCK: Sending Registration Confirmation to ${data.email}`)
        return { success: true, id: 'mock_confirm_id_' + Date.now() }
      }

      const resend = getResendClient()
      const html = getRegistrationConfirmationHtml(data)

      let fromAddress = CONFIGURED_FROM_EMAIL
      let response = await attemptSend(resend, fromAddress, data.email, 'Registration Submitted – Mini FIFA World Cup 2026', html, METHOD)

      if (response.error) {
        if (isForbiddenError(response.error)) {
          console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: 403 from sender "${fromAddress}" — falling back to verified sender "${VERIFIED_FROM_EMAIL}"`)
          fromAddress = VERIFIED_FROM_EMAIL
          response = await attemptSend(resend, fromAddress, data.email, 'Registration Submitted – Mini FIFA World Cup 2026', html, METHOD)
        }

        if (response.error) {
          console.error(`${AUDIT_LOG_PREFIX} ${METHOD} FAILED:`, buildErrorString(response.error))
          return { success: false, error: buildErrorString(response.error) }
        }
      }

      console.info(`${AUDIT_LOG_PREFIX} ${METHOD} SUCCESS: ID=${response.data?.id}, sender=${fromAddress}, to=${data.email}`)
      return { success: true, id: response.data?.id }
    } catch (error: any) {
      console.error(`${AUDIT_LOG_PREFIX} ${METHOD} EXCEPTION:`, error)
      return { success: false, error: error.message || String(error) }
    }
  },

  async sendRegistrationApproved(data: RegistrationApprovedPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    const METHOD = 'sendRegistrationApproved'
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        console.info(`${AUDIT_LOG_PREFIX} ${METHOD} MOCK: Sending Registration Approved to ${data.email}`)
        return { success: true, id: 'mock_approve_id_' + Date.now() }
      }

      const resend = getResendClient()
      const html = getRegistrationApprovedHtml(data)

      let fromAddress = CONFIGURED_FROM_EMAIL
      let response = await attemptSend(resend, fromAddress, data.email, 'Registration Approved – Mini FIFA World Cup 2026', html, METHOD)

      if (response.error) {
        if (isForbiddenError(response.error)) {
          console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: 403 from sender "${fromAddress}" — falling back to verified sender "${VERIFIED_FROM_EMAIL}"`)
          fromAddress = VERIFIED_FROM_EMAIL
          response = await attemptSend(resend, fromAddress, data.email, 'Registration Approved – Mini FIFA World Cup 2026', html, METHOD)
        }

        if (response.error) {
          console.error(`${AUDIT_LOG_PREFIX} ${METHOD} FAILED:`, buildErrorString(response.error))
          return { success: false, error: buildErrorString(response.error) }
        }
      }

      console.info(`${AUDIT_LOG_PREFIX} ${METHOD} SUCCESS: ID=${response.data?.id}, sender=${fromAddress}, to=${data.email}`)
      return { success: true, id: response.data?.id }
    } catch (error: any) {
      console.error(`${AUDIT_LOG_PREFIX} ${METHOD} EXCEPTION:`, error)
      return { success: false, error: error.message || String(error) }
    }
  },

  async sendRegistrationRejected(data: RegistrationRejectedPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    const METHOD = 'sendRegistrationRejected'
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        console.info(`${AUDIT_LOG_PREFIX} ${METHOD} MOCK: Sending Registration Rejected to ${data.email}`)
        return { success: true, id: 'mock_reject_id_' + Date.now() }
      }

      const resend = getResendClient()
      const html = getRegistrationRejectedHtml(data)

      let fromAddress = CONFIGURED_FROM_EMAIL
      let response = await attemptSend(resend, fromAddress, data.email, 'Registration Requires Attention', html, METHOD)

      if (response.error) {
        if (isForbiddenError(response.error)) {
          console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: 403 from sender "${fromAddress}" — falling back to verified sender "${VERIFIED_FROM_EMAIL}"`)
          fromAddress = VERIFIED_FROM_EMAIL
          response = await attemptSend(resend, fromAddress, data.email, 'Registration Requires Attention', html, METHOD)
        }

        if (response.error) {
          console.error(`${AUDIT_LOG_PREFIX} ${METHOD} FAILED:`, buildErrorString(response.error))
          return { success: false, error: buildErrorString(response.error) }
        }
      }

      console.info(`${AUDIT_LOG_PREFIX} ${METHOD} SUCCESS: ID=${response.data?.id}, sender=${fromAddress}, to=${data.email}`)
      return { success: true, id: response.data?.id }
    } catch (error: any) {
      console.error(`${AUDIT_LOG_PREFIX} ${METHOD} EXCEPTION:`, error)
      return { success: false, error: error.message || String(error) }
    }
  },

  async sendTournamentReminder(data: TournamentReminderPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    const METHOD = 'sendTournamentReminder'
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (!apiKey) {
        console.info(`${AUDIT_LOG_PREFIX} ${METHOD} MOCK: Sending Tournament Reminder to ${data.email}`)
        return { success: true, id: 'mock_reminder_id_' + Date.now() }
      }

      const resend = getResendClient()
      const html = getTournamentReminderHtml(data)

      let fromAddress = CONFIGURED_FROM_EMAIL
      let response = await attemptSend(resend, fromAddress, data.email, `Reminder: ${data.tournamentName} - Spot Locked!`, html, METHOD)

      if (response.error) {
        if (isForbiddenError(response.error)) {
          console.warn(`${AUDIT_LOG_PREFIX} ${METHOD}: 403 from sender "${fromAddress}" — falling back to verified sender "${VERIFIED_FROM_EMAIL}"`)
          fromAddress = VERIFIED_FROM_EMAIL
          response = await attemptSend(resend, fromAddress, data.email, `Reminder: ${data.tournamentName} - Spot Locked!`, html, METHOD)
        }

        if (response.error) {
          console.error(`${AUDIT_LOG_PREFIX} ${METHOD} FAILED:`, buildErrorString(response.error))
          return { success: false, error: buildErrorString(response.error) }
        }
      }

      console.info(`${AUDIT_LOG_PREFIX} ${METHOD} SUCCESS: ID=${response.data?.id}, sender=${fromAddress}, to=${data.email}`)
      return { success: true, id: response.data?.id }
    } catch (error: any) {
      console.error(`${AUDIT_LOG_PREFIX} ${METHOD} EXCEPTION:`, error)
      return { success: false, error: error.message || String(error) }
    }
  }
}
