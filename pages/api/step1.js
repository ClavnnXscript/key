// pages/api/step1.js
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Generate token unik
function generateToken() {
  return crypto.randomBytes(24).toString('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = generateToken()

    // Expired 15 menit
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    const { error } = await supabase
      .from('tokens')
      .insert([{ token, expires_at: expiresAt.toISOString(), used: false }])

    if (error) {
      console.error('Token insert error:', error)
      return res.status(500).json({ error: 'Database error' })
    }

    // Redirect ke halaman continue
    const baseUrl = req.headers.host.includes('localhost')
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`

    return res.redirect(302, `${baseUrl}/continue?token=${token}`)
  } catch (err) {
    console.error('Step1 error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
