export default function Home() {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '800px', 
      margin: '50px auto', 
      padding: '40px',
      lineHeight: '1.6',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ color: '#1e293b', marginBottom: '16px' }}>My Key System</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Sistem key sederhana untuk integrasi dengan PlatoBoost dengan UI display yang menarik.
      </p>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>API Endpoints:</h2>
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ color: '#059669' }}>GET /api/callback</strong> - Generate key baru & redirect ke display
          <br />
          <small style={{ color: '#64748b' }}>Query: ?token=your_token</small>
          <br />
          <small style={{ color: '#64748b' }}>Response: Redirect ke halaman display key</small>
        </div>
        <div>
          <strong style={{ color: '#0ea5e9' }}>GET /api/validate</strong> - Validasi key
          <br />
          <small style={{ color: '#64748b' }}>Query: ?key=FREE_your_key</small>
          <br />
          <small style={{ color: '#64748b' }}>Response: {"{"} status: "VALID|EXPIRED|INVALID" {"}"}</small>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fef3c7', 
        border: '1px solid #fbbf24',
        padding: '16px', 
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <strong style={{ color: '#92400e' }}>💡 Cara Kerja:</strong>
        <ol style={{ color: '#92400e', marginTop: '8px', paddingLeft: '20px' }}>
          <li>PlatoBoost hit <code>/api/callback?token=xyz</code></li>
          <li>Server generate key → redirect ke <code>/display</code></li>
          <li>User melihat UI key (seperti Delta X)</li>
          <li>User bisa copy key untuk digunakan</li>
        </ol>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>Testing:</h3>
        <p style={{ color: '#64748b', marginBottom: '12px' }}>
          Test callback (akan redirect ke display):
        </p>
        <code style={{ 
          backgroundColor: '#f1f5f9', 
          padding: '8px 12px', 
          borderRadius: '6px',
          fontSize: '14px',
          color: '#475569',
          display: 'block',
          marginBottom: '16px'
        }}>
          curl -L "http://localhost:3000/api/callback?token=test123"
        </code>
        
        <p style={{ color: '#64748b', marginBottom: '12px' }}>
          Test validate key:
        </p>
        <code style={{ 
          backgroundColor: '#f1f5f9', 
          padding: '8px 12px', 
          borderRadius: '6px',
          fontSize: '14px',
          color: '#475569',
          display: 'block'
        }}>
          curl "http://localhost:3000/api/validate?key=FREE_abc123"
        </code>
      </div>

      <p style={{ 
        color: '#64748b', 
        fontSize: '14px',
        marginTop: '32px',
        textAlign: 'center'
      }}>
        Built with Next.js & Supabase | Deploy ready untuk Vercel
      </p>
    </div>
  )
            }
