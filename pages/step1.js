import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

export default async function handler(req, res) {
  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Token required' })

  try {
    // Upsert supaya kalau belum ada token, bikin baru
    await supabase.from('progress').upsert({
      token,
      step1_done: true
    }, { onConflict: 'token' })

    // Redirect ke step2 page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    return res.redirect(302, `${baseUrl}/step2?token=${token}`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
