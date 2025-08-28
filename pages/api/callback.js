// pages/api/callback.js
import { createClient } from '@supabase/supabase-js'

// Buat client Supabase dengan service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Fungsi generate key unik
function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'FREE_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default async function handler(req, res) {
  // Hanya menerima POST dari Platoboost
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'ERROR', message: 'Method not allowed' })
  }

  const { user_id } = req.body

  if (!user_id) {
    return res.status(400).json({ status: 'ERROR', message: 'Missing user_id' })
  }

  try {
    // Generate key unik
    const key = generateKey()

    // Set expiry, misal 8 menit dari sekarang
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 8)

    // Simpan ke Supabase
    const { error } = await supabase
      .from('keys')
      .insert([
        { license_key: key, user_id, expires_at: expiresAt.toISOString() }
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ status: 'ERROR', message: 'Database error' })
    }

    // Kirim response JSON ke Platoboost
    return res.status(200).json({
      status: 'OK',
      key,
      expires_at: expiresAt.toISOString()
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'ERROR', message: 'Internal server error' })
  }
}
