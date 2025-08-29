// pages/continue.js
import { useRouter } from 'next/router'

export default function Continue() {
  const router = useRouter()
  const { token } = router.query

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '16px' }}>⚠️ Token Missing</h2>
          <p>Please restart the process from Step 1.</p>
        </div>
      </div>
    )
  }

  // ShrinkMe Step2 link kamu
  const shrinkMeStep2 = `https://en.shrinke.me/c99niw?token=${token}`

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%'
      }}>
        <h1 style={{ marginBottom: '16px', color: '#2d3748' }}>✅ Step 1 Completed</h1>
        <p style={{ color: '#4a5568', marginBottom: '24px' }}>
          Great job! Now click the button below to continue to Step 2.
        </p>

        <a
          href={shrinkMeStep2}
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            backgroundColor: '#4299e1',
            color: 'white',
            borderRadius: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#3182ce'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4299e1'}
        >
          Continue Step 2 🚀
        </a>
      </div>
    </div>
  )
            }
