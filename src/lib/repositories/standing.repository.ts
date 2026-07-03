import { SupabaseClient } from '@supabase/supabase-js'

export const StandingRepository = {
  async getStandings(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('points', { ascending: false })
    if (error) throw error
    return data
  },

  async getStandingsByTournament(supabase: SupabaseClient, tournamentId: string) {
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('points', { ascending: false })
    if (error) throw error
    return data
  }
}
