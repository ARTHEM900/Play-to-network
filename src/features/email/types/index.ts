import {
  RegistrationConfirmationPayload,
  RegistrationApprovedPayload,
  RegistrationRejectedPayload,
  TournamentReminderPayload
} from './email.types'

export type RegistrationConfirmationData = RegistrationConfirmationPayload
export type RegistrationApprovedData = RegistrationApprovedPayload
export type RegistrationRejectedData = RegistrationRejectedPayload
export type TournamentReminderData = TournamentReminderPayload

// Re-export new payload interfaces
export * from './email.types'
