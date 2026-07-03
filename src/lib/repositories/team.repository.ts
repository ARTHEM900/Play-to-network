import { SupabaseClient } from '@supabase/supabase-js'

export interface TeamData {
  id?: string
  team_name: string
  captain_name: string
  captain_phone: string
  captain_email: string
  city: string
  college?: string
  instagram?: string
  user_id: string
  created_at?: string
}

export const TeamRepository = {
  async createTeam(supabase: SupabaseClient, teamData: TeamData): Promise<TeamData> {
    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getTeams(supabase: SupabaseClient): Promise<TeamData[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getTeamById(supabase: SupabaseClient, id: string): Promise<TeamData | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }
}