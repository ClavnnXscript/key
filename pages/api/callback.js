// pages/api/callback.js
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function generateKey() {
  return 'FREE_' + crypto.randomBytes(16).toString('hex')
}

export default async function handler(req, res) {
  const { token } = req.query
  if (!token) {
    return res.status(400).json({ error: 'Token required' })
  }

  try {
    // Validasi token
    const { data: tokenData, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (error || !tokenData) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    const now = new Date()
    if (new Date(tokenData.expires_at) < now) {
      return res.status(400).json({ error: 'Token expired' })
    }

    // Tandai token sudah dipakai
    await supabase
      .from('tokens')
      .update({ used: true })
      .eq('token', token)

    // Generate key baru (24 jam expired)
    const key = generateKey()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const { error: keyError } = await supabase
      .from('keys')
      .insert([{ license_key: key, expires_at: expiresAt.toISOString(), used: false }])

    if (keyError) {
      console.error('Key insert error:', keyError)
      return res.status(500).json({ error: 'Database error' })
    }

    // Redirect ke index dengan key
    const baseUrl = req.headers.host.includes('localhost')
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`

    return res.redirect(302, `${baseUrl}/?key=${key}&expires=${expiresAt.toISOString()}`)
  } catch (err) {
    console.error('Callback error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
