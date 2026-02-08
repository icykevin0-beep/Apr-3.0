import { useState } from 'react'
import { useOrganization, useUpdateOrganization } from '../hooks/useOrganizations'
import { useWaterRates, useUpdateWaterRates } from '../hooks/useSettings'
import './Settings.css'

export default function Settings() {
    const { data: organization, isLoading: loadingOrg } = useOrganization()
    const { data: waterRates = [], isLoading: loadingRates } = useWaterRates()
    const updateOrg = useUpdateOrganization()
    const updateRates = useUpdateWaterRates()

    const [config, setConfig] = useState({
        name: 'APR Villa Los Aromos',
        rut: '76.000.000-1',
        address: 'Camino Principal 123, Sector Rural',
        phone: '+56 9 1234 5678',
        email: 'contacto@apraromos.cl',
        legal_rep: 'Juan Pérez'
    })

    const [preferences, setPreferences] = useState({
        darkMode: true,
        alertasPendientes: false,
        backupAutomatico: true
    })

    const [tarifas, setTarifas] = useState([
        { id: 1, nombre: 'Básico', desde: 0, hasta: 10, precio: 500 },
        { id: 2, nombre: 'Intermedio', desde: 11, hasta: 20, precio: 850 },
        { id: 3, nombre: 'Alto', desde: 21, hasta: 40, precio: 1200 },
        { id: 4, nombre: 'Sobreconsumo', desde: 41, hasta: '∞', precio: 2500 }
    ])

    const handleExportDB = () => {
        alert('🚧 Exportación de datos desde Supabase - Próximamente')
    }

    const handleClearData = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.')) {
            alert('🚧 Función de limpieza - Próximamente')
        }
    }

    const isLoading = loadingOrg || loadingRates

    if (isLoading) {
        return (
            <div className="settings-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Cargando configuración...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="settings-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-emoji">⚙️</span>
                        Configuración
                    </h1>
                    <p className="page-subtitle">Gestión general del sistema, parámetros de facturación y preferencias de la aplicación.</p>
                </div>
            </div>

            {/* APR Information Section */}
            <section className="settings-section glass-card">
                <div className="section-header">
                    <h2>
                        <span className="material-symbols-outlined section-icon">apartment</span>
                        Información del APR
                    </h2>
                    <button className="btn-primary small">
                        <span className="material-symbols-outlined">edit</span>
                        Editar
                    </button>
                </div>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Nombre</span>
                        <span className="info-value">{organization?.name || config.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">RUT</span>
                        <span className="info-value">{organization?.rut || config.rut}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Dirección</span>
                        <span className="info-value">{organization?.address || config.address}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">{organization?.phone || config.phone}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{organization?.email || config.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Rep. Legal</span>
                        <span className="info-value">{organization?.legal_rep || config.legal_rep}</span>
                    </div>
                </div>
            </section>

            {/* Tariffs Section */}
            <section className="settings-section glass-card">
                <div className="section-header">
                    <h2>
                        <span className="material-symbols-outlined section-icon">price_change</span>
                        Tarifas por Tramo
                    </h2>
                    <button className="btn-secondary small">
                        <span className="material-symbols-outlined">tune</span>
                        Modificar
                    </button>
                </div>
                <div className="tariffs-table">
                    <div className="tariffs-header-row">
                        <span>Tramo</span>
                        <span>Desde (m³)</span>
                        <span>Hasta (m³)</span>
                        <span>Tarifa ($/m³)</span>
                        <span className="right">Acciones</span>
                    </div>
                    {tarifas.map(tarifa => (
                        <div key={tarifa.id} className="tariff-row">
                            <span className="tariff-name">{tarifa.nombre}</span>
                            <span className="tariff-value">{tarifa.desde}</span>
                            <span className="tariff-value">{tarifa.hasta}</span>
                            <span className="tariff-price">$ {tarifa.precio.toLocaleString()}</span>
                            <span className="right">
                                <button className="edit-btn">
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
                <button className="add-tariff-btn">
                    <span className="material-symbols-outlined">add</span>
                    Agregar Nuevo Tramo
                </button>
            </section>

            {/* Two Column Layout */}
            <div className="two-column">
                {/* App Preferences */}
                <section className="settings-section glass-card">
                    <h2>
                        <span className="material-symbols-outlined section-icon">phonelink_setup</span>
                        Preferencias de la App
                    </h2>
                    <div className="preferences-list">
                        <div className="preference-item">
                            <div className="preference-info">
                                <span className="preference-title">Modo Oscuro</span>
                                <span className="preference-desc">Utilizar tema oscuro por defecto</span>
                            </div>
                            <button
                                className={`toggle-switch ${preferences.darkMode ? 'active' : ''}`}
                                onClick={() => setPreferences({ ...preferences, darkMode: !preferences.darkMode })}
                            >
                                <div className="toggle-knob"></div>
                            </button>
                        </div>
                        <div className="divider"></div>
                        <div className="preference-item">
                            <div className="preference-info">
                                <span className="preference-title">Alertas de lecturas pendientes</span>
                                <span className="preference-desc">Notificar al ingresar si faltan lecturas</span>
                            </div>
                            <button
                                className={`toggle-switch ${preferences.alertasPendientes ? 'active' : ''}`}
                                onClick={() => setPreferences({ ...preferences, alertasPendientes: !preferences.alertasPendientes })}
                            >
                                <div className="toggle-knob"></div>
                            </button>
                        </div>
                        <div className="divider"></div>
                        <div className="preference-item">
                            <div className="preference-info">
                                <span className="preference-title">Backup Automático</span>
                                <span className="preference-desc">Respaldo diario a las 00:00 hrs</span>
                            </div>
                            <button
                                className={`toggle-switch ${preferences.backupAutomatico ? 'active' : ''}`}
                                onClick={() => setPreferences({ ...preferences, backupAutomatico: !preferences.backupAutomatico })}
                            >
                                <div className="toggle-knob"></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section className="settings-section glass-card">
                    <h2>
                        <span className="material-symbols-outlined section-icon">database</span>
                        Gestión de Datos
                    </h2>
                    <p className="section-desc">Acciones avanzadas para la administración de la base de datos del sistema.</p>
                    <div className="data-actions">
                        <button className="data-btn" onClick={handleExportDB}>
                            <span className="material-symbols-outlined">download</span>
                            Exportar Base de Datos
                        </button>
                        <button className="data-btn">
                            <span className="material-symbols-outlined">upload</span>
                            Importar Respaldo
                        </button>
                        <button className="data-btn danger" onClick={handleClearData}>
                            <span className="material-symbols-outlined">delete_forever</span>
                            Limpiar Datos
                        </button>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="settings-footer">
                <div className="footer-left">
                    <span>Version 1.0.0</span>
                    <span className="separator">•</span>
                    <span>Desarrollado por: <span className="highlight">Lumina APR</span></span>
                </div>
                <div className="footer-right">
                    <a href="#">Términos</a>
                    <a href="#">Privacidad</a>
                    <a href="#">Soporte</a>
                </div>
            </footer>
        </div>
    )
}
