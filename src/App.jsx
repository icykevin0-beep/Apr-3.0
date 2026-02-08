import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './config/queryClient'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Readings from './pages/Readings'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Pricing from './pages/Pricing'

function AppRoutes() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid rgba(255,255,255,0.3)',
                    borderTop: '5px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        )
    }

    return (
        <Routes>
            {/* Public route - Login */}
            <Route path="/" element={
                user ? <Navigate to="/dashboard" replace /> : <Login />
            } />
            {/* Public route - Pricing */}
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected routes - nested under Layout */}
            <Route element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/socios" element={<Members />} />
                <Route path="/lecturas" element={<Readings />} />
                <Route path="/facturacion" element={<Billing />} />
                <Route path="/configuracion" element={<Settings />} />
                <Route path="/usuarios" element={<Users />} />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
            {/* React Query DevTools - only in development */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}

export default App
