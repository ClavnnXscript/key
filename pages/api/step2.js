// pages/api/step2.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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

    // Redirect ke callback
    const baseUrl = req.headers.host.includes('localhost')
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`

    return res.redirect(302, `${baseUrl}/api/callback?token=${token}`)
  } catch (err) {
    console.error('Step2 error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
