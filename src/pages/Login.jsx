import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { user, signInWithGoogle } = useAuth()
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError('')

        try {
            await signInWithGoogle()
        } catch (err) {
            setError('Error al iniciar sesión con Google. Por favor intenta nuevamente.')
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            {/* Left Side: Login Form */}
            <div className="login-left">
                {/* Abstract decorations */}
                <div className="login-decorations">
                    <div className="decoration-blob top"></div>
                    <div className="decoration-blob bottom"></div>
                </div>

                {/* Glass Card */}
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <div className="login-logo">
                            <span className="material-symbols-outlined">water_drop</span>
                        </div>
                        <h1>Lumina APR</h1>
                        <p>Sistema de Gestión de Agua Potable Rural</p>
                    </div>

                    {/* Error Message */}
                    {error && <div className="login-error">{error}</div>}

                    {/* Google Login Button */}
                    <div className="google-login-section">
                        <button
                            className="google-login-btn"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <svg className="google-icon" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>{loading ? 'Iniciando sesión...' : 'Continuar con Google'}</span>
                        </button>
                        <p className="google-info">
                            Usa tu cuenta de Google para acceder de forma segura
                        </p>
                    </div>

                    {/* Footer Text */}
                    <div className="login-footer">
                        <p className="copyright">© 2026 Lumina APR. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual Image (Desktop only) */}
            <div className="login-right">
                <div
                    className="login-image"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVweetBdOd7Rb4C2tlsQ5MZnBDFPMftFGCmTsdati9WagZAWka-wE6Sq9vp9mxGD5VGejvXGNLdFuiYOb67qUhPQ4fVnPuN7l-6YAeMY1WVcnEv8DwatcuPgl57qk9Xj4vkROI62YIyO66hpTPiakIJQA1ryy2-zmnR3fKEABEDr7-vVDvWyUl-Hnv-NxF5moXlGtHQgYr-k2bQPt2y6Q_5I1zwZ-fRAY5jE8qA-WpzDHLhkkJyuFO4V45AmT6GhokBgSFKCRj9O4")' }}
                ></div>
                <div className="login-overlay gradient"></div>
                <div className="login-overlay primary"></div>

                <div className="login-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            <span>Plataforma Segura</span>
                        </div>
                        <h2>
                            Gestiona tu APR <br />
                            <span className="gradient-text">de forma inteligente</span>
                        </h2>
                        <p>
                            Controla el consumo, facturación y mantenimiento de tu red de agua potable rural en una sola plataforma unificada y moderna.
                        </p>

                        {/* Feature pills */}
                        <div className="hero-features">
                            <div className="feature-pill">
                                <span className="material-symbols-outlined">monitoring</span>
                                <span>Monitoreo Real</span>
                            </div>
                            <div className="feature-pill">
                                <span className="material-symbols-outlined">payments</span>
                                <span>Pagos Fáciles</span>
                            </div>
                            <div className="feature-pill">
                                <span className="material-symbols-outlined">cloud_sync</span>
                                <span>100% Nube</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
