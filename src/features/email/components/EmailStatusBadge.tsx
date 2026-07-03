import React from 'react'

interface EmailStatusBadgeProps {
  status: 'Pending' | 'Sent' | 'Failed' | string
}

export function EmailStatusBadge({ status }: EmailStatusBadgeProps) {
  const normalizedStatus = status || 'Pending'
  
  let classes = 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  if (normalizedStatus === 'Sent') {
    classes = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  } else if (normalizedStatus === 'Failed') {
    classes = 'bg-red-500/10 text-red-400 border border-red-500/20'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        normalizedStatus === 'Sent' ? 'bg-emerald-400 animate-pulse' : normalizedStatus === 'Failed' ? 'bg-red-400' : 'bg-amber-400'
      }`} />
      {normalizedStatus}
    </span>
  )
}
