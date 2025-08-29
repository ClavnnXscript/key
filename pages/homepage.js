// pages/homepage.js
export default function Homepage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "system-ui, sans-serif",
      padding: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}>
        
        {/* Title */}
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#4a5568", marginBottom: "10px" }}>
          ClavnnX
        </h1>
        <p style={{ color: "#718096", marginBottom: "30px", fontSize: "16px" }}>
          Free License Key Generator
        </p>

        {/* Features */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div style={featureBox}>🔑 Free License</div>
          <div style={featureBox}>⚡ Instant Access</div>
          <div style={featureBox}>⏳ 24h Valid</div>
          <div style={featureBox}>✨ Premium Features</div>
        </div>

        {/* How it works */}
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#2d3748", marginBottom: "15px" }}>
          How It Works
        </h2>
        <ol style={{
          textAlign: "left",
          margin: "0 auto 30px",
          maxWidth: "350px",
          color: "#4a5568",
          lineHeight: "1.8",
          fontSize: "15px"
        }}>
          <li>Complete verification step 1</li>
          <li>Complete verification step 2</li>
          <li>Generate your free license key</li>
          <li>Copy and use for 24 hours</li>
        </ol>

        {/* Main Button */}
        <a 
          href="https://en.shrinke.me/c99ni"
          style={{
            display: "block",
            background: "#38a169",
            color: "white",
            padding: "15px",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "700",
            textDecoration: "none",
            marginBottom: "25px",
            transition: "0.2s"
          }}
        >
          🚀 Complete Step
        </a>

        {/* Discord Box */}
        <div style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          padding: "25px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: "#2d3748" }}>
            Join Our Community
          </h3>
          <p style={{ fontSize: "14px", color: "#4a5568", marginBottom: "20px" }}>
            Connect with other users, get support, and stay updated with the latest news.
          </p>
          <a 
            href="https://discord.gg/QHPFGakSjN"
            style={{
              display: "inline-block",
              background: "#5865F2",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "16px"
            }}
          >
            💬 Join Discord
          </a>
        </div>
      </div>
    </div>
  )
}

const featureBox = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#2d3748",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
          }
