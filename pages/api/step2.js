// pages/api/step2.js - MODIFIKASI TOTAL
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function generateToken() {
  return crypto.randomBytes(24).toString('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('=== STEP2: User completed ShrinkMe Step 2 ===')
    
    // Generate TOKEN KEDUA (untuk halaman generate key)
    const generateToken2 = generateToken()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30) // 30 menit untuk generate key

    // Simpan token kedua ke database
    const { error } = await supabase
      .from('generate_tokens') // tabel berbeda untuk token generate
      .insert([{ 
        token: generateToken2, 
        expires_at: expiresAt.toISOString(), 
        used: false 
      }])

    if (error) {
      console.error('Generate token insert error:', error)
      return res.status(500).json({ error: 'Database error' })
    }

    // Redirect ke halaman "Generate Your Key" dengan token kedua
    const baseUrl = req.headers.host.includes('localhost')
      ? `http://${req.headers.host}` : `https://${req.headers.host}`

    return res.redirect(302, `${baseUrl}/generate?token=${generateToken2}`)
    
  } catch (err) {
    console.error('Step2 error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
