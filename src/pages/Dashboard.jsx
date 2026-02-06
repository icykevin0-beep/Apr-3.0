import { useState, useEffect } from 'react'
import { db } from '../db/database'
import './Dashboard.css'

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalSocios: 0,
        consumoMensual: 0,
        recaudacion: 0,
        lecturasPendientes: 0
    })
    const [activities, setActivities] = useState([])

    useEffect(() => {
        async function loadData() {
            try {
                const socios = await db.socios.count()
                const lecturas = await db.lecturas.toArray()
                const boletas = await db.boletas.toArray()

                const totalConsumo = lecturas.reduce((sum, l) => sum + (l.consumo || 0), 0)
                const totalRecaudacion = boletas
                    .filter(b => b.estado === 'pagado')
                    .reduce((sum, b) => sum + b.monto, 0)
                const pendientes = await db.socios.filter(s => s.estado === 'activo').count()

                setStats({
                    totalSocios: socios,
                    consumoMensual: totalConsumo,
                    recaudacion: totalRecaudacion,
                    lecturasPendientes: Math.max(0, pendientes - lecturas.length)
                })

                // Recent activities mock
                setActivities([
                    { id: 1, type: 'payment', user: 'Juan Pérez', action: 'realizó un pago', amount: '$12.500', time: 'Hace 5 minutos' },
                    { id: 2, type: 'reading', user: 'María López', action: 'registró lectura', amount: '22 m³', time: 'Hace 15 minutos' },
                    { id: 3, type: 'member', user: 'Admin', action: 'agregó nuevo socio', amount: 'Pedro Soto', time: 'Hace 1 hora' },
                    { id: 4, type: 'alert', user: 'Sistema', action: 'alerta de consumo alto', amount: 'Sector Norte', time: 'Hace 2 horas' },
                ])
            } catch (error) {
                console.error('Error loading dashboard data:', error)
            }
        }
        loadData()
    }, [])

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
                <div className="stat-card group">
                    <div className="stat-icon-bg blue">
                        <div className="stat-icon-inner blue">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Socios</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats.totalSocios}</span>
                            <span className="stat-badge positive">
                                <span className="material-symbols-outlined">trending_up</span>
                                +2 este mes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Consumo Mensual */}
                <div className="stat-card group">
                    <div className="stat-icon-bg cyan">
                        <div className="stat-icon-inner cyan">
                            <span className="material-symbols-outlined">water_drop</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Consumo Mensual</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats.consumoMensual.toLocaleString()} m³</span>
                            <span className="stat-badge neutral">
                                <span className="material-symbols-outlined">trending_flat</span>
                                Normal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recaudación */}
                <div className="stat-card group">
                    <div className="stat-icon-bg emerald">
                        <div className="stat-icon-inner emerald">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Recaudación</span>
                        <div className="stat-value-row">
                            <span className="stat-value">${stats.recaudacion.toLocaleString()}</span>
                            <span className="stat-badge positive">
                                <span className="material-symbols-outlined">trending_up</span>
                                +12%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lecturas Pendientes */}
                <div className="stat-card group">
                    <div className="stat-icon-bg amber">
                        <div className="stat-icon-inner amber">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Lecturas Pendientes</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats.lecturasPendientes}</span>
                            <span className="stat-badge warning">
                                <span className="material-symbols-outlined">schedule</span>
                                Por registrar
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Monthly Consumption Chart */}
                <div className="chart-card main-chart">
                    <div className="chart-header">
                        <h3 className="chart-title">Consumo Mensual</h3>
                        <div className="chart-legend">
                            <div className="legend-item">
                                <span className="legend-dot blue"></span>
                                <span>Consumo (m³)</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-body">
                        {/* SVG Bar Chart */}
                        <svg className="bar-chart" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#4facfe" />
                                    <stop offset="100%" stopColor="#00f2fe" />
                                </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <g className="grid-lines">
                                <line x1="40" y1="20" x2="580" y2="20" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
                                <line x1="40" y1="60" x2="580" y2="60" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
                                <line x1="40" y1="100" x2="580" y2="100" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
                                <line x1="40" y1="140" x2="580" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
                            </g>
                            {/* Bars */}
                            <g className="bars">
                                <rect x="60" y="80" width="32" height="100" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="110" y="60" width="32" height="120" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="160" y="90" width="32" height="90" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="210" y="50" width="32" height="130" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="260" y="70" width="32" height="110" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="310" y="40" width="32" height="140" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="360" y="55" width="32" height="125" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="410" y="75" width="32" height="105" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="460" y="45" width="32" height="135" fill="url(#barGradient)" rx="4" className="bar" />
                                <rect x="510" y="30" width="32" height="150" fill="url(#barGradient)" rx="4" className="bar" />
                            </g>
                            {/* X-axis labels */}
                            <g className="x-labels" fill="#9ca3af" fontSize="10">
                                <text x="76" y="195" textAnchor="middle">May</text>
                                <text x="126" y="195" textAnchor="middle">Jun</text>
                                <text x="176" y="195" textAnchor="middle">Jul</text>
                                <text x="226" y="195" textAnchor="middle">Ago</text>
                                <text x="276" y="195" textAnchor="middle">Sep</text>
                                <text x="326" y="195" textAnchor="middle">Oct</text>
                                <text x="376" y="195" textAnchor="middle">Nov</text>
                                <text x="426" y="195" textAnchor="middle">Dic</text>
                                <text x="476" y="195" textAnchor="middle">Ene</text>
                                <text x="526" y="195" textAnchor="middle">Feb</text>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="chart-card side-chart">
                    <div className="chart-header">
                        <h3 className="chart-title">Distribución por Consumo</h3>
                        <button className="chart-menu">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    </div>
                    <div className="doughnut-container">
                        <div className="doughnut-chart">
                            <div className="doughnut-inner">
                                <span className="doughnut-value">142</span>
                                <span className="doughnut-label">Socios</span>
                            </div>
                        </div>
                        <div className="doughnut-legend">
                            <div className="legend-row">
                                <span className="legend-color blue"></span>
                                <span className="legend-text">Bajo (0-10 m³)</span>
                                <span className="legend-value">45%</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-color cyan"></span>
                                <span className="legend-text">Normal (11-20 m³)</span>
                                <span className="legend-value">35%</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-color amber"></span>
                                <span className="legend-text">Alto (21-30 m³)</span>
                                <span className="legend-value">15%</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-color red"></span>
                                <span className="legend-text">Muy Alto ({">"} 30 m³)</span>
                                <span className="legend-value">5%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
                <div className="glass-card">
                    <div className="card-header">
                        <h3 className="card-title">Actividad Reciente</h3>
                        <a href="#" className="view-all-link">
                            Ver todo
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                    <div className="activity-list">
                        {activities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                                    <span className="material-symbols-outlined">{getActivityIcon(activity.type)}</span>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-text">
                                        <strong>{activity.user}</strong> {activity.action} <span className="highlight">{activity.amount}</span>
                                    </p>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
