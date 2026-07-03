export interface RegistrationConfirmationPayload {
  registrationNumber: string
  name: string
  email: string
  type: 'team' | 'individual'
  fee: number
  paymentStatus: string
  tournamentName: string
  date: string
  location: string
}

export interface RegistrationApprovedPayload {
  registrationNumber: string
  name: string
  email: string
  type: 'team' | 'individual'
}

export interface RegistrationRejectedPayload {
  registrationNumber: string
  name: string
  email: string
  reason?: string
}

export interface TournamentReminderPayload {
  registrationNumber: string
  name: string
  email: string
  tournamentName: string
  date: string
  location: string
}
