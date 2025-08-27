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

    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
      return res.status(200).json({ status: 'EXPIRED' })
    }

    return res.status(200).json({ 
      status: 'VALID',
      license_key: data.license_key,
      expires: data.expires_at
    })

  } catch (error) {
    console.error('Validate API error:', error)
    return res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error' 
    })
  }
}
