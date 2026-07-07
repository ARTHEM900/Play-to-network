'use server'

import { createClient } from '@/lib/supabase/server'
import { TeamRepository } from '@/lib/repositories/team.repository'
import { PlayerRepository } from '@/lib/repositories/player.repository'
import { RegistrationRepository } from '@/lib/repositories/registration.repository'


export interface RegisterActionInput {
  regType: 'team' | 'individual'
  paymentScreenshotUrl: string
  teamForm?: {
    teamName: string
    captainName: string
    captainPhone: string
    player1: string
    player2: string
    player3: string
    player4: string
    city: string
    preferredNation?: string
  }
  indForm?: {
    fullName: string
    phone: string
    position: string
    city: string
  }
}

export async function registerPlayerAction(
  input: RegisterActionInput
): Promise<{ success: boolean; registrationNumber?: string; error?: string; warning?: string }> {
  console.log('[REGISTER] Registration Started')
  try {
    const supabase = await createClient()
    const { regType, paymentScreenshotUrl, teamForm, indForm } = input

    // 0. Require authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[REGISTER] Auth error:', authError)
      return { success: false, error: 'You must be logged in to register. Please sign in and try again.' }
    }
    const userId = user.id

    // 0b. Check for existing registration (backend protection)
    const TOURNAMENT_ID = process.env.NEXT_PUBLIC_TOURNAMENT_ID || '8681b997-c81b-4395-89f4-2792e3be75e5'
    const { data: existingReg } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('tournament_id', TOURNAMENT_ID)
      .maybeSingle()

    if (existingReg) {
      return { success: false, error: 'You are already registered for this tournament.' }
    }

    // 1. Validate Input
    const name = regType === 'team' ? teamForm?.teamName : indForm?.fullName
    const phone = regType === 'team' ? teamForm?.captainPhone : indForm?.phone
    // Fall back to authenticated user email (no longer collected from the form)
    const email = user.email || ''

    if (!name || !name.trim()) {
      return { success: false, error: 'Please enter a valid Name.' }
    }

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phone || !phone.trim() || !phoneRegex.test(phone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' }
    }

    if (!paymentScreenshotUrl) {
      return { success: false, error: 'Payment screenshot is required.' }
    }

    // 2. Generate unique registration number
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const code = regType === 'team' ? 'TEM' : 'IND'
    const registrationNumber = `PTN-3V3-${code}-${randomNum}`

    let teamId: string | null = null

    // 3. Create database records (Store registration)
    console.log('[REGISTER] Registration Saved — creating database records')
    if (regType === 'team' && teamForm) {
      // Server-side validation
      if (!teamForm.preferredNation) {
        return { success: false, error: 'Preferred Football Nation is required.' }
      }
      if (
        !teamForm.captainName || !teamForm.captainName.trim() ||
        !teamForm.player1 || !teamForm.player1.trim() ||
        !teamForm.player2 || !teamForm.player2.trim() ||
        !teamForm.player3 || !teamForm.player3.trim() ||
        !teamForm.player4 || !teamForm.player4.trim()
      ) {
        return { success: false, error: 'All 5 players are required to complete registration.' }
      }

      // Duplicate player name check
      const allNames = [
        teamForm.captainName.trim().toLowerCase(),
        teamForm.player1.trim().toLowerCase(),
        teamForm.player2.trim().toLowerCase(),
        teamForm.player3.trim().toLowerCase(),
        teamForm.player4.trim().toLowerCase()
      ]
      if (new Set(allNames).size !== allNames.length) {
        return { success: false, error: 'All player names must be unique. Please check for duplicate entries.' }
      }

      // Duplicate team name check
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('team_name', `${teamForm.teamName} (${teamForm.preferredNation})`)
        .maybeSingle()

      if (existingTeam) {
        return { success: false, error: 'A team with this name is already registered. Please choose a different team name.' }
      }

      // Create team record
      console.log('[REGISTER] Step: Creating team record')
      const team = await TeamRepository.createTeam(supabase, {
        team_name: `${teamForm.teamName} (${teamForm.preferredNation})`,
        captain_name: teamForm.captainName,
        captain_phone: teamForm.captainPhone,
        captain_email: email,
        city: teamForm.city,
        user_id: userId
      })
      teamId = team.id || null

      // Create player records for all roster members
      const playersToCreate = [
        teamForm.captainName,
        teamForm.player1,
        teamForm.player2,
        teamForm.player3,
        teamForm.player4
      ].filter(Boolean)

      console.log(`[REGISTER] Step: Creating ${playersToCreate.length} player records (batched)`)
      const { error: playersError } = await supabase
        .from('players')
        .insert(playersToCreate.map(pName => ({
          player_name: pName,
          team_id: teamId,
          user_id: userId
        })))
      if (playersError) throw playersError
    } else if (regType === 'individual' && indForm) {
      // Create solo team record
      const team = await TeamRepository.createTeam(supabase, {
        team_name: indForm.fullName,
        captain_name: indForm.fullName,
        captain_phone: indForm.phone,
        captain_email: email,
        city: indForm.city,
        user_id: userId
      })
      teamId = team.id || null

      // Create player record
      await PlayerRepository.createPlayer(supabase, {
        player_name: indForm.fullName,
        team_id: teamId,
        user_id: userId
      })
    } else {
      return { success: false, error: 'Invalid registration forms provided.' }
    }

    if (!teamId) {
      return { success: false, error: 'Failed to create team record.' }
    }

    // Create registration record
    console.log('[REGISTER] Step: Creating registration record')
    const regData = await RegistrationRepository.createRegistration(supabase, {
      team_id: teamId,
      tournament_id: TOURNAMENT_ID,
      registration_number: registrationNumber,
      registration_type: regType,
      payment_status: 'Pending',
      registration_status: 'Pending',
      payment_screenshot_url: paymentScreenshotUrl,
      user_id: userId
    })
    console.log('[REGISTER] Registration Saved — database transaction complete')

    return {
      success: true,
      registrationNumber
    }
  } catch (error: any) {
    console.error('[REGISTER] Registration flow failed in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}
