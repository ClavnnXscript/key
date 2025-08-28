// pages/redirect.js
import { useEffect, useState } from 'react'

export default function RedirectPage() {
  const [key, setKey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Ambil query params dari URL ShrinkMe
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('user_id') || '5868' // default ID Platoboost

    // POST ke callback.js untuk generate key
    fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') {
          setKey(data.key)
        } else {
          setError(data.message || 'Failed to generate key')
        }
      })
      .catch(err => {
        console.error(err)
        setError('Error connecting to API')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>
  if (error) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</p>

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎉 Key Kamu</h1>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{key}</p>
      <p>Salin key ini untuk digunakan di game atau script.</p>

      {/* Tombol kembali ke Platoboost */}
      <a
        href="https://www.platoboost.com" // ganti sesuai URL task Platoboost
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Kembali ke Platoboost
      </a>
    </div>
  )
}
