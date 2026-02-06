import { useState } from 'react'
import './Users.css'

export default function Users() {
    const [users, setUsers] = useState([
        { id: 1, nombre: 'Pedro González', email: 'pedro.g@lumina.apr', rol: 'Administrador', estado: 'activo', ultimoAcceso: 'Hace 10 min' },
        { id: 2, nombre: 'Ana Morales', email: 'ana.m@lumina.apr', rol: 'Secretaría', estado: 'activo', ultimoAcceso: 'Ayer' },
        { id: 3, nombre: 'Carlos Ruiz', email: 'carlos.r@lumina.apr', rol: 'Operador', estado: 'inactivo', ultimoAcceso: 'Hace 5 días' },
    ])

    const [showModal, setShowModal] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)

    const stats = {
        admins: users.filter(u => u.rol === 'Administrador').length,
        secretarias: users.filter(u => u.rol === 'Secretaría').length,
        operadores: users.filter(u => u.rol === 'Operador').length
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    const getRoleBadge = (rol) => {
        switch (rol) {
            case 'Administrador':
                return <span className="role-badge admin">{rol}</span>
            case 'Secretaría':
                return <span className="role-badge secretary">{rol}</span>
            case 'Operador':
                return <span className="role-badge operator">{rol}</span>
            default:
                return <span className="role-badge">{rol}</span>
        }
    }

    const openPermissionsModal = (role) => {
        setSelectedRole(role)
        setShowModal(true)
    }

    return (
        <div className="users-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="material-symbols-outlined title-icon">groups</span>
                        Gestión de Usuarios y Roles
                    </h1>
                    <p className="page-subtitle">Administra el acceso y los permisos de la organización</p>
                </div>
                <button className="btn-primary">
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Usuario
                </button>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon purple">
                            <span className="material-symbols-outlined">admin_panel_settings</span>
                        </div>
                        <span className="stat-value">{stats.admins}</span>
                    </div>
                    <div className="stat-body">
                        <h3>Administradores</h3>
                        <p>Acceso total al sistema</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon blue">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <span className="stat-value">{stats.secretarias}</span>
                    </div>
                    <div className="stat-body">
                        <h3>Administrativos</h3>
                        <p>Acceso de edición y gestión</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon green">
                            <span className="material-symbols-outlined">visibility</span>
                        </div>
                        <span className="stat-value">{stats.operadores}</span>
                    </div>
                    <div className="stat-body">
                        <h3>Operadores</h3>
                        <p>Lectura y escritura de medidores</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-section">
                <h3 className="section-title">Usuarios del Sistema</h3>
                <div className="table-container glass-panel">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Último Acceso</th>
                                <th className="right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="table-row">
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar">{getInitials(user.nombre)}</div>
                                            <div className="user-info">
                                                <span className="user-name">{user.nombre}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{getRoleBadge(user.rol)}</td>
                                    <td>
                                        <div className="status-indicator">
                                            <span className={`status-dot ${user.estado}`}></span>
                                            <span className={`status-text ${user.estado}`}>
                                                {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-muted">{user.ultimoAcceso}</td>
                                    <td className="right">
                                        <button
                                            className="edit-link"
                                            onClick={() => openPermissionsModal(user.rol)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Permissions Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <div className="modal-icon">
                                    <span className="material-symbols-outlined">verified_user</span>
                                </div>
                                <div>
                                    <h3 className="modal-title">Permisos de Rol</h3>
                                    <span className="modal-role">{selectedRole}</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <p className="modal-desc">Configure los niveles de acceso para este rol por cada módulo del sistema.</p>

                            <div className="permissions-table">
                                <div className="permissions-header">
                                    <span>Módulo</span>
                                    <span className="center">Ver</span>
                                    <span className="center">Editar</span>
                                    <span className="center danger">Eliminar</span>
                                </div>

                                <div className="permissions-rows">
                                    <div className="permission-row">
                                        <div className="module-name">
                                            <span className="material-symbols-outlined">group</span>
                                            Socios
                                        </div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" disabled /></div>
                                    </div>

                                    <div className="permission-row">
                                        <div className="module-name">
                                            <span className="material-symbols-outlined">water_drop</span>
                                            Lecturas
                                        </div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" disabled /></div>
                                    </div>

                                    <div className="permission-row">
                                        <div className="module-name">
                                            <span className="material-symbols-outlined">payments</span>
                                            Pagos
                                        </div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" disabled /></div>
                                    </div>

                                    <div className="permission-row">
                                        <div className="module-name">
                                            <span className="material-symbols-outlined">settings</span>
                                            Config.
                                        </div>
                                        <div className="center"><input type="checkbox" defaultChecked /></div>
                                        <div className="center"><input type="checkbox" /></div>
                                        <div className="center"><input type="checkbox" disabled /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={() => setShowModal(false)}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
