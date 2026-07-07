import { SupabaseClient } from '@supabase/supabase-js'

export interface RegistrationData {
  id?: string
  team_id?: string | null
  tournament_id: string
  registration_number: string
  registration_type: 'team' | 'individual'
  payment_status: 'Pending' | 'Verified' | 'Failed'
  registration_status: 'Pending' | 'Approved' | 'Rejected'
  payment_screenshot_url: string
  user_id: string
  created_at?: string
}

export interface RegistrationExportRow {
  registration_number: string
  registration_type: 'team' | 'individual'
  team_name: string
  captain_name: string
  phone: string
  email: string
  transaction_id: string
  payment_status: string
  registration_status: string
  created_at: string
}

export const RegistrationRepository = {
  async checkExistingRegistration(
    supabase: SupabaseClient,
    userId: string,
    tournamentId: string
  ): Promise<RegistrationData | null> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('tournament_id', tournamentId)
      .maybeSingle()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createRegistration(
    supabase: SupabaseClient, 
    registrationData: RegistrationData
  ): Promise<RegistrationData> {
    const { data, error } = await supabase
      .from('registrations')
      .insert(registrationData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getRegistrations(supabase: SupabaseClient): Promise<RegistrationData[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getRegistrationById(supabase: SupabaseClient, id: string): Promise<RegistrationData | null> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  /**
   * Fetches all registrations joined with their team records for CSV export.
   * Returns normalised rows that map 1-to-1 with the required export columns so
   * the exported data can be verified directly against raw database records.
   */
  async getAllForExport(supabase: SupabaseClient): Promise<RegistrationExportRow[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        registration_number,
        registration_type,
        payment_status,
        registration_status,
        payment_screenshot_url,
        created_at,
        teams (
          team_name,
          captain_name,
          captain_phone,
          captain_email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((r: any) => {
      const team = r.teams ?? null

      return {
        registration_number: r.registration_number ?? '',
        registration_type: r.registration_type ?? 'individual',
        team_name: team?.team_name ?? '',
        captain_name: team?.captain_name ?? '',
        phone: team?.captain_phone ?? '',
        email: team?.captain_email ?? '',
        // The DB stores the payment screenshot URL; derive a transaction ID from it.
        // If no URL is present we fall back to 'N/A'.
        transaction_id: r.payment_screenshot_url
          ? (r.payment_screenshot_url.split('/').pop() ?? 'N/A')
          : 'N/A',
        payment_status: r.payment_status ?? '',
        registration_status: r.registration_status ?? '',
        created_at: r.created_at
          ? new Date(r.created_at).toISOString().split('T')[0]
          : '',
      }
    })
  },

  async updateRegistrationStatus(
    supabase: SupabaseClient,
    id: string,
    status: 'Approved' | 'Pending' | 'Rejected',
    paymentStatus?: 'Pending' | 'Verified' | 'Failed'
  ): Promise<RegistrationData> {
    const updates: any = { registration_status: status }
    if (paymentStatus) {
      updates.payment_status = paymentStatus
    }
    const { data, error } = await supabase
      .from('registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteRegistration(supabase: SupabaseClient, id: string): Promise<RegistrationData> {
    const { data, error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}