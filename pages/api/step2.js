// pages/api/step2.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Debug: Log semua yang diterima
  console.log('Query params:', req.query)
  console.log('Headers cookie:', req.headers.cookie)

  // Ambil token dari query parameter atau cookie
  let token = req.query.token

  if (!token) {
    // Fallback: baca dari cookie
    const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    console.log('Parsed cookies:', cookies)
    token = cookies?.auth_token
  }

  console.log('Final token:', token)

  if (!token) {
    return res.status(400).json({ 
      error: 'Token required',
      debug: {
        query: req.query,
        cookies: req.headers.cookie
      }
    })
  }

  try {
    // Cek token valid, belum dipakai, belum expired
    const { data: tokenData, error: fetchError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (fetchError || !tokenData) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    // Cek expired (max 15 menit)
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Token expired' })
    }

    // Tandai token sudah dipakai
    await supabase
      .from('tokens')
      .update({ used: true })
      .eq('id', tokenData.id)

    // Redirect ke callback.js untuk generate key
    const baseUrl = req.headers.host.includes('localhost')
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`

    const callbackUrl = `${baseUrl}/api/callback?token=${token}`
    return res.redirect(302, callbackUrl)

  } catch (err) {
    console.error('Step2 error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
