import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { RegistrationRepository } from '@/lib/repositories/registration.repository'

const CSV_HEADERS = [
  'Registration Number',
  'Type',
  'Team Name',
  'Captain Name',
  'Phone',
  'Email',
  'Transaction ID',
  'Payment Status',
  'Registration Status',
  'Created At',
] as const

function escapeCSVValue(value: string): string {
  // Wrap every field in double-quotes and escape any embedded double-quotes.
  return `"${String(value).replace(/"/g, '""')}"`
}

export async function GET() {
  try {
    const supabase = await createClient()
    const rows = await RegistrationRepository.getAllForExport(supabase)

    const csvLines: string[] = [
      CSV_HEADERS.join(','),
      ...rows.map((row) =>
        [
          row.registration_number,
          row.registration_type,
          row.team_name,
          row.captain_name,
          row.phone,
          row.email,
          row.transaction_id,
          row.payment_status,
          row.registration_status,
          row.created_at,
        ]
          .map(escapeCSVValue)
          .join(',')
      ),
    ]

    const csvContent = csvLines.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="registrations.csv"',
        // Prevent stale exports from being served from cache.
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[export-csv] Failed to generate CSV export:', err)
    return NextResponse.json(
      { error: 'Failed to generate CSV export. Please try again.' },
      { status: 500 }
    )
  }
}
