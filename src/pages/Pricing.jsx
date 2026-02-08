import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState('monthly')
    const navigate = useNavigate()

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#0d151c] dark:text-slate-100 transition-colors duration-300">
            {/* Top Navigation */}
            <header className="border-b border-solid border-[#e7edf4] dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined !text-2xl">water_drop</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">Lumina APR</h2>
                    </div>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">Características</a>
                            <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">Precios</a>
                            <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">Sobre nosotros</a>
                            <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">Contacto</a>
                        </nav>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center py-16 px-4 max-w-[1200px] mx-auto w-full">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Elige el plan ideal para tu comunidad</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                        Soluciones tecnológicas diseñadas para simplificar la gestión de Comités y Cooperativas de Agua Potable Rural.
                    </p>
                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-sm font-semibold text-slate-500">Mensual</span>
                        <div className="flex h-12 w-64 items-center justify-center rounded-full bg-[#e7edf4] dark:bg-slate-800 p-1">
                            <label className="flex cursor-pointer h-full grow items-center justify-center rounded-full px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm transition-all text-[#49749c] dark:text-slate-400 has-[:checked]:text-primary text-sm font-bold">
                                <span className="truncate">Mensual</span>
                                <input
                                    checked={billingCycle === 'monthly'}
                                    onChange={() => setBillingCycle('monthly')}
                                    className="invisible w-0"
                                    name="billing-cycle"
                                    type="radio"
                                    value="monthly"
                                />
                            </label>
                            <label className="flex cursor-pointer h-full grow items-center justify-center rounded-full px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm transition-all text-[#49749c] dark:text-slate-400 has-[:checked]:text-primary text-sm font-bold">
                                <span className="truncate">Anual <span className="ml-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full">-20%</span></span>
                                <input
                                    checked={billingCycle === 'yearly'}
                                    onChange={() => setBillingCycle('yearly')}
                                    className="invisible w-0"
                                    name="billing-cycle"
                                    type="radio"
                                    value="yearly"
                                />
                            </label>
                        </div>
                        <span className="text-sm font-semibold text-primary">Anual</span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
                    {/* Plan Gratuito */}
                    <div className="glass-card flex flex-col p-8 rounded-xl shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-2">Plan Gratuito</h3>
                            <p className="text-slate-500 text-sm mb-6">Para comunidades pequeñas que inician su digitalización.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">$0</span>
                                <span className="text-slate-500 font-bold">/mes</span>
                            </div>
                        </div>
                        <button className="w-full py-3 px-4 mb-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent dark:border-slate-700">
                            Comenzar Gratis
                        </button>
                        <ul className="space-y-4 flex-1">
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Hasta 50 socios</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Lecturas manuales</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-400">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Facturación básica (no electrónica)</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Soporte de la comunidad</span>
                            </li>
                        </ul>
                    </div>

                    {/* Plan Profesional */}
                    <div className="flex flex-col p-8 rounded-xl shadow-2xl relative scale-105 z-10 hover:translate-y-[-4px] transition-all duration-300 bg-gradient-to-br from-[#2590f4] to-[#6366f1] text-white overflow-hidden">
                        {/* Circle decorations */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-b-lg shadow-sm">
                            Recomendado
                        </div>
                        <div className="mb-8 relative z-10">
                            <h3 className="text-lg font-bold mb-2">Plan Profesional</h3>
                            <p className="text-blue-100 text-sm mb-6">La solución completa para la gestión operativa y legal.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">
                                    {billingCycle === 'yearly' ? '$24.000' : '$30.000'}
                                </span>
                                <span className="text-blue-100 font-bold">/mes</span>
                            </div>
                        </div>
                        <button className="w-full py-3 px-4 mb-8 rounded-lg bg-white text-primary font-bold text-sm hover:bg-blue-50 transition-all shadow-lg relative z-10">
                            Seleccionar Plan
                        </button>
                        <ul className="space-y-4 flex-1 relative z-10">
                            <li className="flex items-start gap-3 text-sm">
                                <div className="bg-white/20 p-1 rounded-full">
                                    <span className="material-symbols-outlined text-white !text-sm font-bold">check</span>
                                </div>
                                <span className="font-semibold">Socios ilimitados</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <div className="bg-white/20 p-1 rounded-full">
                                    <span className="material-symbols-outlined text-white !text-sm font-bold">check</span>
                                </div>
                                <span>Integración Facturación Electrónica SII</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <div className="bg-white/20 p-1 rounded-full">
                                    <span className="material-symbols-outlined text-white !text-sm font-bold">check</span>
                                </div>
                                <span>Automatización de cobranza</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <div className="bg-white/20 p-1 rounded-full">
                                    <span className="material-symbols-outlined text-white !text-sm font-bold">check</span>
                                </div>
                                <span>App Móvil Operador (Offline)</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <div className="bg-white/20 p-1 rounded-full">
                                    <span className="material-symbols-outlined text-white !text-sm font-bold">check</span>
                                </div>
                                <span className="font-semibold">Soporte prioritario 24/7</span>
                            </li>
                        </ul>
                    </div>

                    {/* Plan Empresa */}
                    <div className="glass-card flex flex-col p-8 rounded-xl shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-2">Plan Empresa / Gob.</h3>
                            <p className="text-slate-500 text-sm mb-6">Diseñado para federaciones o gestión gubernamental.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black">Personalizado</span>
                            </div>
                        </div>
                        <button className="w-full py-3 px-4 mb-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent dark:border-slate-700">
                            Contactar Ventas
                        </button>
                        <ul className="space-y-4 flex-1">
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Gestión de múltiples APR</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Acceso a API completa</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Telemetría personalizada</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                <span>Gestor de cuenta dedicado</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-slate-500 mb-4">¿Necesitas una demostración en vivo?</p>
                    <a className="inline-flex items-center gap-2 text-primary font-bold hover:underline" href="#">
                        Programar una videollamada
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
            </main>

            {/* Comparison Preview */}
            <section className="bg-white/40 dark:bg-white/5 py-12 px-4">
                <div className="max-w-[960px] mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Comparativa rápida</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="py-4 font-bold">Funcionalidad</th>
                                    <th className="py-4 font-bold text-center">Gratuito</th>
                                    <th className="py-4 font-bold text-center text-primary">Profesional</th>
                                    <th className="py-4 font-bold text-center">Empresa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr>
                                    <td className="py-4">Soporte Offline</td>
                                    <td className="py-4 text-center text-slate-300">—</td>
                                    <td className="py-4 text-center"><span className="material-symbols-outlined text-green-500">check</span></td>
                                    <td className="py-4 text-center"><span className="material-symbols-outlined text-green-500">check</span></td>
                                </tr>
                                <tr>
                                    <td className="py-4">Reportes de Consumo</td>
                                    <td className="py-4 text-center">Básico</td>
                                    <td className="py-4 text-center font-semibold">Avanzado</td>
                                    <td className="py-4 text-center font-semibold">Custom BI</td>
                                </tr>
                                <tr>
                                    <td className="py-4">App del Socio</td>
                                    <td className="py-4 text-center text-slate-300">—</td>
                                    <td className="py-4 text-center"><span className="material-symbols-outlined text-green-500">check</span></td>
                                    <td className="py-4 text-center"><span className="material-symbols-outlined text-green-500">check</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-50 dark:bg-background-dark/80 py-8 px-10 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
                <p>© 2024 Lumina APR - Gestión de Agua Rural Simplificada. Todos los derechos reservados.</p>
            </footer>

            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 -z-10 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>
            </div>
        </div>
    )
}
