import { SupabaseClient } from '@supabase/supabase-js'

export interface ProfileData {
  id: string
  full_name: string | null
  phone: string | null
  city: string | null
  avatar_url: string | null
  role?: string
  updated_at?: string
  created_at?: string
}

export const ProfileRepository = {
  async getProfileById(supabase: SupabaseClient, id: string): Promise<ProfileData | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  async upsertProfile(supabase: SupabaseClient, profile: ProfileData): Promise<ProfileData> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
