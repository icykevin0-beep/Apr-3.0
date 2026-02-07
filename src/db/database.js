import Dexie from 'dexie'

export const db = new Dexie('LuminaAPR')

db.version(1).stores({
    // Socios (Members) table
    socios: '++id, rut, nombre, direccion, medidor, estado, fechaCreacion',

    // Lecturas (Readings) table
    lecturas: '++id, socioId, medidor, lecturaAnterior, lecturaActual, consumo, fecha, registradoPor',

    // Boletas (Invoices) table
    boletas: '++id, socioId, numero, monto, consumo, estado, fechaEmision, fechaVencimiento',

    // Pagos (Payments) table
    pagos: '++id, boletaId, socioId, monto, fechaPago, metodoPago',

    // Configuracion table
    configuracion: 'id, nombre, valor',

    // Tarifas (Rates) table
    tarifas: '++id, tramoMin, tramoMax, precio, vigente'
})

// Event system for real-time updates across components
const dbEventListeners = new Set()

export function onDatabaseChange(callback) {
    dbEventListeners.add(callback)
    return () => dbEventListeners.delete(callback)
}

export function notifyDatabaseChange(tableName, action) {
    dbEventListeners.forEach(listener => listener({ tableName, action }))
}

// Seed initial data (DISABLED FOR PRODUCTION)
export async function seedDatabase() {
    const sociosCount = await db.socios.count()

    if (sociosCount === 0) {
        // Add sample socios
        await db.socios.bulkAdd([
            { rut: '12.345.678-9', nombre: 'Juan Pérez', direccion: 'Camino Rural 123', medidor: 'M-2023-001', estado: 'activo', fechaCreacion: new Date().toISOString() },
            { rut: '98.765.432-1', nombre: 'María López', direccion: 'Sector Norte 456', medidor: 'M-2023-002', estado: 'activo', fechaCreacion: new Date().toISOString() },
            { rut: '11.222.333-4', nombre: 'Pedro González', direccion: 'Parcela 789', medidor: 'M-2023-003', estado: 'moroso', fechaCreacion: new Date().toISOString() },
            { rut: '55.666.777-8', nombre: 'Ana Martínez', direccion: 'Camino Sur 321', medidor: 'M-2023-004', estado: 'activo', fechaCreacion: new Date().toISOString() },
            { rut: '22.333.444-5', nombre: 'Carlos Rodríguez', direccion: 'Los Pinos 654', medidor: 'M-2023-005', estado: 'activo', fechaCreacion: new Date().toISOString() },
        ])

        // Add sample tarifas
        await db.tarifas.bulkAdd([
            { tramoMin: 0, tramoMax: 10, precio: 500, vigente: true },
            { tramoMin: 11, tramoMax: 20, precio: 800, vigente: true },
            { tramoMin: 21, tramoMax: 30, precio: 1200, vigente: true },
            { tramoMin: 31, tramoMax: 999, precio: 2000, vigente: true },
        ])

        // Add configuration
        await db.configuracion.bulkAdd([
            { id: 'apr_nombre', nombre: 'Nombre APR', valor: 'APR Villa Los Aromos' },
            { id: 'apr_rut', nombre: 'RUT', valor: '76.000.000-1' },
            { id: 'apr_direccion', nombre: 'Dirección', valor: 'Camino Principal 123, Sector Rural' },
            { id: 'apr_telefono', nombre: 'Teléfono', valor: '+56 9 1234 5678' },
            { id: 'apr_email', nombre: 'Email', valor: 'contacto@apraromos.cl' },
        ])
    }
}

// Utility: Clear all data (useful for production fresh start)
export async function clearAllData() {
    await db.socios.clear()
    await db.lecturas.clear()
    await db.boletas.clear()
    await db.pagos.clear()
    await db.tarifas.clear()
    await db.configuracion.clear()
    console.log('🗑️ All data cleared from database')
    return true
}

// Initialize database on load (DISABLED FOR PRODUCTION)
// seedDatabase()

