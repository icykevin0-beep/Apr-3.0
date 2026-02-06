import { useState, useEffect } from 'react'
import { db } from '../db/database'
import './Readings.css'

export default function Readings() {
    const [readings, setReadings] = useState([])
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState(null)
    const [showPanel, setShowPanel] = useState(false)
    const [formData, setFormData] = useState({
        lecturaActual: '',
        observacion: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const socios = await db.socios.toArray()
            const lecturas = await db.lecturas.toArray()
            setMembers(socios)
            setReadings(lecturas)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    const pendingMembers = members.filter(m => m.estado === 'activo')

    const stats = {
        total: members.filter(m => m.estado === 'activo').length,
        registradas: readings.length,
        pendientes: Math.max(0, members.filter(m => m.estado === 'activo').length - readings.length),
        porcentaje: members.length > 0 ? Math.round((readings.length / members.filter(m => m.estado === 'activo').length) * 100) : 0
    }

    const handleSelectMember = (member) => {
        setSelectedMember(member)
        setFormData({ lecturaActual: '', observacion: '' })
        setShowPanel(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedMember) return

        try {
            const lastReading = await db.lecturas
                .where('socioId')
                .equals(selectedMember.id)
                .last()

            const lecturaAnterior = lastReading?.lecturaActual || 0
            const lecturaActual = parseInt(formData.lecturaActual) || 0
            const consumo = Math.max(0, lecturaActual - lecturaAnterior)

            await db.lecturas.add({
                socioId: selectedMember.id,
                medidor: selectedMember.medidor,
                lecturaAnterior,
                lecturaActual,
                consumo,
                fecha: new Date().toISOString(),
                registradoPor: 'Admin',
                observacion: formData.observacion
            })

            setShowPanel(false)
            setSelectedMember(null)
            loadData()
        } catch (error) {
            console.error('Error saving reading:', error)
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    return (
        <div className="readings-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-emoji">📋</span>
                        Registro de Lecturas
                    </h1>
                    <p className="page-subtitle">Ingresa las lecturas mensuales de los medidores</p>
                </div>
                <div className="header-actions">
                    <div className="period-badge">
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span>Febrero 2026</span>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="progress-section glass-panel">
                <div className="progress-header">
                    <h3>Progreso del Mes</h3>
                    <span className="progress-percentage">{stats.porcentaje}%</span>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${stats.porcentaje}%` }}></div>
                </div>
                <div className="progress-stats">
                    <div className="progress-stat">
                        <span className="stat-number blue">{stats.registradas}</span>
                        <span className="stat-label">Registradas</span>
                    </div>
                    <div className="progress-stat">
                        <span className="stat-number amber">{stats.pendientes}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                    <div className="progress-stat">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper emerald">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.registradas}</span>
                        <span className="stat-label">Lecturas Registradas</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper amber">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.pendientes}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">
                        <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">
                            {readings.reduce((sum, r) => sum + (r.consumo || 0), 0)} m³
                        </span>
                        <span className="stat-label">Consumo Total</span>
                    </div>
                </div>
            </div>

            {/* Pending Readings List */}
            <div className="readings-section">
                <div className="section-header">
                    <h3>Socios Pendientes de Lectura</h3>
                    <span className="count-badge">{pendingMembers.length}</span>
                </div>
                <div className="table-container glass-panel">
                    <table>
                        <thead>
                            <tr>
                                <th>Socio</th>
                                <th>Medidor</th>
                                <th>Dirección</th>
                                <th>Última Lectura</th>
                                <th className="right">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingMembers.map(member => {
                                const lastReading = readings.find(r => r.socioId === member.id)
                                return (
                                    <tr key={member.id} className="table-row">
                                        <td>
                                            <div className="member-cell">
                                                <div className="avatar">{getInitials(member.nombre)}</div>
                                                <div className="member-info">
                                                    <span className="member-name">{member.nombre}</span>
                                                    <span className="member-rut">{member.rut}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="font-mono text-cyan">{member.medidor}</td>
                                        <td className="text-muted">{member.direccion}</td>
                                        <td>
                                            {lastReading ? (
                                                <div className="last-reading">
                                                    <span className="reading-value">{lastReading.lecturaActual} m³</span>
                                                    <span className="reading-date">
                                                        {new Date(lastReading.fecha).toLocaleDateString('es-CL')}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted">Sin registro</span>
                                            )}
                                        </td>
                                        <td className="right">
                                            <button
                                                className="register-btn"
                                                onClick={() => handleSelectMember(member)}
                                            >
                                                <span className="material-symbols-outlined">edit_note</span>
                                                Registrar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slide-Over Panel */}
            {showPanel && (
                <div className="slide-panel-overlay" onClick={() => setShowPanel(false)}>
                    <div className="slide-panel" onClick={e => e.stopPropagation()}>
                        <div className="panel-header">
                            <div className="panel-title-section">
                                <div className="panel-icon">
                                    <span className="material-symbols-outlined">speed</span>
                                </div>
                                <div>
                                    <h3 className="panel-title">Registrar Lectura</h3>
                                    <p className="panel-subtitle">{selectedMember?.nombre}</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setShowPanel(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="panel-body">
                                {/* Member Info Card */}
                                <div className="info-card">
                                    <div className="info-row">
                                        <span className="material-symbols-outlined">badge</span>
                                        <div>
                                            <span className="info-label">RUT</span>
                                            <span className="info-value">{selectedMember?.rut}</span>
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <span className="material-symbols-outlined">speed</span>
                                        <div>
                                            <span className="info-label">Medidor</span>
                                            <span className="info-value text-cyan">{selectedMember?.medidor}</span>
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <div>
                                            <span className="info-label">Dirección</span>
                                            <span className="info-value">{selectedMember?.direccion}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reading Form */}
                                <div className="form-section">
                                    <div className="form-group">
                                        <label>Lectura Actual (m³)</label>
                                        <div className="input-wrapper">
                                            <span className="material-symbols-outlined">straighten</span>
                                            <input
                                                type="number"
                                                placeholder="Ej: 1250"
                                                value={formData.lecturaActual}
                                                onChange={e => setFormData({ ...formData, lecturaActual: e.target.value })}
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Observaciones (opcional)</label>
                                        <textarea
                                            placeholder="Agregar notas sobre el medidor..."
                                            value={formData.observacion}
                                            onChange={e => setFormData({ ...formData, observacion: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    {/* Consumption Preview */}
                                    {formData.lecturaActual && (
                                        <div className="consumption-preview">
                                            <span className="preview-label">Consumo Estimado</span>
                                            <span className="preview-value">
                                                {Math.max(0, parseInt(formData.lecturaActual) - 0)} m³
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="panel-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowPanel(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    <span className="material-symbols-outlined">save</span>
                                    Guardar Lectura
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
