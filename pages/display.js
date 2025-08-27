import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function DisplayKey() {
  const router = useRouter()
  const { token } = router.query
  const [key, setKey] = useState(null)
  const [expires, setExpires] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchKey() {
      if (!token) return
      try {
        const res = await fetch(`/api/callback?token=${token}`)
        const data = await res.json()

        if (data.license_key) {
          setKey(data.license_key)
        }
        if (data.expires_at) {
          setExpires(data.expires_at)
        }
      } catch (err) {
        console.error("Failed to fetch key:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchKey()
  }, [token])

  useEffect(() => {
    if (expires) {
      const interval = setInterval(updateTimeLeft, 1000)
      updateTimeLeft()
      return () => clearInterval(interval)
    }
  }, [expires])

  const updateTimeLeft = () => {
    if (expires) {
      const now = new Date()
      const expiresDate = new Date(expires)
      const diff = expiresDate - now

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours} hours and ${minutes} minutes left`)
      } else {
        setTimeLeft('Expired')
      }
    }
  }

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = key
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (!key) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>❌ No key found</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Successfully Whitelisted!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconContainer}>
            <div style={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.checkIcon}>
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <h1 style={styles.title}>Successfully whitelisted!</h1>
          
          <p style={styles.subtitle}>
            Please return to the service for access, you have {timeLeft}.
          </p>

          <div style={styles.keyContainer}>
            <div style={styles.keyText}>{key}</div>
          </div>

          <button 
            onClick={copyKey}
            style={{
              ...styles.copyButton,
              backgroundColor: copied ? '#10b981' : '#374151',
              transform: copied ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            <span style={styles.buttonIcon}>
              {copied ? '✓' : '📋'}
            </span>
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <div style={styles.footer}>
            <a href="#" style={styles.footerLink} onClick={(e) => e.preventDefault()}>Report</a>
            <a href="#" style={styles.footerLink} onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" style={styles.footerLink} onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: 'white',
    padding: '20px',
    margin: 0
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '48px 40px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #334155',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  iconContainer: {
    marginBottom: '24px'
  },
  successIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    margin: '0 auto',
    boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.15)'
  },
  checkIcon: {
    color: 'white'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    color: 'white',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    fontSize: '16px',
    color: '#94a3b8',
    margin: '0 0 32px 0',
    lineHeight: '1.6',
    fontWeight: '400'
  },
  keyContainer: {
    backgroundColor: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '12px',
    padding: '20px 16px',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  },
  keyText: {
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    fontSize: '14px',
    color: '#e2e8f0',
    wordBreak: 'break-all',
    lineHeight: '1.5',
    letterSpacing: '0.025em'
  },
  copyButton: {
    width: '100%',
    padding: '14px 20px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '32px',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit'
  },
  buttonIcon: {
    fontSize: '16px'
  },
  loading: {
    fontSize: '18px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    paddingTop: '16px',
    borderTop: '1px solid #334155'
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'underline',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.15s ease'
  }
    }
