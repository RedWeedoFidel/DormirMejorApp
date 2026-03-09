import { Bell, Moon, CloudOff, Zap, Droplet, Wind, Rocket, Star, Award } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Home() {
  const { mode } = useAppContext();

  if (mode === 'child') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 pointer-events-none"></div>
        
        <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 ring-2 ring-blue-500/50"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop")',
                }}
              ></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Centro de Comando</p>
              <h2 className="text-lg font-bold text-white">Capitán Alex</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <Zap className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-bold text-white">5 Días</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pt-4 relative z-10">
          <section className="rounded-2xl bg-slate-800 p-5 border border-slate-700 shadow-xl relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-end mb-3 relative z-10">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Rocket className="text-blue-500 w-5 h-5" />
                  Misión a Marte
                </h2>
                <p className="text-xs text-slate-400 mt-1">Objetivo: 9 horas de sueño</p>
              </div>
              <span className="text-2xl font-bold text-blue-500">85%</span>
            </div>
            <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative z-10">
              <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative" style={{ width: '85%' }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium relative z-10">
              <span>Tierra</span>
              <span>Marte</span>
            </div>
            <p className="mt-4 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              ¡Casi llegamos! Solo falta un poco más de combustible de sueño para aterrizar.
            </p>
          </section>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Energía de Nave</h3>
                <p className="text-lg font-bold text-blue-400 mt-1">8.5h</p>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Oxígeno</h3>
                <p className="text-lg font-bold text-teal-400 mt-1">100%</p>
              </div>
            </div>
          </div>

          <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3 transform transition-all active:scale-[0.98] group mb-6">
            <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <div className="text-left">
              <span className="block text-lg font-bold leading-tight">Empezar Misión Nocturna</span>
              <span className="block text-xs text-blue-100 opacity-90">Conecta tu máscara y despega</span>
            </div>
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-24">
      <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 ring-2 ring-blue-500/20"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop")',
              }}
            ></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Buenos Días,</p>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Alex</h2>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4">
        <section className="mt-6 flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl"></div>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-200 dark:text-slate-800"
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
              ></circle>
              <circle
                className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="currentColor"
                strokeDasharray="283"
                strokeDashoffset="70"
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Moon className="text-blue-500 mb-1 w-8 h-8" />
              <h1 className="text-4xl font-bold tracking-tighter">
                4.5<span className="text-lg font-normal text-slate-400">h</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Dosis de Sueño</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400">
                Meta: 6.0 Horas
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recuperación Cognitiva</p>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CloudOff className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                <CloudOff className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Neblina Mental</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Bajo</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-500 text-xs font-medium">
                <span>↘ 15% mejora</span>
              </div>
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-[20%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-500/20 rounded-lg text-teal-600 dark:text-teal-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Vitalidad</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                85<span className="text-sm font-normal text-slate-500">/100</span>
              </p>
              <div className="flex items-center gap-1 mt-1 text-emerald-500 text-xs font-medium">
                <span>↗ +5% esta semana</span>
              </div>
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 w-[85%] rounded-full"></div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tendencias de Recuperación</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
              Ver Reporte
            </button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-end justify-between h-32 gap-2">
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[40%] group-hover:bg-blue-500/50 transition-colors relative"></div>
                <span className="text-xs text-slate-500">L</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[55%] group-hover:bg-blue-500/50 transition-colors relative"></div>
                <span className="text-xs text-slate-500">M</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[45%] group-hover:bg-blue-500/50 transition-colors relative"></div>
                <span className="text-xs text-slate-500">X</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[70%] group-hover:bg-blue-500/50 transition-colors relative"></div>
                <span className="text-xs text-slate-500">J</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-blue-500 rounded-t-sm h-[85%] shadow-[0_0_15px_rgba(59,130,246,0.3)] relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    85 Puntaje
                  </div>
                </div>
                <span className="text-xs text-slate-900 dark:text-white font-medium">V</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[60%] group-hover:bg-blue-500/50 transition-colors relative"></div>
                <span className="text-xs text-slate-500">S</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[50%] group-hover:bg-blue-500/50 transition-colors relative"></div>
                <span className="text-xs text-slate-500">D</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 mb-6">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Consejos Diarios</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
            <div className="snap-start shrink-0 w-[280px] bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-x-8 translate-y-8"></div>
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <Droplet className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  Hidratación
                </span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-semibold mb-1">Bebe agua antes de dormir</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                La hidratación impacta tu recuperación cognitiva. Intenta beber 250 ml una hora antes de dormir.
              </p>
            </div>
            <div className="snap-start shrink-0 w-[280px] bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl translate-x-8 translate-y-8"></div>
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-teal-100 dark:bg-teal-500/20 rounded-lg text-teal-600 dark:text-teal-400">
                  <Wind className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  CPAP
                </span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-semibold mb-1">Ajuste de Máscara</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El sellado fue del 92% anoche. Ajusta ligeramente las correas para un mejor puntaje cognitivo.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
