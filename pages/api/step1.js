// pages/api/step1.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Generate unique session ID
function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify secret key
  const { secret } = req.query
  if (secret !== 'pocof654') {
    return res.status(403).json({ error: 'Unauthorized access' })
  }

  try {
    const sessionId = generateSessionId()
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    
    // Create new session in database
    const { error } = await supabase
      .from('sessions')
      .insert([{
        session_id: sessionId,
        user_ip: userIP,
        step1_complete: true,
        step2_complete: false,
        created_at: new Date().toISOString(),
        used: false
      }])

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Database error' })
    }

    // Redirect to second ShrinkMe link
    // GANTI dengan URL ShrinkMe kedua Anda
    const shrinkmeLink2 = `https://shrinkme.io/YOUR_SECOND_LINK_HERE?session=${sessionId}`
    
    return res.redirect(302, shrinkmeLink2)

  } catch (err) {
    console.error('Step1 error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
        }
