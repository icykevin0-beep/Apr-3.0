import { useMemo } from 'react'
import { useMembers } from '../hooks/useMembers'
import { useReadings } from '../hooks/useReadings'
import { useInvoices } from '../hooks/useBilling'
import './Dashboard.css'

export default function Dashboard() {
    // Fetch data from Supabase using React Query
    const { data: members = [], isLoading: loadingMembers } = useMembers()
    const { data: readings = [], isLoading: loadingReadings } = useReadings()
    const { data: invoices = [], isLoading: loadingInvoices } = useInvoices()

    // Calculate stats from real data
    const stats = useMemo(() => {
        const totalConsumo = readings.reduce((sum, r) => sum + (r.consumption || 0), 0)
        const paidInvoices = invoices.filter(inv => inv.status === 'paid')
        const totalRecaudacion = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
        const activeMembers = members.filter(m => m.status === 'active').length

        return {
            totalSocios: members.length,
            consumoMensual: totalConsumo,
            recaudacion: totalRecaudacion,
            lecturasPendientes: Math.max(0, activeMembers - readings.length)
        }
    }, [members, readings, invoices])

    // Generate recent activities from all data
    const activities = useMemo(() => {
        const allActivities = []

        // Recent members
        members
            .filter(m => m.created_at)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .forEach(member => {
                allActivities.push({
                    id: `member-${member.id}`,
                    type: 'member',
                    user: 'Admin',
                    action: 'agregó nuevo socio',
                    amount: member.name,
                    timestamp: new Date(member.created_at),
                    time: getRelativeTime(new Date(member.created_at))
                })
            })

        // Recent readings
        readings
            .filter(r => r.reading_date)
            .sort((a, b) => new Date(b.reading_date) - new Date(a.reading_date))
            .slice(0, 5)
            .forEach(reading => {
                allActivities.push({
                    id: `reading-${reading.id}`,
                    type: 'reading',
                    user: reading.member?.name || 'Usuario',
                    action: 'registró lectura',
                    amount: `${reading.consumption || 0} m³`,
                    timestamp: new Date(reading.reading_date),
                    time: getRelativeTime(new Date(reading.reading_date))
                })
            })

        // Recent paid invoices
        invoices
            .filter(inv => inv.status === 'paid' && inv.paid_at)
            .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
            .slice(0, 5)
            .forEach(invoice => {
                allActivities.push({
                    id: `payment-${invoice.id}`,
                    type: 'payment',
                    user: invoice.member?.name || 'Usuario',
                    action: 'realizó un pago',
                    amount: `$${(invoice.amount || 0).toLocaleString()}`,
                    timestamp: new Date(invoice.paid_at),
                    time: getRelativeTime(new Date(invoice.paid_at))
                })
            })

        // Sort by most recent and take top 10
        return allActivities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
    }, [members, readings, invoices])

    function getRelativeTime(date) {
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Justo ahora'
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
        if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
        return date.toLocaleDateString('es-CL')
    }

    const getActivityIcon = (type) => {
        switch (type) {
            case 'payment': return 'payments'
            case 'reading': return 'speed'
            case 'member': return 'person_add'
            case 'alert': return 'warning'
            default: return 'info'
        }
    }

    const getActivityColor = (type) => {
        switch (type) {
            case 'payment': return 'emerald'
            case 'reading': return 'blue'
            case 'member': return 'purple'
            case 'alert': return 'amber'
            default: return 'slate'
        }
    }

    // Loading state
    const isLoading = loadingMembers || loadingReadings || loadingInvoices
    if (isLoading) {
        return (
            <div className="dashboard">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Cargando dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-emoji">📊</span>
                        Dashboard
                    </h1>
                    <p className="page-subtitle">Resumen general del sistema de agua potable rural</p>
                </div>
                <div className="header-actions">
                    <div className="period-selector">
                        <span className="material-symbols-outlined">calendar_month</span>
                        <select defaultValue="febrero">
                            <option value="febrero">Febrero 2026</option>
                            <option value="enero">Enero 2026</option>
                            <option value="diciembre">Diciembre 2025</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* KPI Stats Cards */}
            <div className="stats-grid">
                {/* Total Socios */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg blue">
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Socios</span>
                        <span className="stat-value">{stats.totalSocios}</span>
                        <div className="stat-trend positive">
                            <span className="material-symbols-outlined">arrow_upward</span>
                            <span>+12% vs mes anterior</span>
                        </div>
                    </div>
                </div>

                {/* Consumo Mensual */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg cyan">
                        <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Consumo Mensual</span>
                        <span className="stat-value">{stats.consumoMensual.toLocaleString()} m³</span>
                        <div className="stat-trend positive">
                            <span className="material-symbols-outlined">arrow_upward</span>
                            <span>+5% vs mes anterior</span>
                        </div>
                    </div>
                </div>

                {/* Recaudación */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg emerald">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Recaudación</span>
                        <span className="stat-value">${stats.recaudacion.toLocaleString()}</span>
                        <div className="stat-trend positive">
                            <span className="material-symbols-outlined">arrow_upward</span>
                            <span>+18% vs mes anterior</span>
                        </div>
                    </div>
                </div>

                {/* Lecturas Pendientes */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg amber">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Lecturas Pendientes</span>
                        <span className="stat-value">{stats.lecturasPendientes}</span>
                        <div className="stat-trend neutral">
                            <span className="material-symbols-outlined">schedule</span>
                            <span>En proceso</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content">
                {/* Activity Feed */}
                <div className="activity-panel glass-panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <span className="material-symbols-outlined">history</span>
                            <h2>Actividad Reciente</h2>
                        </div>
                        <button className="view-all-btn">
                            Ver todo
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                    <div className="activity-list">
                        {activities.length === 0 ? (
                            <div className="empty-state">
                                <span className="material-symbols-outlined">inbox</span>
                                <p>No hay actividad reciente</p>
                            </div>
                        ) : (
                            activities.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                                        <span className="material-symbols-outlined">{getActivityIcon(activity.type)}</span>
                                    </div>
                                    <div className="activity-info">
                                        <p className="activity-text">
                                            <span className="user-name">{activity.user}</span>
                                            <span className="action-text"> {activity.action}</span>
                                        </p>
                                        <p className="activity-meta">
                                            <span className="amount">{activity.amount}</span>
                                            <span className="time">{activity.time}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="actions-panel glass-panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <span className="material-symbols-outlined">bolt</span>
                            <h2>Acciones Rápidas</h2>
                        </div>
                    </div>
                    <div className="actions-grid">
                        <button className="action-card blue">
                            <span className="material-symbols-outlined">person_add</span>
                            <span>Nuevo Socio</span>
                        </button>
                        <button className="action-card cyan">
                            <span className="material-symbols-outlined">upload</span>
                            <span>Importar Lecturas</span>
                        </button>
                        <button className="action-card emerald">
                            <span className="material-symbols-outlined">receipt_long</span>
                            <span>Generar Boletas</span>
                        </button>
                        <button className="action-card purple">
                            <span className="material-symbols-outlined">analytics</span>
                            <span>Ver Reportes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
