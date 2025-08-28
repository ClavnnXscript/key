// pages/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { key, expires } = router.query
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!expires) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const expiryTime = new Date(expires).getTime()
      const difference = expiryTime - now

      if (difference > 0) {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('00:00')
        setIsExpired(true)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [expires])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!key) {
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
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>⚠️ Access Denied</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            You need to complete the verification process to access your key.
          </p>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Please start from the beginning and follow all steps.
          </p>
        </div>
      </div>
    )
  }

  if (isExpired) {
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
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>⏰ Key Expired</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Your key has expired. Please generate a new one.
          </p>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            border: '2px dashed #dee2e6'
          }}>
            <code style={{ color: '#6c757d', fontSize: '14px' }}>{key}</code>
          </div>
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
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#2d3748', 
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            🎉 Your Free Key
          </h1>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            Key generated successfully! Copy and use it now.
          </p>
        </div>

        {/* Timer */}
        <div style={{
          backgroundColor: timeLeft.startsWith('0:') && parseInt(timeLeft.split(':')[1]) <= 30 ? '#fed7d7' : '#e6fffa',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '25px',
          border: `2px solid ${timeLeft.startsWith('0:') && parseInt(timeLeft.split(':')[1]) <= 30 ? '#fc8181' : '#4fd1c7'}`
        }}>
          <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>
            Time Remaining
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: timeLeft.startsWith('0:') && parseInt(timeLeft.split(':')[1]) <= 30 ? '#e53e3e' : '#319795'
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Key Display */}
        <div style={{
          backgroundColor: '#f7fafc',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #e2e8f0',
          marginBottom: '25px',
          position: 'relative'
        }}>
          <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '10px' }}>
            Your License Key:
          </div>
          <div style={{
            backgroundColor: '#2d3748',
            color: '#e2e8f0',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'Monaco, "Lucida Console", monospace',
            fontSize: '16px',
            fontWeight: '600',
            wordBreak: 'break-all',
            lineHeight: '1.4'
          }}>
            {key}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          style={{
            backgroundColor: copied ? '#48bb78' : '#4299e1',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
            marginBottom: '20px'
          }}
          onMouseOver={(e) => {
            if (!copied) e.target.style.backgroundColor = '#3182ce'
          }}
          onMouseOut={(e) => {
            if (!copied) e.target.style.backgroundColor = '#4299e1'
          }}
        >
          {copied ? '✓ Copied to Clipboard!' : '📋 Copy Key'}
        </button>

        {/* Footer */}
        <div style={{
          fontSize: '14px',
          color: '#a0aec0',
          lineHeight: '1.5'
        }}>
          <p>⚠️ This key will expire in {timeLeft}</p>
          <p style={{ marginTop: '8px' }}>
            Make sure to save it before the timer runs out!
          </p>
        </div>
      </div>
    </div>
  )
              }
