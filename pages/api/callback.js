// pages/api/callback.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Generate license key unik
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
    // Cek token valid
    const { data: tokenData, error: fetchError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token', token)
      .eq('used', true) // harus sudah dipakai di step2
      .single()

    if (fetchError || !tokenData) {
      return res.status(400).json({ error: 'Invalid token' })
    }

    // Pastikan token belum expired
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Token expired' })
    }

    // Generate key baru
    const key = generateKey()
    const keyExpiresAt = new Date()
    keyExpiresAt.setHours(keyExpiresAt.getHours() + 24) // 24 jam aktif

    // Simpan ke tabel keys
    const { error: insertError } = await supabase
      .from('keys')
      .insert([
        {
          license_key: key,
          user_id: tokenData.id, // bisa simpan token id sebagai user_id
          expires_at: keyExpiresAt.toISOString(),
          used: false
        }
      ])

    if (insertError) {
      console.error('Insert key error:', insertError)
      return res.status(500).json({ error: 'Database error' })
    }

    // Redirect ke halaman index.js untuk menampilkan key
    const baseUrl = req.headers.host.includes('localhost')
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`

    const displayUrl = `${baseUrl}/?key=${key}&expires=${keyExpiresAt.toISOString()}`
    return res.redirect(302, displayUrl)

  } catch (err) {
    console.error('Callback error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
