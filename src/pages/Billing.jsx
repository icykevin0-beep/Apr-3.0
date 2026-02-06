import { useState, useEffect } from 'react'
import { db } from '../db/database'
import './Billing.css'

export default function Billing() {
    const [boletas, setBoletas] = useState([])
    const [members, setMembers] = useState([])
    const [tarifas, setTarifas] = useState([])
    const [filterStatus, setFilterStatus] = useState('todos')
    const [filterPeriod, setFilterPeriod] = useState('febrero')

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const b = await db.boletas.toArray()
            const s = await db.socios.toArray()
            const t = await db.tarifas.toArray()
            setBoletas(b)
            setMembers(s)
            setTarifas(t)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    const getMemberName = (socioId) => {
        return members.find(m => m.id === socioId)?.nombre || 'Desconocido'
    }

    const getMemberRut = (socioId) => {
        return members.find(m => m.id === socioId)?.rut || '-'
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    const stats = {
        totalFacturado: boletas.reduce((sum, b) => sum + b.monto, 0),
        cobrado: boletas.filter(b => b.estado === 'pagado').reduce((sum, b) => sum + b.monto, 0),
        porCobrar: boletas.filter(b => b.estado === 'pendiente').reduce((sum, b) => sum + b.monto, 0),
        morosos: boletas.filter(b => b.estado === 'moroso').length
    }

    const cobroPorcentaje = stats.totalFacturado > 0
        ? Math.round((stats.cobrado / stats.totalFacturado) * 100)
        : 0

    const filteredBoletas = boletas.filter(b => {
        if (filterStatus !== 'todos' && b.estado !== filterStatus) return false
        return true
    })

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pagado':
                return <span className="status-badge paid"><span className="dot"></span>Pagado</span>
            case 'pendiente':
                return <span className="status-badge pending"><span className="dot"></span>Pendiente</span>
            case 'moroso':
                return <span className="status-badge overdue"><span className="dot"></span>Moroso</span>
            default:
                return <span className="status-badge">{status}</span>
        }
    }

    return (
        <div className="billing-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-emoji">💰</span>
                        Facturación y Pagos
                    </h1>
                    <p className="page-subtitle">Gestión de cobros, estados de cuenta y recaudación.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary">
                        <span className="material-symbols-outlined">download</span>
                        Exportar Reporte
                    </button>
                    <button className="btn-primary">
                        <span className="material-symbols-outlined">add_circle</span>
                        Generar Boletas
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-bg-icon emerald">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div className="stat-header">
                        <div className="stat-icon emerald">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="stat-label">Total Facturado</span>
                    </div>
                    <div className="stat-body">
                        <span className="stat-value">${stats.totalFacturado.toLocaleString()}</span>
                        <span className="stat-trend positive">
                            <span className="material-symbols-outlined">trending_up</span>
                            +5% vs mes anterior
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-bg-icon blue">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="stat-header">
                        <div className="stat-icon blue">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <span className="stat-label">Cobrado</span>
                    </div>
                    <div className="stat-body">
                        <span className="stat-value">${stats.cobrado.toLocaleString()}</span>
                        <div className="mini-progress">
                            <div className="mini-progress-bar" style={{ width: `${cobroPorcentaje}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-bg-icon amber">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div className="stat-header">
                        <div className="stat-icon amber">
                            <span className="material-symbols-outlined">schedule</span>
                        </div>
                        <span className="stat-label">Por Cobrar</span>
                    </div>
                    <div className="stat-body">
                        <span className="stat-value">${stats.porCobrar.toLocaleString()}</span>
                        <span className="stat-trend neutral">{100 - cobroPorcentaje}% pendiente</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-bg-icon red">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div className="stat-header">
                        <div className="stat-icon red">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <span className="stat-label">Morosos</span>
                    </div>
                    <div className="stat-body">
                        <span className="stat-value">{stats.morosos}</span>
                        <span className="stat-trend negative">
                            <span className="material-symbols-outlined">arrow_upward</span>
                            +1 nuevo este mes
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-split">
                {/* Left: Table */}
                <div className="content-main">
                    {/* Filters */}
                    <div className="toolbar">
                        <div className="filters">
                            <div className="filter-select">
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="todos">Estado: Todos</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="moroso">Moroso</option>
                                </select>
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                            <div className="filter-select">
                                <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)}>
                                    <option value="febrero">Período: Febrero 2026</option>
                                    <option value="enero">Enero 2026</option>
                                    <option value="diciembre">Diciembre 2025</option>
                                </select>
                                <span className="material-symbols-outlined">calendar_month</span>
                            </div>
                        </div>
                        <span className="filter-info">
                            Mostrando <strong>{filteredBoletas.length}</strong> de <strong>{boletas.length}</strong> registros
                        </span>
                    </div>

                    {/* Table */}
                    <div className="table-container glass-panel">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>RUT</th>
                                    <th>Socio</th>
                                    <th className="right">Consumo</th>
                                    <th className="right">Monto</th>
                                    <th className="center">Estado</th>
                                    <th className="right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBoletas.map((boleta, index) => (
                                    <tr key={boleta.id} className="table-row">
                                        <td className="text-muted">{1024 + index}</td>
                                        <td className="font-mono">{getMemberRut(boleta.socioId)}</td>
                                        <td>
                                            <div className="member-cell">
                                                <div className="avatar">{getInitials(getMemberName(boleta.socioId))}</div>
                                                <span className="member-name">{getMemberName(boleta.socioId)}</span>
                                            </div>
                                        </td>
                                        <td className="right text-muted">{boleta.consumo || 0} m³</td>
                                        <td className="right font-bold">${boleta.monto?.toLocaleString()}</td>
                                        <td className="center">{getStatusBadge(boleta.estado)}</td>
                                        <td className="right">
                                            <div className="row-actions">
                                                <button className="action-btn" title="Ver detalle">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                                {boleta.estado === 'pagado' ? (
                                                    <button className="action-btn success" title="Ver Comprobante">
                                                        <span className="material-symbols-outlined">receipt_long</span>
                                                    </button>
                                                ) : (
                                                    <button className="action-btn primary" title="Pagar">
                                                        <span className="material-symbols-outlined">payments</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tariffs Section */}
                    <div className="tariffs-card glass-panel">
                        <div className="tariffs-header">
                            <div>
                                <h3>Configuración de Tarifas por Tramo</h3>
                                <p>Tarifas vigentes para el período actual.</p>
                            </div>
                            <a href="#" className="tariffs-link">
                                Modificar Tarifas
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </a>
                        </div>
                        <div className="tariffs-grid">
                            <div className="tariff-item">
                                <span className="tariff-range">0 - 10 m³</span>
                                <span className="tariff-price">$500 /m³</span>
                            </div>
                            <div className="tariff-item">
                                <span className="tariff-range">11 - 20 m³</span>
                                <span className="tariff-price">$800 /m³</span>
                            </div>
                            <div className="tariff-item">
                                <span className="tariff-range">21 - 30 m³</span>
                                <span className="tariff-price">$1.200 /m³</span>
                            </div>
                            <div className="tariff-item">
                                <span className="tariff-range">{"> "}30 m³</span>
                                <span className="tariff-price">$2.000 /m³</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="content-sidebar">
                    {/* Month Summary */}
                    <div className="sidebar-card glass-panel">
                        <div className="sidebar-card-header">
                            <h3>Resumen del Mes</h3>
                            <button className="menu-btn">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>
                        <div className="doughnut-container">
                            <div className="doughnut-chart">
                                <div className="doughnut-inner">
                                    <span className="doughnut-value">{cobroPorcentaje}%</span>
                                    <span className="doughnut-label">Cobrado</span>
                                </div>
                            </div>
                        </div>
                        <div className="doughnut-legend">
                            <div className="legend-row">
                                <span className="legend-dot blue"></span>
                                <span className="legend-text">Pagado</span>
                                <span className="legend-value">{boletas.filter(b => b.estado === 'pagado').length}</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-dot amber"></span>
                                <span className="legend-text">Pendiente</span>
                                <span className="legend-value">{boletas.filter(b => b.estado === 'pendiente').length}</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-dot red"></span>
                                <span className="legend-text">Moroso</span>
                                <span className="legend-value">{stats.morosos}</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Due Dates */}
                    <div className="sidebar-card glass-panel">
                        <h3>Próximos Vencimientos</h3>
                        <div className="due-list">
                            <div className="due-item">
                                <div className="due-icon amber">
                                    <span className="material-symbols-outlined">calendar_clock</span>
                                </div>
                                <div className="due-info">
                                    <span className="due-name">María López</span>
                                    <span className="due-date">Vence: Mañana</span>
                                </div>
                                <span className="due-amount">$18.200</span>
                            </div>
                            <div className="due-item">
                                <div className="due-icon">
                                    <span className="material-symbols-outlined">event</span>
                                </div>
                                <div className="due-info">
                                    <span className="due-name">Ana María</span>
                                    <span className="due-date">Vence: 28 Feb</span>
                                </div>
                                <span className="due-amount">$22.450</span>
                            </div>
                            <div className="due-item">
                                <div className="due-icon">
                                    <span className="material-symbols-outlined">event</span>
                                </div>
                                <div className="due-info">
                                    <span className="due-name">Josefa Díaz</span>
                                    <span className="due-date">Vence: 28 Feb</span>
                                </div>
                                <span className="due-amount">$8.900</span>
                            </div>
                        </div>
                        <button className="view-all-btn">Ver todos</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
