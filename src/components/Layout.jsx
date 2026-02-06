import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/socios', icon: 'group', label: 'Socios' },
    { path: '/lecturas', icon: 'speed', label: 'Lecturas' },
    { path: '/facturacion', icon: 'receipt_long', label: 'Facturación' },
    { path: '/usuarios', icon: 'manage_accounts', label: 'Usuarios' },
    { path: '/configuracion', icon: 'settings', label: 'Configuración' },
]

export default function Layout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="material-symbols-outlined logo-icon">water_drop</span>
                    <div className="logo-text">
                        <h1>Lumina APR</h1>
                        <span>Gestión Rural</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name || 'Usuario'}</span>
                            <span className="user-email">{user?.email || ''}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
