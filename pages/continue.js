// pages/continue.js
import { useRouter } from 'next/router'

export default function Continue() {
  const router = useRouter()
  const { token } = router.query

  if (!token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>⚠️ Invalid access</h2>
        <p>You must start from Step 1.</p>
      </div>
    )
  }

  const handleContinue = () => {
    router.push(`/api/step2?token=${token}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'sans-serif',
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
        <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Step 1 Complete 🎉</h2>
        <p style={{ marginBottom: '20px', color: '#4a5568' }}>
          Click the button below to continue to Step 2 and claim your key.
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
            width: '100%'
          }}
        >
          Continue Step 2 ➡️
        </button>
      </div>
    </div>
  )
          }
