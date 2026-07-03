'use server'

import { createClient } from '@/lib/supabase/server'
import { MatchRepository } from '@/lib/repositories/match.repository'

// Helper to ensure authenticated admin
async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden')
  }
}

export async function createLiveMatchAction(matchData: any) {
  try {
    const supabase = await createClient()
    await checkAdmin(supabase)

    const data = await MatchRepository.createMatch(supabase, matchData)
    return { success: true, data }
  } catch (error: any) {
    console.error('Failed to create match in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}

export async function updateLiveMatchAction(id: string, matchData: any) {
  try {
    const supabase = await createClient()
    await checkAdmin(supabase)

    const data = await MatchRepository.updateMatch(supabase, id, matchData)
    return { success: true, data }
  } catch (error: any) {
    console.error('Failed to update match in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}

export async function deleteLiveMatchAction(id: string) {
  try {
    const supabase = await createClient()
    await checkAdmin(supabase)

    await MatchRepository.deleteMatch(supabase, id)
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete match in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}

export async function updateLiveMatchScoreAction(id: string, team1Score: number, team2Score: number) {
  try {
    const supabase = await createClient()
    await checkAdmin(supabase)

    const data = await MatchRepository.updateScore(supabase, id, team1Score, team2Score)
    return { success: true, data }
  } catch (error: any) {
    console.error('Failed to update match score in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}

export async function changeLiveMatchStatusAction(id: string, status: string, minute?: number) {
  try {
    const supabase = await createClient()
    await checkAdmin(supabase)

    const data = await MatchRepository.changeMatchStatus(supabase, id, status, minute)
    return { success: true, data }
  } catch (error: any) {
    console.error('Failed to change match status in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}
