'use server'

import { createClient } from '@/lib/supabase/server'
import { RegistrationRepository } from '@/lib/repositories/registration.repository'
import { TeamRepository } from '@/lib/repositories/team.repository'
import { TournamentRepository } from '@/lib/repositories/tournament.repository'
import { EmailService } from '../services/email.service'

/**
 * Server action to manually resend an email for a registration.
 */
export async function resendEmailAction(
  registrationId: string,
  emailType: 'confirmation' | 'approved' | 'rejected'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Fetch registration details
    const reg = await RegistrationRepository.getRegistrationById(supabase, registrationId)
    if (!reg) {
      return { success: false, error: 'Registration not found' }
    }

    if (!reg.team_id) {
      return { success: false, error: 'No team linked to this registration' }
    }

    // 2. Fetch team details
    const team = await TeamRepository.getTeamById(supabase, reg.team_id)
    if (!team) {
      return { success: false, error: 'Team details not found' }
    }

    let emailResult: { success: boolean; error?: string } = { success: false }

    // 3. Trigger correct email template based on type
    if (emailType === 'confirmation') {
      let tournamentName = 'PTN 3v3 Mini Football Tournament'
      let tournamentDate = 'Sunday, July 12th'
      let tournamentLocation = 'Hyperdrive Arena'
      try {
        const tourney = await TournamentRepository.getTournamentById(supabase, reg.tournament_id)
        if (tourney) {
          tournamentName = tourney.title || tournamentName
          tournamentDate = tourney.start_date || tournamentDate
          tournamentLocation = tourney.location || tournamentLocation
        }
      } catch (err) {
        console.error('Failed to fetch tournament info for resend email payload:', err)
      }

      const fee = reg.registration_type === 'team' ? 1800 : 600
      emailResult = await EmailService.sendRegistrationConfirmation({
        registrationNumber: reg.registration_number,
        name: team.captain_name,
        email: team.captain_email,
        type: reg.registration_type,
        fee,
        paymentStatus: reg.payment_status,
        tournamentName,
        date: tournamentDate,
        location: tournamentLocation
      })
    } else if (emailType === 'approved') {
      emailResult = await EmailService.sendRegistrationApproved({
        registrationNumber: reg.registration_number,
        name: team.captain_name,
        email: team.captain_email,
        type: reg.registration_type,
      })
    } else if (emailType === 'rejected') {
      emailResult = await EmailService.sendRegistrationRejected({
        registrationNumber: reg.registration_number,
        name: team.captain_name,
        email: team.captain_email,
      })
    }

    // 4. Update the email status and error message in the database
    const emailStatus = emailResult.success ? 'Sent' : 'Failed'
    await RegistrationRepository.updateEmailSentStatus(supabase, registrationId, emailStatus, emailResult.error || null)

    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Failed to send email' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in resendEmailAction:', error)
    return { success: false, error: error.message || String(error) }
  }
}
