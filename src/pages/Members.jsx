import { useState, useEffect } from 'react'
import { db } from '../db/database'
import './Members.css'

export default function Members() {
    const [members, setMembers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [showModal, setShowModal] = useState(false)
    const [newMember, setNewMember] = useState({
        rut: '',
        nombre: '',
        direccion: '',
        medidor: '',
        telefono: '',
        email: ''
    })

    useEffect(() => {
        loadMembers()
    }, [])

    async function loadMembers() {
        try {
            const socios = await db.socios.toArray()
            setMembers(socios)
        } catch (error) {
            console.error('Error loading members:', error)
        }
    }

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.direccion?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterStatus === 'todos' || member.estado === filterStatus

        return matchesSearch && matchesFilter
    })

    const stats = {
        total: members.length,
        activos: members.filter(m => m.estado === 'activo').length,
        morosos: members.filter(m => m.estado === 'moroso').length,
        inactivos: members.filter(m => m.estado === 'inactivo').length
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await db.socios.add({
                ...newMember,
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            })
            setShowModal(false)
            setNewMember({ rut: '', nombre: '', direccion: '', medidor: '', telefono: '', email: '' })
            loadMembers()
        } catch (error) {
            console.error('Error adding member:', error)
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'activo':
                return <span className="status-badge active"><span className="status-dot"></span>Activo</span>
            case 'moroso':
                return <span className="status-badge overdue"><span className="status-dot"></span>Moroso</span>
            case 'inactivo':
                return <span className="status-badge inactive"><span className="status-dot"></span>Inactivo</span>
            default:
                return <span className="status-badge">{status}</span>
        }
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
                            <option value="activo">Activos</option>
                            <option value="moroso">Morosos</option>
                            <option value="inactivo">Inactivos</option>
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
                                            <div className="avatar">{getInitials(member.nombre)}</div>
                                            <div className="member-info">
                                                <span className="member-name">{member.nombre}</span>
                                                <span className="member-email">{member.email || 'Sin email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-muted">{member.direccion}</td>
                                    <td className="font-mono text-cyan">{member.medidor}</td>
                                    <td className="center">{getStatusBadge(member.estado)}</td>
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
                                            value={newMember.nombre}
                                            onChange={e => setNewMember({ ...newMember, nombre: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Dirección</label>
                                        <input
                                            type="text"
                                            placeholder="Av. Principal 123"
                                            value={newMember.direccion}
                                            onChange={e => setNewMember({ ...newMember, direccion: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Número de Medidor</label>
                                        <input
                                            type="text"
                                            placeholder="MED-001"
                                            value={newMember.medidor}
                                            onChange={e => setNewMember({ ...newMember, medidor: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            placeholder="+56 9 1234 5678"
                                            value={newMember.telefono}
                                            onChange={e => setNewMember({ ...newMember, telefono: e.target.value })}
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
                                <button type="submit" className="btn-primary">
                                    <span className="material-symbols-outlined">save</span>
                                    Guardar Socio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
