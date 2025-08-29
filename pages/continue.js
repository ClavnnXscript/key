// pages/continue.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Continue() {
  const router = useRouter()
  const { token } = router.query
  const [valid, setValid] = useState(false)

  useEffect(() => {
    if (token) {
      setValid(true)
    }
  }, [token])

  const handleContinue = () => {
    if (!token) return
    
    // Set token ke cookie sebelum redirect
    document.cookie = `auth_token=${token}; path=/; max-age=900; SameSite=Lax`; // 15 minutes
    
    // Redirect ke ShrinkMe Step2 TANPA parameter
    const shrinkmeLink = `https://en.shrinke.me/c99niw`
    window.location.href = shrinkmeLink
  }

  if (!valid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>⚠️ Invalid Access</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            You must start from Step 1 to continue.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ color: '#2d3748', marginBottom: '16px', fontSize: '24px', fontWeight: '700' }}>
          ✅ Step 1 Completed
        </h1>
        <p style={{ color: '#718096', marginBottom: '24px' }}>
          Now continue to Step 2 to verify and claim your key.
        </p>
        <button
          onClick={handleContinue}
          style={{
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s'
          }}
        >
          🚀 Continue to Step 2
        </button>
      </div>
    </div>
  )
}
