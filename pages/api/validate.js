import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function DisplayKey() {
  const router = useRouter()
  const { key } = router.query
  const [status, setStatus] = useState('LOADING')
  const [licenseKey, setLicenseKey] = useState('')
  const [expires, setExpires] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [copied, setCopied] = useState(false)

  // Call validate API
  useEffect(() => {
    if (!key) return
    fetch(`/api/validate?key=${encodeURIComponent(key)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'VALID') {
          setLicenseKey(data.license_key)
          setExpires(data.expires)
          setStatus('VALID')
        } else {
          setStatus(data.status) // INVALID or EXPIRED
        }
      })
      .catch(() => setStatus('ERROR'))
  }, [key])

  // Countdown
  useEffect(() => {
    if (!expires) return
    const update = () => {
      const now = new Date()
      const exp = new Date(expires)
      const diff = exp - now
      if (diff <= 0) {
        setTimeLeft('Expired')
        setStatus('EXPIRED')
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${h} hours and ${m} minutes left`)
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expires])

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = licenseKey
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // UI states
  if (status === 'LOADING') {
    return <div style={styles.container}><div style={styles.loading}>Loading...</div></div>
  }

  if (status === 'INVALID') {
    return <div style={styles.container}><div style={styles.loading}>❌ Invalid key</div></div>
  }

  if (status === 'EXPIRED') {
    return <div style={styles.container}><div style={styles.loading}>⌛ Key expired</div></div>
  }

  if (status !== 'VALID') {
    return <div style={styles.container}><div style={styles.loading}>⚠ Error occurred</div></div>
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
          <p style={styles.subtitle}>Please return to the service for access, you have {timeLeft}.</p>
          <div style={styles.keyContainer}>
            <div style={styles.keyText}>{licenseKey}</div>
          </div>
          <button 
            onClick={copyKey}
            style={{
              ...styles.copyButton,
              backgroundColor: copied ? '#10b981' : '#374151',
              transform: copied ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            <span style={styles.buttonIcon}>{copied ? '✓' : '📋'}</span>
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

const styles = { /* ... pakai styles lama biar sama persis ... */ }
