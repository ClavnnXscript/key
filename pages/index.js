import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    
    // State untuk UI components
    const [currentKey, setCurrentKey] = useState('');
    const [output, setOutput] = useState('Complete verification steps to get your API key');
    const [progressBarWidth, setProgressBarWidth] = useState('0%');
    const [progressStep, setProgressStep] = useState('Step 0/2');
    const [stepIndicatorVisible, setStepIndicatorVisible] = useState(false);
    const [stepIndicatorClass, setStepIndicatorClass] = useState('step-indicator');
    const [stepIndicatorText, setStepIndicatorText] = useState('');
    const [countdownVisible, setCountdownVisible] = useState(false);
    const [countdownTimer, setCountdownTimer] = useState('00:00');
    const [btnContinueVisible, setBtnContinueVisible] = useState(true);
    const [btnContinueText, setBtnContinueText] = useState('Complete the step');
    const [btnContinueClass, setBtnContinueClass] = useState('main-button');
    const [btnContinueDisabled, setBtnContinueDisabled] = useState(false);
    const [btnCopyVisible, setBtnCopyVisible] = useState(false);
    const [btnCopyText, setBtnCopyText] = useState('Copy Key');
    const [outputStyle, setOutputStyle] = useState({});
    
    // State untuk data management
    const [tokenData, setTokenData] = useState(null);
    const [stepProgress, setStepProgress] = useState(0);
    const [generateAccess, setGenerateAccess] = useState(null);
    const [generatedKeyData, setGeneratedKeyData] = useState(null);
    const [generatePageMemory, setGeneratePageMemory] = useState({ 
        accessTime: null, 
        isExpired: false 
    });
    const [countdownInterval, setCountdownInterval] = useState(null);
    const [route, setRoute] = useState('home');

    // Initialize route
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        const pathname = window.location.pathname.replace('/', '');
        const detectedRoute = hash || pathname || 'home';
        setRoute(detectedRoute);
    }, []);

    // Token management
    const saveToken = (token) => {
        if (token) {
            setTokenData({
                token: token,
                created: Date.now(),
                expires: Date.now() + (8 * 60 * 1000)
            });
        }
    };

    const getToken = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        
        if (tokenFromUrl) {
            saveToken(tokenFromUrl);
            return tokenFromUrl;
        }
        
        if (tokenData && Date.now() < tokenData.expires) {
            return tokenData.token;
        }
        
        clearToken();
        return null;
    };

    const clearToken = () => {
        setTokenData(null);
        setStepProgress(0);
        setGenerateAccess(null);
        setGeneratedKeyData(null);
    };

    const generateToken = () => {
        return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    };

    // Generated key management
    const saveGeneratedKey = (keyData) => {
        if (keyData) {
            setGeneratedKeyData({
                key: keyData.key,
                expires: keyData.expires,
                generated: Date.now(),
                isValid: true
            });
        }
    };

    const getGeneratedKey = () => {
        if (generatedKeyData && generatedKeyData.isValid && Date.now() < generatedKeyData.expires) {
            return generatedKeyData;
        }
        
        if (generatedKeyData) {
            setGeneratedKeyData(null);
        }
        return null;
    };

    const hasValidGeneratedKey = () => {
        const keyData = getGeneratedKey();
        return keyData && keyData.key;
    };

    // Generate page access management
    const saveGenerateAccess = () => {
        const now = Date.now();
        const accessData = {
            accessTime: now,
            expires: now + (8 * 60 * 1000)
        };
        
        setGenerateAccess(accessData);
        setGeneratePageMemory({ accessTime: now, isExpired: false });
    };

    const getGenerateAccess = () => {
        if (generateAccess && Date.now() < generateAccess.expires) {
            setGeneratePageMemory({ 
                accessTime: generateAccess.accessTime, 
                isExpired: false 
            });
            return generateAccess;
        }
        
        setGeneratePageMemory(prev => ({ ...prev, isExpired: true }));
        return null;
    };

    const isGeneratePageExpired = () => {
        const accessData = getGenerateAccess();
        return !accessData || generatePageMemory.isExpired;
    };

    const getRemainingTime = () => {
        if (!generateAccess) return 0;
        
        const remaining = generateAccess.expires - Date.now();
        return Math.max(0, remaining);
    };

    // Progress functions
    const updateProgress = (currentStep, totalSteps = 2) => {
        const percentage = (currentStep / totalSteps) * 100;
        setProgressBarWidth(percentage + '%');
        setProgressStep(`Step ${currentStep}/${totalSteps}`);
    };

    const updateStepIndicator = (currentStep, totalSteps = 2) => {
        setStepIndicatorVisible(true);
        if (currentStep >= totalSteps) {
            setStepIndicatorClass('success-message pulse');
            setStepIndicatorText('All Steps Completed! Ready to generate key');
        } else {
            setStepIndicatorClass('step-indicator pulse');
            setStepIndicatorText(`Step ${currentStep}/${totalSteps} Completed`);
        }
    };

    // Countdown functionality
    const startCountdown = () => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        const interval = setInterval(() => {
            const remaining = getRemainingTime();
            
            if (remaining <= 0) {
                clearInterval(interval);
                setCountdownTimer('00:00');
                setGeneratePageMemory(prev => ({ ...prev, isExpired: true }));
                return;
            }

            const minutes = Math.floor(remaining / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            setCountdownTimer(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        setCountdownInterval(interval);
    };

    // Page initialization functions
    const initHome = () => {
        updateProgress(stepProgress);
        if (stepProgress > 0) updateStepIndicator(stepProgress);
        setBtnContinueText('Start Step 1/2');
    };

    const initStep1 = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('completed') === '1') {
            const token = generateToken();
            saveToken(token);
            setStepProgress(1);
            
            updateProgress(1);
            updateStepIndicator(1);
            setOutput('Step 1/2 completed successfully!\n\nRedirecting to Step 2/2...');
            setBtnContinueVisible(false);
            
            setTimeout(() => {
                router.push('/step2');
            }, 1500);
            return;
        }
        
        updateProgress(Math.max(stepProgress, 0));
        setBtnContinueText('Step 1/2 - Complete');
        setOutput('Step 1 of 2: Token Generation Step\n\nClick the button below to complete Step 1/2.');
    };

    const initStep2 = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('completed') === '2') {
            if (!getToken()) {
                showError('Token expired. Please start over.');
                return;
            }
            
            setStepProgress(2);
            updateProgress(2, 2);
            updateStepIndicator(2, 2);
            setOutput('Step 2/2 completed successfully!\n\nRedirecting to key generation...');
            setBtnContinueVisible(false);
            
            setTimeout(() => {
                window.location.href = 'https://en.shrinke.me/scriptrblx2';
            }, 1500);
            return;
        }
        
        updateProgress(Math.max(stepProgress, 1));
        setBtnContinueText('Step 2/2 - Final');
        setOutput('Step 2 of 2: Final Verification Step\n\nStep 1/2: Completed\n\nClick the button below to complete Step 2/2.');
    };

    const initGetKey = () => {
        const token = getToken();
        
        if (!token || stepProgress < 2) {
            showError('Invalid access. Complete all steps first.');
            return;
        }
        
        updateProgress(2, 2);
        updateStepIndicator(2, 2);
        setBtnContinueText('Generate Your API Key');
        setBtnContinueClass('main-button glow');
        setOutput('Get Your Key\n\nVALID ACCESS CONFIRMED\n\nYou can now generate your API key!');
    };

    const initGenerate = () => {
        const token = getToken();
        
        if (!token || stepProgress < 2) {
            showError('Access denied. Complete verification first.');
            return;
        }

        if (isGeneratePageExpired()) {
            showExpiredPage();
            return;
        }

        updateProgress(2, 2);
        updateStepIndicator(2, 2);
        
        startCountdown();
        
        const existingKey = getGeneratedKey();
        if (existingKey) {
            showExistingKey(existingKey);
        } else {
            autoGenerateKey();
        }
    };

    const showExistingKey = (keyData) => {
        setBtnContinueVisible(false);
        setBtnCopyVisible(true);
        
        setStepIndicatorVisible(true);
        setStepIndicatorClass('success-message');
        setStepIndicatorText('Key Loaded');
        
        const keyExpiresDate = new Date(keyData.expires);
        const remainingKeyTime = Math.max(0, keyData.expires - Date.now());
        const keyHours = Math.floor(remainingKeyTime / (1000 * 60 * 60));
        const keyMinutes = Math.floor((remainingKeyTime % (1000 * 60 * 60)) / (1000 * 60));
        
        setCurrentKey(keyData.key);
        setOutput(`Your API Key: ${keyData.key}\n\nExpires: ${keyExpiresDate.toLocaleString()}\n\nStatus: ACTIVE (${keyHours}h ${keyMinutes}m remaining)\n\nRefresh Protection: Active`);
        setBtnCopyText('Copy Key');
        
        setOutputStyle({ border: '2px solid #f59e0b' });
        setTimeout(() => {
            setOutputStyle({ border: '1px solid rgba(75, 85, 99, 0.4)' });
        }, 3000);
    };

    const showExpiredPage = () => {
        setCountdownVisible(true);
        setBtnContinueVisible(false);
        setBtnCopyVisible(false);
        
        setStepIndicatorVisible(true);
        setStepIndicatorClass('expired-message pulse');
        setStepIndicatorText('Generate Page Access Expired');
        
        setOutput('Generate Key Access Expired\n\nThe 8-minute access window has expired.\n\nPlease complete verification steps again to generate a new key.');
        
        updateProgress(2, 2);
        setProgressStep('Step 2/2 - EXPIRED');
    };

    const autoGenerateKey = async () => {
        setBtnContinueVisible(false);
        setBtnCopyVisible(false);
        setStepIndicatorVisible(false);
        
        setOutput('Preparing your secure key...\n\nPlease wait...');
        
        try {
            const token = getToken();
            
            const response = await fetch('/api/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate key');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setCurrentKey(data.key);
                
                const keyData = {
                    key: data.key,
                    expires: data.expires || (Date.now() + 24 * 60 * 60 * 1000)
                };
                saveGeneratedKey(keyData);
                
                setStepIndicatorVisible(true);
                setStepIndicatorClass('success-message pulse');
                setStepIndicatorText('API Key Ready!');
                
                const expiresDate = new Date(keyData.expires);
                setOutput(`Your API Key: ${data.key}\n\nExpires: ${expiresDate.toLocaleString()}\n\nKey validated successfully!\n\nImportant: This key is valid for 24 hours.\n\nRefresh Protection: Active`);
                
                setBtnCopyVisible(true);
                setBtnCopyText('Copy API Key');
                
                setOutputStyle({ border: '2px solid #10b981' });
                setTimeout(() => {
                    setOutputStyle({ border: '1px solid rgba(75, 85, 99, 0.4)' });
                }, 2000);
            } else {
                throw new Error(data.error || 'Key generation failed');
            }
            
        } catch (error) {
            console.error('Key generation error:', error);
            
            setStepIndicatorClass('error-message pulse');
            setStepIndicatorText('Key Generation Failed');
            
            setOutput(`Error: ${error.message}\n\nThis might happen if:\n- Backend API is not deployed\n- Token has expired\n- Network connection issue\n- Server is temporarily unavailable\n\nPlease try starting the verification process again.`);
        }
    };

    const showError = (message) => {
        setStepIndicatorVisible(true);
        setStepIndicatorClass('error-message pulse');
        setStepIndicatorText('Error');
        
        setOutput(`Error: ${message}\n\nClick "Start Over" to begin verification.`);
        setBtnContinueText('Start Over');
        setBtnContinueClass('main-button');
    };

    // Event handlers
    const handleContinueClick = () => {
        setBtnContinueDisabled(true);
        setBtnContinueClass('main-button loading');
        
        switch(route) {
            case 'step1':
                setBtnContinueText('Redirecting...');
                const returnUrl1 = `${window.location.origin}/step1?completed=1`;
                window.location.href = `https://shrinkme.top/keyget?return=${encodeURIComponent(returnUrl1)}`;
                break;
            case 'step2':
                setBtnContinueText('Redirecting...');
                const returnUrl2 = `${window.location.origin}/step2?completed=2`;
                window.location.href = `https://en.shrinke.me/getkey2?return=${encodeURIComponent(returnUrl2)}`;
                break;
            case 'get-your-key':
                setBtnContinueText('Loading...');
                saveGenerateAccess();
                setTimeout(() => {
                    router.push(`/generate-key-secure-xyz?token=${getToken()}`);
                }, 800);
                break;
            default:
                setBtnContinueText('Redirecting...');
                const returnUrl = `${window.location.origin}/step1?completed=1`;
                window.location.href = `https://en.shrinke.me/scriptrblx?return=${encodeURIComponent(returnUrl)}`;
        }
    };

    const handleStartOver = () => {
        clearToken();
        router.push('/');
    };

    const handleCopyClick = async () => {
        if (!currentKey) return;
        
        try {
            await navigator.clipboard.writeText(currentKey);
            setBtnCopyText('Copied!');
            
            const originalText = output;
            setOutput(originalText + '\n\nAPI Key copied to clipboard!');
            
            setTimeout(() => {
                setOutput(originalText);
            }, 3000);
            
        } catch (error) {
            const textArea = document.createElement('textarea');
            textArea.value = currentKey;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                setBtnCopyText('Copied!');
            } catch (err) {
                setBtnCopyText('Copy Failed');
            }
            
            document.body.removeChild(textArea);
        }
        
        setTimeout(() => {
            setBtnCopyText(hasValidGeneratedKey() ? 'Copy Existing Key' : 'Copy API Key');
        }, 2000);
    };

    // Initialize based on route
    useEffect(() => {
        switch(route) {
            case 'step1':
                initStep1();
                break;
            case 'step2':  
                initStep2();
                break;
            case 'get-your-key':
                initGetKey();
                break;
            case 'generate-key-secure-xyz':
                initGenerate();
                break;
            default:
                initHome();
        }
    }, [route, stepProgress, tokenData]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, [countdownInterval]);

    return (
        <>
            <Head>
                <title>ClavnnX Key System</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <style jsx global>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
                    background: linear-gradient(135deg, #0f0f23, #1a1a3e, #0f0f23) !important;
                    min-height: 100vh;
                    color: #ffffff !important;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background-attachment: fixed;
                }

                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 20%, rgba(0, 150, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(0, 150, 255, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(0, 150, 255, 0.05) 0%, transparent 50%);
                    z-index: -1;
                }

                .main-container {
                    width: 100%;
                    max-width: 480px;
                    background: rgba(30, 30, 45, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    padding: 40px 30px;
                    position: relative;
                    overflow: hidden;
                }

                .main-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.5), transparent);
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .logo {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #0096ff, #00d4ff);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }

                .subtitle {
                    color: #9ca3af;
                    font-size: 16px;
                    font-weight: 400;
                    margin-bottom: 20px;
                }

                .progress-section {
                    margin-bottom: 30px;
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .progress-label {
                    color: #d1d5db;
                    font-size: 14px;
                    font-weight: 500;
                }

                .progress-step {
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 600;
                }

                .progress-bar-container {
                    width: 100%;
                    height: 8px;
                    background: rgba(55, 65, 81, 0.6);
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #0096ff, #00d4ff);
                    border-radius: 4px;
                    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .progress-bar::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .step-indicator {
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 16px;
                    text-align: center;
                    margin-bottom: 20px;
                    font-weight: 600;
                    font-size: 15px;
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
                }

                .main-button {
                    width: 100%;
                    padding: 16px 24px;
                    font-size: 16px;
                    font-weight: 600;
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    margin-bottom: 16px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    letter-spacing: 0.5px;
                    background: linear-gradient(135deg, #0096ff, #00d4ff);
                    color: white;
                    box-shadow: 0 8px 25px rgba(0, 150, 255, 0.3);
                }

                .main-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }

                .main-button:hover::before {
                    transform: translateX(100%);
                }

                .main-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(0, 150, 255, 0.4);
                }

                .main-button:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(0, 150, 255, 0.3);
                }

                .main-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .output-section {
                    margin-bottom: 20px;
                }

                .output {
                    background: rgba(17, 24, 39, 0.8);
                    border: 1px solid rgba(75, 85, 99, 0.4);
                    border-radius: 16px;
                    padding: 24px;
                    min-height: 120px;
                    font-family: 'Inter', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    white-space: pre-wrap;
                    word-break: break-all;
                    color: #e5e7eb;
                    position: relative;
                    backdrop-filter: blur(10px);
                }

                .output::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.3), transparent);
                }

                .loading {
                    opacity: 0.7;
                    pointer-events: none;
                    position: relative;
                }

                .loading::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 24px;
                    height: 24px;
                    margin: -12px 0 0 -12px;
                    border: 2px solid rgba(0, 150, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #0096ff;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .success-message {
                    background: linear-gradient(135deg, #10b981, #34d399);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 16px;
                    text-align: center;
                    margin-bottom: 16px;
                    font-weight: 600;
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
                }

                .error-message {
                    background: linear-gradient(135deg, #ef4444, #f87171);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 16px;
                    text-align: center;
                    margin-bottom: 16px;
                    font-weight: 600;
                    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
                }

                .expired-message {
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 16px;
                    text-align: center;
                    margin-bottom: 16px;
                    font-weight: 600;
                    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
                }

                .countdown-section {
                    background: rgba(17, 24, 39, 0.6);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                    margin-bottom: 20px;
                    backdrop-filter: blur(10px);
                }

                .countdown-title {
                    color: #ef4444;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                }

                .countdown-timer {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ef4444;
                    font-family: 'Courier New', monospace;
                }

                .discord-section {
                    margin-top: 30px;
                    background: rgba(17, 24, 39, 0.6);
                    border: 1px solid rgba(75, 85, 99, 0.3);
                    border-radius: 16px;
                    padding: 24px;
                    backdrop-filter: blur(10px);
                    text-align: center;
                }

                .discord-title {
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .discord-button {
                    background: linear-gradient(135deg, #5865F2, #7289DA);
                    color: white;
                    padding: 16px 32px;
                    font-size: 16px;
                    font-weight: 600;
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 25px rgba(88, 101, 242, 0.3);
                    text-decoration: none;
                    display: inline-block;
                    position: relative;
                    overflow: hidden;
                    letter-spacing: 0.5px;
                    width: 100%;
                    max-width: 280px;
                }

                .discord-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }

                .discord-button:hover::before {
                    transform: translateX(100%);
                }

                .discord-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(88, 101, 242, 0.4);
                }

                .discord-button:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);
                }

                .icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                }

                .pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .8;
                    }
                }

                .glow {
                    box-shadow: 0 0 20px rgba(0, 150, 255, 0.3);
                }

                @media (max-width: 600px) {
                    body {
                        padding: 15px;
                    }
                    
                    .main-container {
                        padding: 30px 24px;
                        border-radius: 20px;
                    }

                    .logo {
                        font-size: 28px;
                    }

                    .subtitle {
                        font-size: 14px;
                    }

                    .main-button {
                        padding: 14px 20px;
                        font-size: 15px;
                    }

                    .output {
                        padding: 20px;
                        min-height: 100px;
                        font-size: 13px;
                    }

                    .discord-section {
                        padding: 20px;
                    }

                    .discord-title {
                        font-size: 16px;
                    }

                    .discord-button {
                        padding: 14px 28px;
                        font-size: 15px;
                    }

                    .countdown-timer {
                        font-size: 20px;
                    }
                }
            `}</style>

            <div className="main-container">
                <div className="header">
                    <div className="logo">ClavnnX Key System</div>
                    <div className="subtitle">Secure Multi-Step Verification System</div>
                </div>

                <div className="progress-section">
                    <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-step">{progressStep}</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{width: progressBarWidth}}></div>
                    </div>
                </div>

                {stepIndicatorVisible && (
                    <div className={stepIndicatorClass}>
                        {stepIndicatorText}
                    </div>
                )}

                {countdownVisible && (
                    <div className="countdown-section">
                        <div className="countdown-title">Page Access Expired</div>
                        <div className="countdown-timer">{countdownTimer}</div>
                        <div style={{marginTop: '10px', color: '#9ca3af', fontSize: '14px'}}>
                            Please start verification again
                        </div>
                    </div>
                )}

                {btnContinueVisible && (
                    <button 
                        className={btnContinueClass}
                        onClick={route === 'home' || route === 'step1' || route === 'step2' || route === 'get-your-key' ? handleContinueClick : handleStartOver}
                        disabled={btnContinueDisabled}
                    >
                        {btnContinueText}
                    </button>
                )}

                <div className="output-section">
                    <div className="output" style={outputStyle}>
                        {output}
                    </div>
                </div>

                {btnCopyVisible && (
                    <button className="main-button" onClick={handleCopyClick}>
                        {btnCopyText}
                    </button>
                )}

                {route === 'generate-key-secure-xyz' && isGeneratePageExpired() && (
                    <button 
                        className="main-button" 
                        style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'}}
                        onClick={handleStartOver}
                    >
                        Start Over
                    </button>
                )}

                <div className="discord-section">
                    <div className="discord-title">
                        <span className="icon">💬</span>
                        Join Discord ClavnnX
                    </div>
                    <a href="https://discord.gg/QHPFGakSjN" target="_blank" rel="noopener noreferrer" className="discord-button">
                        Join
                    </a>
                </div>
            </div>
        </>
    );
            }
