export { getRegistrationConfirmationHtml } from './registration-confirmation'
export { getRegistrationApprovedHtml } from './registration-approved'
export { getRegistrationRejectedHtml } from './registration-rejected'
export { getTournamentReminderHtml } from './tournament-reminder'

export function getFixtureReleasedHtml(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Fixture Released</h1>
        <p>Match schedule vs ${data.opponentName || 'opponent'} released.</p>
      </body>
    </html>
  `
}
