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

  const { session } = req.query
  
  // Get session from cookie if not in query
  let sessionId = session
  if (!sessionId) {
    const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    sessionId = cookies?.session_id
  }

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' })
  }

  try {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'

    // Validate session exists and not used
    const { data: sessionData, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('used', false)
      .single()

    if (fetchError || !sessionData) {
      return res.status(400).json({ error: 'Invalid or expired session' })
    }

    // Verify IP matches (optional security - uncomment if needed)
    // if (sessionData.user_ip !== userIP) {
    //   return res.status(403).json({ error: 'IP mismatch detected' })
    // }

    // Check if step1 was completed
    if (!sessionData.step1_complete) {
      return res.status(400).json({ error: 'Step 1 not completed' })
    }

    // Check minimum time elapsed (prevent too fast completion)
    const now = new Date()
    const sessionCreated = new Date(sessionData.created_at)
    const timeElapsed = now - sessionCreated

    if (timeElapsed < 10000) { // Minimum 10 seconds
      return res.status(429).json({ error: 'Completed too fast, please wait' })
    }

    // Update session - mark step2 as complete
    const { error: updateError } = await supabase
      .from('sessions')
      .update({ 
        step2_complete: true,
        step2_completed_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    if (updateError) {
      console.error('Update error:', updateError)
      return res.status(500).json({ error: 'Database update failed' })
    }

    // Redirect to callback (generate key)
    const baseUrl = req.headers.host.includes('localhost') 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`
    
    const callbackUrl = `${baseUrl}/api/callback?session=${sessionId}`
    
    return res.redirect(302, callbackUrl)

  } catch (err) {
    console.error('Step2 error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
