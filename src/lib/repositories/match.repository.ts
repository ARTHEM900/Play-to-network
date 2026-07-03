import { SupabaseClient } from '@supabase/supabase-js'

export const MatchRepository = {
  async getMatches(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!team1_id ( id, team_name ),
        team2:teams!team2_id ( id, team_name ),
        tournaments ( name )
      `)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },

  async getLiveMatches(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!team1_id ( id, team_name ),
        team2:teams!team2_id ( id, team_name ),
        tournaments ( name )
      `)
      .eq('status', 'Live')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getUpcomingMatches(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!team1_id ( id, team_name ),
        team2:teams!team2_id ( id, team_name ),
        tournaments ( name )
      `)
      .eq('status', 'Upcoming')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getCompletedMatches(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!team1_id ( id, team_name ),
        team2:teams!team2_id ( id, team_name ),
        tournaments ( name )
      `)
      .eq('status', 'Completed')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getMatchesByTournament(supabase: SupabaseClient, tournamentId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!team1_id ( id, team_name ),
        team2:teams!team2_id ( id, team_name ),
        tournaments ( name )
      `)
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getMatchById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!team1_id ( id, team_name ),
        team2:teams!team2_id ( id, team_name ),
        tournaments ( name )
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createMatch(supabase: SupabaseClient, matchData: any) {
    const { data, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateMatch(supabase: SupabaseClient, id: string, matchData: any) {
    const { data, error } = await supabase
      .from('matches')
      .update(matchData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateScore(supabase: SupabaseClient, id: string, team1Score: number, team2Score: number) {
    const { data, error } = await supabase
      .from('matches')
      .update({ team1_score: team1Score, team2_score: team2Score })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async changeMatchStatus(supabase: SupabaseClient, id: string, status: string, minute?: number) {
    const updateData: any = { status }
    if (typeof minute === 'number') {
      updateData.minute = minute
    }
    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteMatch(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }
}
