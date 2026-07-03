import { createBrowserClient } from '@supabase/ssr'

// Reusable browser client instance (singleton)
let client: ReturnType<typeof createBrowserClient> | null = null

/**
 * Creates or retrieves the reusable Supabase browser client.
 * Using a singleton pattern on the client-side prevents creating multiple
 * client instances during the application lifecycle.
 */
export function createClient() {
  // If we are in a non-browser environment (SSR/RSC/etc.), create a new client per request.
  if (typeof window === 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      throw new Error(
        'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.'
      )
    }
    return createBrowserClient(url, anonKey)
  }

  // On the browser, reuse the existing client instance if it exists.
  if (client) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.'
    )
  }

  client = createBrowserClient(url, anonKey)
  return client
}

/**
 * Interface representing the result of the connection verification query.
 */
export interface VerificationResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Verifies the connection to Supabase by performing a test query.
 * It attempts to fetch a single row/id from the 'tournaments' table.
 * If the query completes without a network error (even if the table is empty),
 * the connection is verified successfully.
 */
export async function verifyConnection(): Promise<VerificationResult> {
  const supabase = createClient()
  try {
    const { error } = await supabase
      .from('tournaments')
      .select('id')
      .limit(1)

    if (error) {
      // If table doesn't exist, we still successfully connected to the Supabase API
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Successfully connected to Supabase (Table "tournaments" does not exist yet).',
        }
      }
      return {
        success: false,
        message: 'Supabase returned an error during connection verification.',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase and verified database connection.',
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to connect to Supabase.',
      error: err.message || String(err),
    }
  }
}
