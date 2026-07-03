import React from 'react'
import { RegistrationConfirmationPayload } from '../types/email.types'
import { getEmailLayout } from './layout'

export function getRegistrationConfirmationHtml(data: RegistrationConfirmationPayload): string {
  const typeText = data.type === 'team' ? 'Team Registration' : 'Individual Player Registration'
  const amountText = `₹${data.fee}`

  const content = `
    <h1>Registration Submitted Successfully</h1>
    <p>Hi <span class="highlight">${data.name}</span>,</p>
    <p>Your registration has been submitted successfully.</p>
    <p>Your payment proof has been received.</p>
    <p>Payment verification is currently pending. You will receive another email after verification.</p>
    
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Registration ID</span>
        <span class="info-value">${data.registrationNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tournament</span>
        <span class="info-value">${data.tournamentName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Registration Type</span>
        <span class="info-value">${typeText}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amount Paid</span>
        <span class="info-value">${amountText}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Current Status</span>
        <span class="info-value" style="color: #ffb300; font-weight: bold;">Submitted / Pending Verification</span>
      </div>
    </div>

    <p>You can check your status and view brackets anytime on your player dashboard:</p>
    <div style="text-align: center;">
      <a href="https://playtonetwork.com/dashboard" class="button" target="_blank">View Dashboard</a>
    </div>
  `
  return getEmailLayout('Play To Network Registration Submitted', content)
}
