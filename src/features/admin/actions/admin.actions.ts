'use server'

import { createClient } from '@/lib/supabase/server'
import { RegistrationRepository } from '@/lib/repositories/registration.repository'
import { TeamRepository } from '@/lib/repositories/team.repository'
import { EmailService } from '@/features/email/services/email.service'

/**
 * Server action to update registration status and payment status, and trigger notification emails.
 */
export async function updateRegistrationStatusAction(
  registrationId: string,
  newStatus: 'Approved' | 'Pending' | 'Rejected',
  rejectionReason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Determine payment status update
    const paymentStatus = newStatus === 'Approved'
      ? 'Verified'
      : newStatus === 'Rejected'
      ? 'Failed'
      : 'Pending'

    // 2. Update database record
    const updatedReg = await RegistrationRepository.updateRegistrationStatus(
      supabase,
      registrationId,
      newStatus,
      paymentStatus
    )

    // 3. Immediately trigger email sending depending on status (Approved / Rejected)
    if (newStatus === 'Approved' || newStatus === 'Rejected') {
      // Run email trigger asynchronously and safely (errors are caught and logged inside)
      // So that database update remains successful even if email fails
      try {
        if (!updatedReg.team_id) {
          throw new Error('No team linked to this registration')
        }

        const team = await TeamRepository.getTeamById(supabase, updatedReg.team_id)
        if (!team) {
          throw new Error('Team details not found')
        }

        let emailResult: { success: boolean; error?: string; id?: string } = { success: false, error: '' }

        if (newStatus === 'Approved') {
          emailResult = await EmailService.sendRegistrationApproved({
            registrationNumber: updatedReg.registration_number,
            name: team.captain_name,
            email: team.captain_email,
            type: updatedReg.registration_type
          })
        } else {
          emailResult = await EmailService.sendRegistrationRejected({
            registrationNumber: updatedReg.registration_number,
            name: team.captain_name,
            email: team.captain_email,
            reason: rejectionReason
          })
        }

        // Update database with the email transmission outcome
        const emailSentStatus = emailResult.success ? 'Sent' : 'Failed'
        await RegistrationRepository.updateEmailSentStatus(supabase, registrationId, emailSentStatus, emailResult.error || null)

        if (!emailResult.success) {
          console.error(`Email sending failed for registration ${registrationId}: ${emailResult.error}`)
        }
      } catch (emailErr: any) {
        console.error(`Exception occurred in email sending flow for registration ${registrationId}:`, emailErr)
        // Log the failure in DB too
        try {
          await RegistrationRepository.updateEmailSentStatus(supabase, registrationId, 'Failed')
        } catch (dbErr) {
          console.error('Failed to write Failed email status to database:', dbErr)
        }
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Failed to update registration status in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}
