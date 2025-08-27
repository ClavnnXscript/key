import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

// Generate key with DeltaX-like format
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

  const { token, mode } = req.query

  if (!token) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Token is required'
    })
  }

  try {
    // 🔒 Check progress first
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('token', token)
      .single()

    if (progressError || !progress || !progress.step1_done || !progress.step2_done) {
      return res.status(403).json({
        status: 'ERROR',
        message: 'You must complete all steps first'
      })
    }

    // 🔑 Check if key already exists for this token
    const { data: existingKey } = await supabase
      .from('keys')
      .select('*')
      .eq('token', token)
      .single()

    if (existingKey) {
      // If key already exists, return it instead of generating new one
      if (mode === 'json') {
        return res.status(200).json(existingKey)
      } else {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        return res.redirect(302, `${baseUrl}/display?token=${token}`)
      }
    }

    // Generate a new unique key
    let key
    let keyExists = true
    let attempts = 0
    const maxAttempts = 10

    while (keyExists && attempts < maxAttempts) {
      key = generateKey()
      const { data: dupe } = await supabase
        .from('keys')
        .select('license_key')
        .eq('license_key', key)
        .single()
      keyExists = !!dupe
      attempts++
    }

    if (keyExists) {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Failed to generate unique key'
      })
    }

    // Expire in 24h
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Save to Supabase
    const { data, error } = await supabase
      .from('keys')
      .insert([
        {
          license_key: key,
          token: token,
          expires_at: expiresAt.toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Database error'
      })
    }

    // Return based on mode
    if (mode === 'json') {
      return res.status(200).json(data)
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      return res.redirect(302, `${baseUrl}/display?token=${token}`)
    }

  } catch (err) {
    console.error('Callback API error:', err)
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal server error'
    })
  }
      }
