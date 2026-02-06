import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for stored session
        const storedUser = localStorage.getItem('lumina_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email, password) => {
        // Demo authentication - in production, connect to real backend
        if (email && password) {
            const userData = {
                id: 1,
                email,
                name: 'Admin Usuario',
                role: 'admin',
                aprName: 'APR Villa Los Aromos'
            }
            setUser(userData)
            localStorage.setItem('lumina_user', JSON.stringify(userData))
            return { success: true }
        }
        return { success: false, error: 'Credenciales inválidas' }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('lumina_user')
    }

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh' }}>
                <div className="animate-pulse">
                    <span className="material-icons icon-xl" style={{ color: 'var(--color-primary)' }}>
                        water_drop
                    </span>
                </div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
