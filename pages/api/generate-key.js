// pages/api/generate-key.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'FREE_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.query

  if (!token) {
    return res.status(400).json({ error: 'Token required' })
  }

  try {
    // Validasi token kedua dari tabel generate_tokens
    const { data: tokenData, error: fetchError } = await supabase
      .from('generate_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (fetchError || !tokenData) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    // Cek expiry
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Token expired' })
    }

    // Mark token as used
    await supabase
      .from('generate_tokens')
      .update({ used: true })
      .eq('id', tokenData.id)

    // Generate license key
    const key = generateKey()
    
    // FIX: Gunakan milliseconds untuk presisi UTC yang tepat
    const keyExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // +24 jam dalam milliseconds

    console.log('=== GENERATE-KEY DEBUG ===')
    console.log('Key generated:', key)
    console.log('Current time (UTC):', new Date().toISOString())
    console.log('Expires at (UTC):', keyExpiresAt.toISOString())
    console.log('Expires at (Local):', keyExpiresAt.toString())
    console.log('Valid duration (hours):', 24)

    // Simpan ke tabel keys
    const { error: insertError } = await supabase
      .from('keys')
      .insert([{
        license_key: key,
        user_id: tokenData.id,
        expires_at: keyExpiresAt.toISOString(),
        used: false
      }])

    if (insertError) {
      console.error('Insert key error:', insertError)
      return res.status(500).json({ error: 'Database error' })
    }

    // Return key data (bukan redirect)
    return res.status(200).json({
      key: key,
      expires: keyExpiresAt.toISOString(),
      debug: {
        generated_at: new Date().toISOString(),
        expires_at: keyExpiresAt.toISOString(),
        valid_for_hours: 24
      }
    })

  } catch (err) {
    console.error('Generate key error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
                  }
