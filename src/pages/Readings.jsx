import { useState, useMemo } from 'react'
import { useMembers } from '../hooks/useMembers'
import { useReadings, useCreateReading } from '../hooks/useReadings'
import './Readings.css'

export default function Readings() {
    const { data: members = [], isLoading: loadingMembers } = useMembers()
    const { data: readings = [], isLoading: loadingReadings } = useReadings()
    const createReading = useCreateReading()

    const [selectedMember, setSelectedMember] = useState(null)
    const [showPanel, setShowPanel] = useState(false)
    const [formData, setFormData] = useState({
        current_reading: '',
        notes: ''
    })

    const activeMembers = useMemo(() =>
        members.filter(m => m.status === 'active'),
        [members]
    )

    const stats = useMemo(() => {
        const total = activeMembers.length
        const registered = readings.length
        const pending = Math.max(0, total - registered)
        const percentage = total > 0 ? Math.round((registered / total) * 100) : 0

        return { total, registered, pending, percentage }
    }, [activeMembers, readings])

    const handleSelectMember = (member) => {
        setSelectedMember(member)
        setFormData({ current_reading: '', notes: '' })
        setShowPanel(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedMember) return

        try {
            // Find last reading for this member
            const memberReadings = readings.filter(r => r.member_id === selectedMember.id)
            const lastReading = memberReadings.sort((a, b) =>
                new Date(b.reading_date) - new Date(a.reading_date)
            )[0]

            const previousReading = lastReading?.current_reading || 0
            const currentReading = parseInt(formData.current_reading) || 0
            const consumption = Math.max(0, currentReading - previousReading)

            await createReading.mutateAsync({
                member_id: selectedMember.id,
                previous_reading: previousReading,
                current_reading: currentReading,
                consumption: consumption,
                reading_date: new Date().toISOString(),
                recorded_by: 'Admin',
                notes: formData.notes
            })

            setShowPanel(false)
            setSelectedMember(null)
            alert('✅ Lectura registrada correctamente')
        } catch (error) {
            console.error('Error saving reading:', error)
            alert('❌ Error al registrar lectura: ' + error.message)
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    const isLoading = loadingMembers || loadingReadings

    if (isLoading) {
        return (
            <div className="readings-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Cargando lecturas...</p>
                </div>
            </div>
        )
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
                    <span className="progress-percentage">{stats.percentage}%</span>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${stats.percentage}%` }}></div>
                </div>
                <div className="progress-stats">
                    <div className="progress-stat">
                        <span className="stat-number blue">{stats.registered}</span>
                        <span className="stat-label">Registradas</span>
                    </div>
                    <div className="progress-stat">
                        <span className="stat-number amber">{stats.pending}</span>
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
                        <span className="stat-value">{stats.registered}</span>
                        <span className="stat-label">Lecturas Registradas</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper amber">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">
                        <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">
                            {readings.reduce((sum, r) => sum + (r.consumption || 0), 0)} m³
                        </span>
                        <span className="stat-label">Consumo Total</span>
                    </div>
                </div>
            </div>

            {/* Pending Readings List */}
            <div className="readings-section">
                <div className="section-header">
                    <h3>Socios Pendientes de Lectura</h3>
                    <span className="count-badge">{activeMembers.length}</span>
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
                            {activeMembers.map(member => {
                                const lastReading = readings
                                    .filter(r => r.member_id === member.id)
                                    .sort((a, b) => new Date(b.reading_date) - new Date(a.reading_date))[0]

                                return (
                                    <tr key={member.id} className="table-row">
                                        <td>
                                            <div className="member-cell">
                                                <div className="avatar">{getInitials(member.name)}</div>
                                                <div className="member-info">
                                                    <span className="member-name">{member.name}</span>
                                                    <span className="member-rut">{member.rut}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="font-mono text-cyan">{member.meter_number}</td>
                                        <td className="text-muted">{member.address}</td>
                                        <td>
                                            {lastReading ? (
                                                <div className="last-reading">
                                                    <span className="reading-value">{lastReading.current_reading} m³</span>
                                                    <span className="reading-date">
                                                        {new Date(lastReading.reading_date).toLocaleDateString('es-CL')}
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
                                    <p className="panel-subtitle">{selectedMember?.name}</p>
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
                                            <span className="info-value text-cyan">{selectedMember?.meter_number}</span>
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <div>
                                            <span className="info-label">Dirección</span>
                                            <span className="info-value">{selectedMember?.address}</span>
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
                                                value={formData.current_reading}
                                                onChange={e => setFormData({ ...formData, current_reading: e.target.value })}
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Observaciones (opcional)</label>
                                        <textarea
                                            placeholder="Agregar notas sobre el medidor..."
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    {/* Consumption Preview */}
                                    {formData.current_reading && (
                                        <div className="consumption-preview">
                                            <span className="preview-label">Consumo Estimado</span>
                                            <span className="preview-value">
                                                {Math.max(0, parseInt(formData.current_reading) - 0)} m³
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="panel-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowPanel(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={createReading.isPending}>
                                    <span className="material-symbols-outlined">save</span>
                                    {createReading.isPending ? 'Guardando...' : 'Guardar Lectura'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
