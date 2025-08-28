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
  // Support both POST (PlatoBoost) and GET (Step flow)
  if (req.method === 'POST') {
    // Original PlatoBoost flow
    const { user_id } = req.body

    if (!user_id) {
      return res.status(400).json({ status: 'ERROR', message: 'Missing user_id' })
    }

    try {
      // Generate key unik
      const key = generateKey()

      // Set expiry, 8 menit dari sekarang
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
  else if (req.method === 'GET') {
    // New step-based flow
    const { session } = req.query

    if (!session) {
      return res.status(400).json({ error: 'Session required' })
    }

    try {
      // Validate session and check flow completion
      const { data: sessionData, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_id', session)
        .eq('used', false)
        .single()

      if (fetchError || !sessionData) {
        return res.status(400).json({ error: 'Invalid or expired session' })
      }

      // Verify both steps completed
      if (!sessionData.step1_complete || !sessionData.step2_complete) {
        return res.status(400).json({ error: 'Incomplete flow - please start over' })
      }

      // Check session not too old (max 10 minutes)
      const now = new Date()
      const sessionCreated = new Date(sessionData.created_at)
      const sessionAge = now - sessionCreated

      if (sessionAge > 600000) { // 10 minutes
        return res.status(400).json({ error: 'Session expired - please start over' })
      }

      // Generate new key
      const key = generateKey()
      
      // Set expiry 8 minutes from now
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 8)

      // Save key to database
      const { error: keyError } = await supabase
        .from('keys')
        .insert([{
          license_key: key,
          user_id: sessionData.session_id, // Use session as user_id
          expires_at: expiresAt.toISOString()
        }])

      if (keyError) {
        console.error('Key insert error:', keyError)
        return res.status(500).json({ error: 'Failed to generate key' })
      }

      // Mark session as used
      await supabase
        .from('sessions')
        .update({ used: true })
        .eq('session_id', session)

      // Redirect to homepage (index.js) with key info
      const baseUrl = req.headers.host.includes('localhost') 
        ? `http://${req.headers.host}`
        : `https://${req.headers.host}`
      
      const displayUrl = `${baseUrl}/?key=${key}&expires=${expiresAt.toISOString()}`
      
      return res.redirect(302, displayUrl)

    } catch (err) {
      console.error('Generate error:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } 
  else {
    return res.status(405).json({ status: 'ERROR', message: 'Method not allowed' })
  }
      }
