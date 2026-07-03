'use server'

import { createClient } from '@/lib/supabase/server'
import { EmailService } from '../services/email.service'

/**
 * Server action to trigger the test email.
 * Protected: Checks if the user is authenticated.
 */
export async function triggerTestEmailAction(
  toEmail: string
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Unauthorized. You must be logged in to send a test email.' }
    }

    const result = await EmailService.sendTestEmail(toEmail)
    return result
  } catch (error: any) {
    console.error('Failed to trigger test email server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}
