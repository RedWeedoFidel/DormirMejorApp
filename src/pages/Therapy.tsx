import { ArrowLeft, Settings, TrendingDown, Frown, Meh, Smile, SmilePlus, Wrench, CheckCircle, Activity, Shield, Clock, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';

export default function Therapy() {
  const { mode } = useAppContext();

  if (mode === 'child') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 pointer-events-none"></div>
        
        <header className="flex items-center justify-between p-4 pb-2 bg-slate-900/95 sticky top-0 z-10 backdrop-blur-md border-b border-slate-800">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-800 transition-colors text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-white">Estado de la Nave</h2>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto px-4 pt-6 relative z-10">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border-2 border-blue-500/30 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Rocket className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">¡Navegación Óptima!</h3>
            <p className="text-slate-400 mt-1">Tu nave está lista para el próximo viaje</p>
          </div>

          <div className="grid gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-300">Escudos de la Nave</h4>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-bold text-white">92%</span>
                    <span className="text-xs text-emerald-400 font-medium">Integridad Alta</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">¡Casi no hay fugas de oxígeno!</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-300">Tiempo de Vuelo</h4>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-bold text-white">8.5h</span>
                    <span className="text-xs text-blue-400 font-medium">Misión Cumplida</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Dormiste como un verdadero astronauta.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-24">
      <header className="flex items-center justify-between p-4 pb-2 bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Análisis de Fugas</h2>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4">
        <div className="py-3">
          <div className="flex h-12 w-full items-center rounded-xl bg-slate-200 dark:bg-slate-800 p-1">
            <label className="group flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg px-2 transition-all">
              <input type="radio" name="period" value="7" className="peer sr-only" />
              <div className="w-full h-full flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-900 peer-checked:text-blue-600 dark:peer-checked:text-blue-500 peer-checked:shadow-sm font-medium text-sm transition-all">
                Día 7
              </div>
            </label>
            <label className="group flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg px-2 transition-all">
              <input type="radio" name="period" value="14" className="peer sr-only" defaultChecked />
              <div className="w-full h-full flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-900 peer-checked:text-blue-600 dark:peer-checked:text-blue-500 peer-checked:shadow-sm font-medium text-sm transition-all">
                Día 14
              </div>
            </label>
            <label className="group flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg px-2 transition-all">
              <input type="radio" name="period" value="30" className="peer sr-only" />
              <div className="w-full h-full flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-900 peer-checked:text-blue-600 dark:peer-checked:text-blue-500 peer-checked:shadow-sm font-medium text-sm transition-all">
                Día 30
              </div>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex gap-3 items-start">
            <CheckCircle className="text-blue-600 dark:text-blue-400 mt-0.5 w-5 h-5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">¡Excelente progreso!</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Tu sellado ha mejorado un <span className="font-bold text-blue-600 dark:text-blue-400">20%</span>, ¡estás más cerca de las 7.5h de sueño reparador!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Estabilidad del Sellado</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Promedio de fugas esta semana</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Fugas de aire (L/min)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">12</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">L/min</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-bold">-2.5%</span>
              </div>
            </div>
            
            <div className="relative h-48 w-full">
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-emerald-500/5 border-t border-dashed border-emerald-500/30 flex items-start justify-end pr-2 pt-1">
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Zona Óptima (&lt;24 L/min)</span>
              </div>
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 350 150">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="0" x2="350" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-700" />
                <line x1="0" y1="50" x2="350" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-700" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-700" />
                <path d="M0,120 C20,110 40,80 60,90 C80,100 100,50 120,45 C140,40 160,60 180,55 C200,50 220,110 240,115 C260,120 280,130 300,125 C320,120 340,122 350,120 L350,150 L0,150 Z" fill="url(#chartGradient)" />
                <path d="M0,120 C20,110 40,80 60,90 C80,100 100,50 120,45 C140,40 160,60 180,55 C200,50 220,110 240,115 C260,120 280,130 300,125 C320,120 340,122 350,120" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                <circle cx="120" cy="45" r="4" className="fill-white dark:fill-slate-800 stroke-blue-600" strokeWidth="2" />
                <circle cx="240" cy="115" r="4" className="fill-white dark:fill-slate-800 stroke-blue-600" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex justify-between mt-2 px-1">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <span key={day} className="text-xs text-slate-400 font-medium">{day}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Confort Percibido</h3>
              <Smile className="text-slate-400 w-5 h-5" />
            </div>
            <div className="flex justify-between items-center px-2">
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                  <Frown className="text-slate-400 group-hover:text-red-500 w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-red-500">Mal</span>
              </button>
              <div className="h-px w-4 bg-slate-200 dark:bg-slate-700"></div>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                  <Meh className="text-slate-400 group-hover:text-orange-500 w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-orange-500">Regular</span>
              </button>
              <div className="h-px w-4 bg-slate-200 dark:bg-slate-700"></div>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800">
                  <Smile className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Bien</span>
              </button>
              <div className="h-px w-4 bg-slate-200 dark:bg-slate-700"></div>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <SmilePlus className="text-slate-400 group-hover:text-blue-500 w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500">Excelente</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Diagnóstico de Fugas</h3>
              <Wrench className="text-slate-400 w-5 h-5" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                  <Wrench className="text-orange-600 dark:text-orange-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Ajuste de Arnés</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Detectado desajuste leve en la zona superior.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Activity className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Presión CPAP</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Óptima (9.5 cmH2O). Sin picos &gt;10 detectados.</p>
                </div>
                <CheckCircle className="text-emerald-500 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
            Solicitar Revisión Clínica
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            Si las fugas persisten por más de 3 días, consulta a tu especialista.
          </p>
        </div>
      </main>
    </div>
  );
}
