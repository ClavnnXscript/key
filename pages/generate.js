import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Generate() {
  const router = useRouter()
  const { token } = router.query // Token kedua dari step2
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const generateKey = async () => {
    if (!token) {
      setMessage('❌ Invalid access. Please complete both steps.')
      return
    }

    setLoading(true)
    setMessage('🔄 Generating your license key...')

    try {
      const response = await fetch(`/api/generate-key?token=${token}`)
      const data = await response.json()
      
      if (response.ok && data.key) {
        // Redirect ke halaman display key
        const expires = new Date(data.expires).toISOString()
        router.push(`/?key=${data.key}&expires=${expires}`)
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to generate key'}`)
      }
    } catch (err) {
      console.error('Generate error:', err)
      setMessage('❌ Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
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
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>⚠️ Access Denied</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Please complete both Step 1 and Step 2 first.
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
        {/* Progress Completed */}
        <div style={{
          backgroundColor: '#e6fffa',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '25px',
          border: '2px solid #4fd1c7'
        }}>
          <div style={{ fontSize: '16px', color: '#319795', fontWeight: '600' }}>
            ✅ Step 1 Completed<br/>
            ✅ Step 2 Completed<br/>
            🎯 Ready to Generate Key
          </div>
        </div>

        <h1 style={{ 
          color: '#2d3748', 
          marginBottom: '16px', 
          fontSize: '28px', 
          fontWeight: '700' 
        }}>
          🎉 All Steps Completed!
        </h1>
        
        <p style={{ color: '#718096', marginBottom: '24px', fontSize: '16px' }}>
          Congratulations! You've successfully completed both verification steps. 
          Click the button below to generate your free license key.
        </p>

        <button
          onClick={generateKey}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#a0aec0' : '#48bb78',
            color: 'white',
            padding: '18px 30px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '18px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'all 0.3s',
            marginBottom: '20px'
          }}
        >
          {loading ? '🔄 Generating...' : '🚀 Generate Your Key'}
        </button>

        {message && (
          <div style={{
            backgroundColor: message.startsWith('❌') ? '#fed7d7' : '#e6fffa',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            color: message.startsWith('❌') ? '#e53e3e' : '#2d5a57',
            marginBottom: '15px'
          }}>
            {message}
          </div>
        )}

        <div style={{
          fontSize: '13px',
          color: '#a0aec0',
          lineHeight: '1.4'
        }}>
          <p>🔒 Your license key will be valid for 24 hours</p>
          <p>💾 Make sure to copy and save it</p>
        </div>
      </div>
    </div>
  )
}
