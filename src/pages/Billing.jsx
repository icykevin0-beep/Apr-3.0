import { useState, useMemo } from 'react'
import { useMembers } from '../hooks/useMembers'
import { useInvoices } from '../hooks/useBilling'
import './Billing.css'

export default function Billing() {
    const { data: invoices = [], isLoading: loadingInvoices } = useInvoices()
    const { data: members = [], isLoading: loadingMembers } = useMembers()

    const [filterStatus, setFilterStatus] = useState('todos')
    const [filterPeriod, setFilterPeriod] = useState('febrero')

    const getMemberName = (memberId) => {
        return members.find(m => m.id === memberId)?.name || 'Desconocido'
    }

    const getMemberRut = (memberId) => {
        return members.find(m => m.id === memberId)?.rut || '-'
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    }

    const stats = useMemo(() => {
        const totalFacturado = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
        const paidInvoices = invoices.filter(inv => inv.status === 'paid')
        const cobrado = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
        const porCobrar = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.amount || 0), 0)
        const morosos = invoices.filter(inv => inv.status === 'overdue').length

        return { totalFacturado, cobrado, porCobrar, morosos }
    }, [invoices])

    const cobroPorcentaje = stats.totalFacturado > 0
        ? Math.round((stats.cobrado / stats.totalFacturado) * 100)
        : 0

    const filteredInvoices = invoices.filter(inv => {
        if (filterStatus !== 'todos' && inv.status !== filterStatus) return false
        return true
    })

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <span className="status-badge paid"><span className="dot"></span>Pagado</span>
            case 'pending':
                return <span className="status-badge pending"><span className="dot"></span>Pendiente</span>
            case 'overdue':
                return <span className="status-badge overdue"><span className="dot"></span>Moroso</span>
            default:
                return <span className="status-badge">{status}</span>
        }
    }

    const isLoading = loadingInvoices || loadingMembers

    if (isLoading) {
        return (
            <div className="billing-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Cargando facturación...</p>
                </div>
            </div>
        )
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
                                    <option value="paid">Pagado</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="overdue">Moroso</option>
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
                            Mostrando <strong>{filteredInvoices.length}</strong> de <strong>{invoices.length}</strong> registros
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
                                {filteredInvoices.map((invoice, index) => (
                                    <tr key={invoice.id} className="table-row">
                                        <td className="text-muted">{1024 + index}</td>
                                        <td className="font-mono">{getMemberRut(invoice.member_id)}</td>
                                        <td>
                                            <div className="member-cell">
                                                <div className="avatar">{getInitials(getMemberName(invoice.member_id))}</div>
                                                <span className="member-name">{getMemberName(invoice.member_id)}</span>
                                            </div>
                                        </td>
                                        <td className="right text-muted">{invoice.consumption || 0} m³</td>
                                        <td className="right font-bold">${invoice.amount?.toLocaleString()}</td>
                                        <td className="center">{getStatusBadge(invoice.status)}</td>
                                        <td className="right">
                                            <div className="row-actions">
                                                <button className="action-btn" title="Ver detalle">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                                {invoice.status === 'paid' ? (
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
                                <span className="tariff-range">&gt; 30 m³</span>
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
                                <span className="legend-value">{invoices.filter(inv => inv.status === 'paid').length}</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-dot amber"></span>
                                <span className="legend-text">Pendiente</span>
                                <span className="legend-value">{invoices.filter(inv => inv.status === 'pending').length}</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-dot red"></span>
                                <span className="legend-text">Moroso</span>
                                <span className="legend-value">{stats.morosos}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
