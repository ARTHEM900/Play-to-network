import { SupabaseClient } from '@supabase/supabase-js'

export interface PlayerData {
  id?: string
  player_name: string
  team_id?: string | null
  user_id: string
  created_at?: string
}

export const PlayerRepository = {
  async createPlayer(supabase: SupabaseClient, playerData: PlayerData): Promise<PlayerData> {
    const { data, error } = await supabase
      .from('players')
      .insert(playerData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getPlayers(supabase: SupabaseClient): Promise<PlayerData[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getPlayerById(supabase: SupabaseClient, id: string): Promise<PlayerData | null> {
    const { data, error } = await supabase
      .from('players')
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