import React from 'react'
import { TournamentReminderPayload } from '../types/email.types'

export function getTournamentReminderHtml(data: TournamentReminderPayload): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Tournament Reminder</title>
        <style>
          body { font-family: sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; }
          .highlight { color: #00e676; }
        </style>
      </head>
      <body>
        <h1>Tournament Kickoff Reminder</h1>
        <p>Hi <span>${data.name}</span>,</p>
        <p>This is a quick reminder that <strong class="highlight">${data.tournamentName}</strong> is starting soon!</p>
        <p>Details:</p>
        <ul>
          <li>Date: ${data.date}</li>
          <li>Location: ${data.location}</li>
          <li>Registration ID: ${data.registrationNumber}</li>
        </ul>
      </body>
    </html>
  `
}
