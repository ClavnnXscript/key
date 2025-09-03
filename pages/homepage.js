// pages/homepage.js

export default function Homepage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 60px 50px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            text-align: center;
            max-width: 600px;
            width: 100%;
            position: relative;
            animation: slideUp 0.8s ease-out;
            margin: 40px auto;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .logo {
            font-size: 3.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .subtitle { font-size: 1.3rem; color: #4a5568; margin-bottom: 12px; font-weight: 500; }
        .description { color: #718096; font-size: 1.1rem; margin-bottom: 40px; line-height: 1.6; max-width: 480px; margin: 0 auto 40px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 45px; padding: 0 10px; }
        .feature { background: rgba(102, 126, 234, 0.1); padding: 20px 15px; border-radius: 15px; border: 2px solid rgba(102, 126, 234, 0.2); transition: all 0.3s ease; }
        .feature:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2); }
        .feature-icon { font-size: 2rem; margin-bottom: 8px; display: block; }
        .feature-text { font-size: 0.9rem; color: #4a5568; font-weight: 600; }
        .main-button {
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            padding: 18px 40px;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 700;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 35px;
            transition: all 0.3s;
            box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
            position: relative;
            overflow: hidden;
        }
        .main-button:hover { transform: translateY(-3px) scale(1.05); }
        .discord-section { background: rgba(88, 101, 242, 0.1); border: 2px solid rgba(88, 101, 242, 0.2); border-radius: 20px; padding: 25px; margin-top: 30px; }
        .discord-title { font-size: 1.3rem; font-weight: 700; color: #5865f2; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .discord-desc { color: #6b7280; font-size: 1rem; margin-bottom: 20px; line-height: 1.5; }
        .discord-button {
            background: #5865f2;
            color: white;
            padding: 12px 28px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        .discord-button:hover { background: #4752c4; transform: translateY(-2px); }
        .tutorial-section { background: rgba(255, 87, 51, 0.1); border: 2px solid rgba(255, 87, 51, 0.2); border-radius: 20px; padding: 25px; margin-top: 30px; }
        .tutorial-title { font-size: 1.3rem; font-weight: 700; color: #ff5733; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .tutorial-desc { color: #6b7280; font-size: 1rem; margin-bottom: 20px; line-height: 1.5; }
        .tutorial-button {
            background: #ff5733;
            color: white;
            padding: 12px 28px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        .tutorial-button:hover { background: #e04527; transform: translateY(-2px); }
        .steps { background: rgba(255, 255, 255, 0.6); border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid rgba(0, 0, 0, 0.1); }
        .steps-title { font-size: 1.2rem; font-weight: 700; color: #2d3748; margin-bottom: 15px; }
        .step { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; color: #4a5568; font-size: 0.95rem; }
        .step-number { background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}>
        <div className="container">
          <div className="logo">ClavnnX</div>
          <div className="subtitle">Free License Key Generator</div>
          <div className="description">
            Get your premium software license key for free! Complete 2 simple steps and enjoy 24-hour access to premium features.
          </div>

          <div className="features">
            <div className="feature"><span className="feature-icon">🔑</span><div className="feature-text">Free License</div></div>
            <div className="feature"><span className="feature-icon">⚡</span><div className="feature-text">Instant Access</div></div>
            <div className="feature"><span className="feature-icon">🔒</span><div className="feature-text">24h Valid</div></div>
            <div className="feature"><span className="feature-icon">✨</span><div className="feature-text">Premium Features</div></div>
          </div>

          <div className="steps">
            <div className="steps-title">How It Works</div>
            <div className="step"><div className="step-number">1</div><div>Complete verification step 1</div></div>
            <div className="step"><div className="step-number">2</div><div>Complete verification step 2</div></div>
            <div className="step"><div className="step-number">3</div><div>Generate your free license key</div></div>
            <div className="step"><div className="step-number">4</div><div>Copy and use for 24 hours</div></div>
          </div>

          <a href="https://en.shrinke.me/c99ni" className="main-button">
            🚀 Complete the step
          </a>

          <div className="tutorial-section">
            <div className="tutorial-title">Watch Tutorial</div>
            <div className="tutorial-desc">
              Need help getting your key? Watch our step-by-step tutorial to learn how to generate your license key easily!
            </div>
            <a href="https://linktr.ee/ClavnnX" target="_blank" className="tutorial-button">
              📺 Watch the tutorial for get key
            </a>
          </div>

          <div className="discord-section">
            <div className="discord-title">Join Our Community</div>
            <div className="discord-desc">
              Connect with other users, get support, and stay updated with the latest news and updates from ClavnnX!
            </div>
            <a href="https://discord.gg/QHPFGakSjN" target="_blank" className="discord-button">
              💬 Join Discord
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
