import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

// Generate key dengan format seperti Delta X
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

  // Simple token verification (dummy for now)
  if (!token) {
    return res.status(400).json({ 
      status: 'ERROR', 
      message: 'Token is required' 
    })
  }

  try {
    // Generate unique key
    let key
    let keyExists = true
    let attempts = 0
    const maxAttempts = 10

    // Ensure key is unique
    while (keyExists && attempts < maxAttempts) {
      key = generateKey()
      
      const { data: existingKey } = await supabase
        .from('keys')
        .select('key')
        .eq('key', key)
        .single()
      
      keyExists = !!existingKey
      attempts++
    }

    if (keyExists) {
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'Failed to generate unique key' 
      })
    }

    // Set expiry to 24 hours from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Save to Supabase
    const { data, error } = await supabase
      .from('keys')
      .insert([
        {
          key: key,
          expires_at: expiresAt.toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'Database error' 
      })
    }

    // Redirect langsung ke halaman display key
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    res.redirect(302, `${baseUrl}/display?key=${key}&expires=${encodeURIComponent(expiresAt.toISOString())}`)

  } catch (error) {
    console.error('Callback API error:', error)
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error' 
    })
  }
}
