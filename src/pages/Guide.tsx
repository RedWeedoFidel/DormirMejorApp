import { ArrowLeft, Info, Stethoscope, CheckCircle2, Activity, Bed, FileText, Wind, Smile, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Guide() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-24">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Tu Camino hacia el Descanso</h1>
        </div>
        
        <div className="px-5 pb-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Tu Progreso</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Estás en el camino correcto hacia un mejor sueño.</p>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">16%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500 w-[16%] transition-all duration-1000 ease-out"></div>
          </div>
          <div className="mt-2 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Inicio</span>
            <span>1 de 6 pasos</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <div className="flex gap-3">
            <Info className="text-blue-600 dark:text-blue-400 shrink-0 w-5 h-5" />
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Sigue estos pasos para obtener tu diagnóstico y tratamiento CPAP. Marca cada paso cuando lo completes.
            </p>
          </div>
        </div>

        <div className="relative pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>

          {/* Step 1: Active */}
          <div className="relative flex gap-5 pb-2 group">
            <div className="relative flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-4 ring-white dark:ring-slate-900 z-10">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pb-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Paso 1</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">En curso</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cita con Médico de Cabecera</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Consulta inicial para evaluar síntomas como ronquidos fuertes o fatiga diurna.</p>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                  <span>Marcar como completado</span>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Pending */}
          <div className="relative flex gap-5 pb-2 opacity-60 hover:opacity-100 transition-opacity group">
            <div className="relative flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 shadow-sm ring-4 ring-white dark:ring-slate-900 z-10 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-colors">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pb-8 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Paso 2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Derivación a Especialista</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Visita a Neumología o Unidad del Sueño para una evaluación experta.</p>
              </div>
            </div>
          </div>

          {/* Step 3: Pending */}
          <div className="relative flex gap-5 pb-2 opacity-60 hover:opacity-100 transition-opacity group">
            <div className="relative flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 shadow-sm ring-4 ring-white dark:ring-slate-900 z-10 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-colors">
                <Bed className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pb-8 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Paso 3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Realización de Polisomnografía</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Prueba de sueño monitorizada en hospital o domicilio para medir la apnea.</p>
              </div>
            </div>
          </div>

          {/* Step 4: Pending */}
          <div className="relative flex gap-5 pb-2 opacity-60 hover:opacity-100 transition-opacity group">
            <div className="relative flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 shadow-sm ring-4 ring-white dark:ring-slate-900 z-10 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pb-8 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Paso 4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Resultados y Diagnóstico</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Revisión del informe médico con el especialista para confirmar el diagnóstico.</p>
              </div>
            </div>
          </div>

          {/* Step 5: Pending */}
          <div className="relative flex gap-5 pb-2 opacity-60 hover:opacity-100 transition-opacity group">
            <div className="relative flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 shadow-sm ring-4 ring-white dark:ring-slate-900 z-10 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-colors">
                <Wind className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pb-8 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Paso 5</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Receta de Dispositivo CPAP</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Prescripción y trámites para la obtención de tu máquina a través de la seguridad social.</p>
              </div>
            </div>
          </div>

          {/* Step 6: Pending */}
          <div className="relative flex gap-5 pb-2 opacity-60 hover:opacity-100 transition-opacity group">
            <div className="relative flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 shadow-sm ring-4 ring-white dark:ring-slate-900 z-10 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-colors">
                <Smile className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Paso 6</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inicio del Tratamiento</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Adaptación al uso diario, seguimiento de la adherencia y mejora del descanso.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-slate-800 p-6 text-center mt-4 border border-blue-100 dark:border-blue-800/30">
          <ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white mb-1">¿Necesitas ayuda?</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Nuestro equipo de soporte puede guiarte si tienes dudas sobre el proceso.</p>
          <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Contactar Soporte</button>
        </div>
      </main>
    </div>
  );
}
