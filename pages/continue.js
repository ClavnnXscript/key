// pages/continue.js - MODIFIKASI
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

  const handleContinueStep2 = () => {
    if (!token) return
    
    // PENTING: Simpan token untuk nanti recovery
    localStorage.setItem('step1_token', token)
    
    // Redirect ke ShrinkMe Step 2 - TANPA parameter (akan hilang)
    const shrinkmeStep2 = `https://en.shrinke.me/c99niw`
    window.location.href = shrinkmeStep2
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
            You must complete Step 1 first.
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
        {/* Progress */}
        <div style={{
          backgroundColor: '#e6fffa',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '25px',
          border: '2px solid #4fd1c7'
        }}>
          <div style={{ fontSize: '14px', color: '#2d5a57', marginBottom: '8px' }}>
            Progress:
          </div>
          <div style={{ fontSize: '16px', color: '#319795', fontWeight: '600' }}>
            ✅ Step 1 Completed<br/>
            ⏳ Ready for Step 2
          </div>
        </div>

        <h1 style={{ 
          color: '#2d3748', 
          marginBottom: '16px', 
          fontSize: '24px', 
          fontWeight: '700' 
        }}>
          🚀 Ready for Step 2
        </h1>
        
        <p style={{ color: '#718096', marginBottom: '24px' }}>
          You've completed Step 1! Now continue to Step 2 to complete the verification process.
        </p>

        <button
          onClick={handleContinueStep2}
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
          🔗 Continue Step 2
        </button>

        <div style={{
          fontSize: '13px',
          color: '#a0aec0',
          marginTop: '20px',
          lineHeight: '1.4'
        }}>
          <p>⚠️ Keep this tab open while completing Step 2</p>
        </div>
      </div>
    </div>
  )
}
