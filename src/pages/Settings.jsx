import { useState, useEffect } from 'react'
import { db } from '../db/database'
import './Settings.css'

export default function Settings() {
    const [config, setConfig] = useState({
        nombre: 'APR Villa Los Aromos',
        rut: '76.000.000-1',
        direccion: 'Camino Principal 123, Sector Rural',
        telefono: '+56 9 1234 5678',
        email: 'contacto@apraromos.cl',
        repLegal: 'Juan Pérez'
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

    const handleExportDB = async () => {
        try {
            const socios = await db.socios.toArray()
            const lecturas = await db.lecturas.toArray()
            const boletas = await db.boletas.toArray()

            const data = { socios, lecturas, boletas, exportDate: new Date().toISOString() }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = `lumina-apr-backup-${new Date().toISOString().slice(0, 10)}.json`
            a.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting database:', error)
        }
    }

    const handleClearData = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.')) {
            try {
                await db.socios.clear()
                await db.lecturas.clear()
                await db.boletas.clear()
                await db.pagos.clear()
                alert('Datos eliminados correctamente')
            } catch (error) {
                console.error('Error clearing data:', error)
            }
        }
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
                        <span className="info-value">{config.nombre}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">RUT</span>
                        <span className="info-value">{config.rut}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Dirección</span>
                        <span className="info-value">{config.direccion}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">{config.telefono}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{config.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Rep. Legal</span>
                        <span className="info-value">{config.repLegal}</span>
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
