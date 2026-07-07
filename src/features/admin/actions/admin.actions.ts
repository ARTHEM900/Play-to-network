'use server'

import { createClient } from '@/lib/supabase/server'
import { RegistrationRepository } from '@/lib/repositories/registration.repository'
/**
 * Server action to update registration status and payment status.
 */
export async function updateRegistrationStatusAction(
  registrationId: string,
  newStatus: 'Approved' | 'Pending' | 'Rejected',
  _rejectionReason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const paymentStatus = newStatus === 'Approved'
      ? 'Verified'
      : newStatus === 'Rejected'
      ? 'Failed'
      : 'Pending'

    await RegistrationRepository.updateRegistrationStatus(
      supabase,
      registrationId,
      newStatus,
      paymentStatus
    )

    return { success: true }
  } catch (error: any) {
    console.error('Failed to update registration status in server action:', error)
    return { success: false, error: error.message || String(error) }
  }
}
