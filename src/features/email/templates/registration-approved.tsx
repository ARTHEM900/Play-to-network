import React from 'react'
import { RegistrationApprovedPayload } from '../types/email.types'
import { getEmailLayout } from './layout'

export function getRegistrationApprovedHtml(data: RegistrationApprovedPayload): string {
  const typeText = data.type === 'team' ? 'Team' : 'Individual Player'

  const content = `
    <h1>Registration Approved!</h1>
    <p>Hi <span class="highlight">${data.name}</span>,</p>
    <p>Great news! Your registration for the Play To Network Tournament has been verified and approved.</p>
    
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Registration ID</span>
        <span class="info-value">${data.registrationNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Registration Status</span>
        <span class="info-value" style="color: #00e676; font-weight: bold;">Approved</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Status</span>
        <span class="info-value" style="color: #00e676; font-weight: bold;">Verified</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tournament Details</span>
        <span class="info-value">Mini FIFA World Cup 2026</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reporting Time</span>
        <span class="info-value">30 minutes prior to scheduled kickoff</span>
      </div>
      <div class="info-row">
        <span class="info-label">Venue</span>
        <span class="info-value">Delhi (Near Metro Routes)</span>
      </div>
    </div>

    <p>Check brackets and fixtures on your player dashboard:</p>
    <div style="text-align: center;">
      <a href="https://playtonetwork.com/dashboard" class="button" target="_blank">Go to Player Dashboard</a>
    </div>
  `
  return getEmailLayout('Play To Network Registration Approved', content)
}
