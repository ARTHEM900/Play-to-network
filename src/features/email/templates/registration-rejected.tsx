import React from 'react'
import { RegistrationRejectedPayload } from '../types/email.types'
import { getEmailLayout } from './layout'

export function getRegistrationRejectedHtml(data: RegistrationRejectedPayload): string {
  const reasonText = data.reason || 'Payment screenshot could not be verified or is invalid.'

  const content = `
    <h1>Registration Requires Attention</h1>
    <p>Hi <span class="highlight">${data.name}</span>,</p>
    <p>We are writing to inform you that your registration status has been updated to <strong>Action Required</strong> due to a payment verification issue.</p>
    
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Registration ID</span>
        <span class="info-value">${data.registrationNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reason for Rejection</span>
        <span class="info-value" style="color: #ff3d00; font-weight: bold;">${reasonText}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Status</span>
        <span class="info-value" style="color: #ff3d00; font-weight: bold;">Rejected</span>
      </div>
      <div class="info-row">
        <span class="info-label">Registration Status</span>
        <span class="info-value" style="color: #ff3d00; font-weight: bold;">Action Required</span>
      </div>
    </div>

    <h3>Instructions to upload new payment proof:</h3>
    <ol style="margin-left: 20px; line-height: 1.6;">
      <li>Please log in to your dashboard and re-submit your registration form.</li>
      <li>Ensure that you upload a clear screenshot of the UPI transaction confirmation, showing the Transaction ID/UTR.</li>
    </ol>

    <p>If you have any questions or need support, contact our organizers:</p>
    <ul style="margin-left: 20px; line-height: 1.6; list-style-type: none; padding-left: 0;">
      <li>📞 8766284161 (Pratham Jain)</li>
      <li>📞 9810130848 (Harshit Verma)</li>
      <li>📧 support@playtonetwork.com</li>
    </ul>
  `
  return getEmailLayout('Play To Network Registration Requires Attention', content)
}
