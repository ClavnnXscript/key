import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { key } = req.query

  if (!key) {
    return res.status(400).json({ 
      status: 'INVALID', 
      message: 'Key is required' 
    })
  }

  try {
    const { data, error } = await supabase
      .from('keys')
      .select('*')
      .eq('license_key', key)
      .single()

    if (error || !data) {
      return res.status(200).json({ status: 'INVALID' })
    }

    // FIX: Gunakan UTC untuk semua comparison
    const now = new Date() // Current time
    const expiresAt = new Date(data.expires_at) // Database time (sudah UTC)
    
    console.log('=== TIMEZONE DEBUG ===')
    console.log('Current UTC:', now.toISOString())
    console.log('Expires UTC:', expiresAt.toISOString())
    console.log('Current Local:', now.toString())
    console.log('Expires Local:', expiresAt.toString())
    console.log('Expired?:', now > expiresAt)

    if (now > expiresAt) {
      return res.status(200).json({ 
        status: 'EXPIRED',
        debug: {
          current_utc: now.toISOString(),
          expires_utc: expiresAt.toISOString(),
          expired: true
        }
      })
    }

    return res.status(200).json({ 
      status: 'VALID',
      license_key: data.license_key,
      expires: data.expires_at,
      debug: {
        current_utc: now.toISOString(),
        expires_utc: expiresAt.toISOString(),
        time_left_minutes: Math.round((expiresAt - now) / (1000 * 60)),
        expired: false
      }
    })

  } catch (error) {
    console.error('Validate API error:', error)
    return res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error' 
    })
  }
}
