'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, Mail, Settings, RefreshCw } from 'lucide-react'
import {
  getRegistrationConfirmationHtml,
  getRegistrationApprovedHtml,
  getRegistrationRejectedHtml,
  getTournamentReminderHtml,
  getFixtureReleasedHtml,
} from '../templates'

type TemplateType = 'confirmation' | 'approved' | 'rejected' | 'reminder' | 'fixture'

export function EmailTemplatePreview() {
  const [template, setTemplate] = useState<TemplateType>('confirmation')
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  
  // States for dummy data input
  const [name, setName] = useState('Sarah Connor')
  const [email, setEmail] = useState('sarah@resistance.net')
  const [regNumber, setRegNumber] = useState('PTN-3V3-TEM-558291')
  const [fee, setFee] = useState(1800)
  const [type, setType] = useState<'team' | 'individual'>('team')
  const [reason, setReason] = useState('The uploaded payment proof could not be verified in the bank ledger.')
  const [tournamentName, setTournamentName] = useState('Play To Network 3v3 Mini Football Open')
  const [date, setDate] = useState('Sunday, July 12th at 4:00 PM')
  const [location, setLocation] = useState('Hyperdrive Arena, Turf 2')
  const [opponentName, setOpponentName] = useState('Liquid Football FC')
  const [matchTime] = useState('4:30 PM')
  const [pitchName, setPitchName] = useState('Court A (Main Arena)')

  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    let html = ''
    if (template === 'confirmation') {
      html = getRegistrationConfirmationHtml({
        registrationNumber: regNumber,
        name,
        email,
        type,
        fee,
        paymentScreenshotUrl: 'https://example.com/receipt.png'
      })
    } else if (template === 'approved') {
      html = getRegistrationApprovedHtml({
        registrationNumber: regNumber,
        name,
        email,
        type
      })
    } else if (template === 'rejected') {
      html = getRegistrationRejectedHtml({
        registrationNumber: regNumber,
        name,
        email,
        reason
      })
    } else if (template === 'reminder') {
      html = getTournamentReminderHtml({
        registrationNumber: regNumber,
        name,
        email,
        tournamentName,
        date,
        location
      })
    } else if (template === 'fixture') {
      html = getFixtureReleasedHtml({
        registrationNumber: regNumber,
        name,
        email,
        tournamentName,
        opponentName,
        matchTime,
        pitchName
      })
    }
    setHtmlContent(html)
  }, [
    template, name, email, regNumber, fee, type, reason, 
    tournamentName, date, location, opponentName, matchTime, pitchName
  ])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0a0a0a] text-white p-6 rounded-2xl border border-white/5 shadow-2xl">
      {/* Configuration Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-6 bg-[#050505] p-5 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <Settings className="size-4 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Email Preview Controls</h3>
        </div>

        {/* Template selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Template Type</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as TemplateType)}
            className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="confirmation">Registration Confirmation</option>
            <option value="approved">Registration Approved</option>
            <option value="rejected">Registration Rejected</option>
            <option value="reminder">Tournament Kickoff Reminder</option>
            <option value="fixture">Fixture Released Notice</option>
          </select>
        </div>

        {/* Dynamic Fields Editor */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Template Variables</span>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/60">Recipient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/60">Reg Number</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/60">Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Conditional Input Sections based on Selected Template */}
          {template === 'confirmation' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/60">Fee Amount</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/60">Reg Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'team' | 'individual')}
                  className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="team">Team</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>
          )}

          {template === 'approved' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/60">Reg Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'team' | 'individual')}
                className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="team">Team</option>
                <option value="individual">Individual</option>
              </select>
            </div>
          )}

          {template === 'rejected' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/60">Rejection Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          )}

          {(template === 'reminder' || template === 'fixture') && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/60">Tournament Name</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              {template === 'reminder' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/60">Kickoff Date</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/60">Kickoff Venue</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/60">Opponent Team</label>
                      <input
                        type="text"
                        value={opponentName}
                        onChange={(e) => setOpponentName(e.target.value)}
                        className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/60">Pitch Name</label>
                      <input
                        type="text"
                        value={pitchName}
                        onChange={(e) => setPitchName(e.target.value)}
                        className="bg-[#111] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/5 text-[11px] text-white/40 flex items-center gap-1.5 justify-center">
          <RefreshCw className="size-3 text-emerald-500/60 animate-spin" />
          <span>Real-time renderer active</span>
        </div>
      </div>

      {/* Live Preview Display */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-emerald-400" />
            <span className="text-sm font-bold uppercase tracking-wider">Live Viewport</span>
          </div>

          <div className="flex items-center gap-2 bg-[#050505] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded transition-all ${
                viewport === 'desktop'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Desktop Viewport"
            >
              <Monitor className="size-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded transition-all ${
                viewport === 'mobile'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Mobile Viewport"
            >
              <Smartphone className="size-4" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="flex-1 flex justify-center items-start bg-black/40 rounded-xl border border-white/5 p-4 overflow-hidden min-h-[500px]">
          <div
            className="transition-all duration-300 rounded-lg overflow-hidden border border-white/10 shadow-2xl h-[550px] bg-[#050505]"
            style={{ width: viewport === 'desktop' ? '100%' : '375px', maxWidth: '600px' }}
          >
            {htmlContent ? (
              <iframe
                title="Email Template Live Preview"
                srcDoc={htmlContent}
                className="w-full h-full border-none bg-[#050505]"
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/40 text-xs">
                Generating HTML preview...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
