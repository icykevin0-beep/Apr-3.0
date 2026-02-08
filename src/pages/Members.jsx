import { useState } from 'react'
import { useMembers, useCreateMember } from '../hooks/useMembers'
import './Members.css'

export default function Members() {
    // React Query hooks
    const { data: members = [], isLoading, error } = useMembers()
    const createMember = useCreateMember()

    // Local state for UI
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [showModal, setShowModal] = useState(false)
    const [newMember, setNewMember] = useState({
        rut: '',
        name: '',
        address: '',
        meter_number: '',
        phone: '',
        email: ''
    })

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.address?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterStatus === 'todos' || member.status === filterStatus

        return matchesSearch && matchesFilter
    })

    const stats = {
        total: members.length,
        activos: members.filter(m => m.status === 'active').length,
        morosos: members.filter(m => m.status === 'overdue').length,
        inactivos: members.filter(m => m.status === 'inactive').length
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await createMember.mutateAsync({
                rut: newMember.rut,
                name: newMember.name,
                address: newMember.address,
                meter_number: newMember.meter_number,
                phone: newMember.phone,
                email: newMember.email,
                status: 'active'
            })

            setShowModal(false)
            setNewMember({ rut: '', name: '', address: '', meter_number: '', phone: '', email: '' })
            alert('✅ Socio agregado correctamente')
        } catch (error) {
            console.error('❌ Error adding member:', error)
            alert('❌ Error al agregar socio: ' + error.message)
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="status-badge active"><span className="status-dot"></span>Activo</span>
            case 'overdue':
                return <span className="status-badge overdue"><span className="status-dot"></span>Moroso</span>
            case 'inactive':
                return <span className="status-badge inactive"><span className="status-dot"></span>Inactivo</span>
            default:
                return <span className="status-badge">{status}</span>
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="members-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Cargando socios...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="members-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <p>Error al cargar socios: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="members-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-emoji">👥</span>
                        Gestión de Socios
                    </h1>
                    <p className="page-subtitle">Administra los socios del sistema de agua potable</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary">
                        <span className="material-symbols-outlined">download</span>
                        Exportar
                    </button>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <span className="material-symbols-outlined">add_circle</span>
                        Nuevo Socio
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Socios</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon emerald">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.activos}</span>
                        <span className="stat-label">Activos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.morosos}</span>
                        <span className="stat-label">Morosos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon slate">
                        <span className="material-symbols-outlined">person_off</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.inactivos}</span>
                        <span className="stat-label">Inactivos</span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="toolbar">
                <div className="search-box">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por RUT, nombre o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <div className="filter-select">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="todos">Estado: Todos</option>
                            <option value="active">Activos</option>
                            <option value="overdue">Morosos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container glass-panel">
                <div className="table-info">
                    <span className="info-text">
                        Mostrando <strong>{filteredMembers.length}</strong> de <strong>{members.length}</strong> socios
                    </span>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>RUT</th>
                                <th>Socio</th>
                                <th>Dirección</th>
                                <th>Medidor</th>
                                <th className="center">Estado</th>
                                <th className="right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map(member => (
                                <tr key={member.id} className="table-row">
                                    <td className="font-mono">{member.rut}</td>
                                    <td>
                                        <div className="member-cell">
                                            <div className="avatar">{getInitials(member.name)}</div>
                                            <div className="member-info">
                                                <span className="member-name">{member.name}</span>
                                                <span className="member-email">{member.email || 'Sin email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-muted">{member.address}</td>
                                    <td className="font-mono text-cyan">{member.meter_number}</td>
                                    <td className="center">{getStatusBadge(member.status)}</td>
                                    <td className="right">
                                        <div className="row-actions">
                                            <button className="action-btn" title="Ver detalle">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                            <button className="action-btn" title="Editar">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="action-btn delete" title="Eliminar">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <div className="modal-icon">
                                    <span className="material-symbols-outlined">person_add</span>
                                </div>
                                <div>
                                    <h3 className="modal-title">Nuevo Socio</h3>
                                    <p className="modal-subtitle">Ingresa los datos del nuevo socio</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>RUT</label>
                                        <input
                                            type="text"
                                            placeholder="12.345.678-9"
                                            value={newMember.rut}
                                            onChange={e => setNewMember({ ...newMember, rut: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Nombre Completo</label>
                                        <input
                                            type="text"
                                            placeholder="Juan Pérez"
                                            value={newMember.name}
                                            onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Dirección</label>
                                        <input
                                            type="text"
                                            placeholder="Av. Principal 123"
                                            value={newMember.address}
                                            onChange={e => setNewMember({ ...newMember, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Número de Medidor</label>
                                        <input
                                            type="text"
                                            placeholder="MED-001"
                                            value={newMember.meter_number}
                                            onChange={e => setNewMember({ ...newMember, meter_number: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            placeholder="+56 9 1234 5678"
                                            value={newMember.phone}
                                            onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Email (opcional)</label>
                                        <input
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            value={newMember.email}
                                            onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={createMember.isPending}>
                                    <span className="material-symbols-outlined">save</span>
                                    {createMember.isPending ? 'Guardando...' : 'Guardar Socio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
