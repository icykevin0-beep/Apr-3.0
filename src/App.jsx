import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Readings from './pages/Readings'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Users from './pages/Users'

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="socios" element={<Members />} />
                <Route path="lecturas" element={<Readings />} />
                <Route path="facturacion" element={<Billing />} />
                <Route path="configuracion" element={<Settings />} />
                <Route path="usuarios" element={<Users />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )
}

export default App
