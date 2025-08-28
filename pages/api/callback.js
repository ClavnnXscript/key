import { createClient } from '@supabase/supabase-js'

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Generate key dengan format FREE_ + 32 karakter random
function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'FREE_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'ERROR', message: 'Method not allowed' })
  }

  try {
    // ⚠️ TODO: validasi callback Platoboost
    // Contoh: cek req.headers['platoboost-token'] atau req.body.token
    // Jika tidak valid → return 403

    // Generate unique key
    let key
    let keyExists = true
    let attempts = 0
    const maxAttempts = 10

    while (keyExists && attempts < maxAttempts) {
      key = generateKey()
      const { data: existingKey, error: selectError } = await supabase
        .from('keys')
        .select('license_key')
        .eq('license_key', key)
        .single()

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Supabase select error:', selectError)
        return res.status(500).json({ status: 'ERROR', message: 'Database error (select)' })
      }

      keyExists = !!existingKey
      attempts++
    }

    if (keyExists) {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Failed to generate unique key'
      })
    }

    // Set expiry 8 menit dari sekarang
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 8)

    // Insert ke Supabase
    const { data, error: insertError } = await supabase
      .from('keys')
      .insert([
        {
          license_key: key,
          expires_at: expiresAt.toISOString()
        }
      ])

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return res.status(500).json({ status: 'ERROR', message: 'Database error (insert)' })
    }

    // Response JSON ke Platoboost
    return res.status(200).json({
      status: 'OK',
      key,
      expires_at: expiresAt.toISOString()
    })

  } catch (error) {
    console.error('Callback API error:', error)
    return res.status(500).json({ status: 'ERROR', message: 'Internal server error' })
  }
}
