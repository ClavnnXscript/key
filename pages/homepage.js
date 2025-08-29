// pages/homepage.js
export default function Homepage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Header */}
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#4a5568', marginBottom: '10px' }}>
          ClavnnX
        </h1>
        <p style={{ color: '#718096', marginBottom: '30px' }}>
          Free License Key Generator
        </p>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={featureBox}><span>🔑</span> Free License</div>
          <div style={featureBox}><span>⚡</span> Instant Access</div>
          <div style={featureBox}><span>⏳</span> 24h Valid</div>
          <div style={featureBox}><span>✨</span> Premium Features</div>
        </div>

        {/* How it works */}
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '15px' }}>
          How It Works
        </h2>
        <ol style={{ textAlign: 'left', marginBottom: '30px', color: '#4a5568' }}>
          <li>Complete verification step 1</li>
          <li>Complete verification step 2</li>
          <li>Generate your free license key</li>
          <li>Copy and use for 24 hours</li>
        </ol>

        {/* Buttons */}
        <a 
          href="https://en.shrinke.me/c99ni"
          style={buttonGreen}
        >
          🚀 Complete Step
        </a>
        
        <a 
          href="https://discord.gg/QHPFGakSjN"
          style={buttonDiscord}
        >
          💬 Join Discord
        </a>
      </div>
    </div>
  )
}

const featureBox = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#2d3748',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px'
}

const buttonGreen = {
  display: 'block',
  backgroundColor: '#38a169',
  color: 'white',
  padding: '15px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  marginBottom: '15px',
  transition: 'background 0.2s'
}

const buttonDiscord = {
  display: 'block',
  backgroundColor: '#5865F2',
  color: 'white',
  padding: '15px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'background 0.2s'
          }
