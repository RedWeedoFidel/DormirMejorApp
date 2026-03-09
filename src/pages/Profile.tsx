import React, { useState, useEffect } from 'react';
import { Star, Zap, Settings, Edit2, Rocket, Award, Lock, User, Shield, Activity, Globe, Bell, Moon, Filter, Clock, ShoppingCart, Fingerprint, Gavel, LogOut, ChevronRight, ExternalLink, X, Compass, Anchor, BatteryFull, Flame, Sparkles, Target, Heart, Cloud, Crosshair, Droplets, Wind, Snowflake, Sun, Medal, Crown, Flag, Trophy, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';

export default function Profile() {
  const { mode, pin, setMode, setPin } = useAppContext();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Modal states
  const [pinModalState, setPinModalState] = useState<'none' | 'create' | 'enter'>('none');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);
  const [daysWithoutCleaning, setDaysWithoutCleaning] = useState(5);

  useEffect(() => {
    if (mode === 'adult' && daysWithoutCleaning >= 5) {
      setToast({ 
        text: `¡Aviso! Llevas ${daysWithoutCleaning} días sin limpiar la máscara. Por favor, límpiala pronto.`, 
        type: 'warning' 
      });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mode, daysWithoutCleaning]);

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMode = e.target.value as 'adult' | 'child';
    if (selectedMode === 'child') {
      if (!pin) {
        setPinModalState('create');
      } else {
        setMode('child');
      }
    }
  };

  const handleChildSettingsClick = () => {
    setPinModalState('enter');
  };

  const handlePinSubmit = () => {
    if (pinModalState === 'create') {
      if (pinInput.length === 4) {
        setPin(pinInput);
        setMode('child');
        setPinModalState('none');
        setPinInput('');
      } else {
        setPinError(true);
      }
    } else if (pinModalState === 'enter') {
      if (pinInput === pin) {
        setMode('adult');
        setPinModalState('none');
        setPinInput('');
      } else {
        setPinError(true);
      }
    }
  };

  const handleForgotPin = () => {
    setToast({ text: 'Se ha enviado un correo con instrucciones para restablecer el PIN.', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    setPinModalState('none');
    setPinInput('');
  };

  // Render PIN Modal
  const renderPinModal = () => {
    if (pinModalState === 'none') return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 relative">
          <button 
            onClick={() => { setPinModalState('none'); setPinInput(''); setPinError(false); }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {pinModalState === 'create' ? 'Crear PIN Parental' : 'Introduce tu PIN'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {pinModalState === 'create' 
                ? 'Crea un PIN de 4 dígitos para proteger el modo adulto.' 
                : 'Introduce tu PIN de 4 dígitos para volver al modo adulto.'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                  setPinError(false);
                }}
                className={cn(
                  "w-full text-center text-2xl tracking-[0.5em] font-mono bg-slate-50 dark:bg-slate-900 border rounded-xl py-3 text-slate-900 dark:text-white focus:ring-2 focus:outline-none",
                  pinError ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                )}
                placeholder="••••"
                autoFocus
              />
              {pinError && (
                <p className="text-red-500 text-xs text-center mt-2">
                  {pinModalState === 'create' ? 'El PIN debe tener 4 dígitos.' : 'PIN incorrecto. Inténtalo de nuevo.'}
                </p>
              )}
            </div>

            <button
              onClick={handlePinSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {pinModalState === 'create' ? 'Guardar y Activar' : 'Desbloquear'}
            </button>

            {pinModalState === 'enter' && (
              <button
                onClick={handleForgotPin}
                className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                ¿Olvidaste tu PIN?
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (mode === 'child') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 relative overflow-hidden">
        {renderPinModal()}
        {toast && (
          <div className={cn(
            "fixed top-4 left-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-center animate-in fade-in slide-in-from-top-4",
            toast.type === 'warning' ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          )}>
            {toast.text}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 pointer-events-none"></div>
        
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-yellow-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Nivel 5</p>
              <p className="text-sm font-bold text-white">Piloto Estelar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
              <Zap className="text-yellow-400 w-4 h-4" />
              <span className="text-sm font-bold text-white">5 Días</span>
            </div>
            <button 
              onClick={handleChildSettingsClick}
              className="relative w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-blue-500 hover:bg-slate-700 transition-colors"
              title="Ajustes (Requiere PIN)"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-10">
          <section className="flex flex-col items-center justify-center gap-6 py-4">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-40 h-40 rounded-full border-4 border-slate-800 bg-slate-700 overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 transition-transform active:scale-95">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">¡Hola, Capitán Alex!</h1>
              <p className="text-slate-400 text-sm">Tu máscara te da superpoderes para soñar</p>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Tus Medallas</h2>
              <span className="text-xs text-blue-500 font-bold uppercase tracking-wide">6/30 Desbloqueadas</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Piloto Estelar', desc: '7 días seguidos', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', unlocked: true },
                { title: 'Súper Racha', desc: '30 días de uso', icon: Zap, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', unlocked: true },
                { title: 'Astronauta Novato', desc: '1er día de uso', icon: Rocket, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]', unlocked: true },
                { title: 'Guardián del Sueño', desc: '10 días sin fugas', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', unlocked: true },
                { title: 'Explorador', desc: '100 horas de vuelo', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', unlocked: true },
                { title: 'Batería al 100%', desc: '5 días perfectos', icon: BatteryFull, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', shadow: 'shadow-[0_0_15px_rgba(74,222,128,0.15)]', unlocked: true },
                { title: 'Rey de Marte', desc: '50 días de uso', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]', unlocked: false },
                { title: 'Viajero del Tiempo', desc: '100 días de uso', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.15)]', unlocked: false },
                { title: 'Cazador de Estrellas', desc: '50 días seguidos', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.15)]', unlocked: false },
                { title: 'Maestro Jedi', desc: '200 días de uso', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', shadow: 'shadow-[0_0_15px_rgba(74,222,128,0.15)]', unlocked: false },
                { title: 'Héroe Galáctico', desc: '365 días de uso', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-600/10', border: 'border-yellow-600/20', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', unlocked: false },
                { title: 'Soñador Profundo', desc: '8 horas de sueño', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', unlocked: false },
                { title: 'Despertar Feliz', desc: '10 días despertando bien', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.15)]', unlocked: false },
                { title: 'Navegante', desc: '20 horas de vuelo', icon: Navigation, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', unlocked: false },
                { title: 'Capitán', desc: '500 horas de vuelo', icon: Anchor, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.15)]', unlocked: false },
                { title: 'Respiración Dragón', desc: '30 días sin apneas', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', unlocked: false },
                { title: 'Mago del Espacio', desc: '150 días de uso', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]', unlocked: false },
                { title: 'Francotirador', desc: '100% uso en un mes', icon: Target, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', unlocked: false },
                { title: 'Corazón de Hierro', desc: '60 días seguidos', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', shadow: 'shadow-[0_0_15px_rgba(244,114,182,0.15)]', unlocked: false },
                { title: 'Nube Voladora', desc: '20 días sin fugas', icon: Cloud, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', shadow: 'shadow-[0_0_15px_rgba(56,189,248,0.15)]', unlocked: false },
                { title: 'Rayo Veloz', desc: '10 días durmiendo temprano', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.15)]', unlocked: false },
                { title: 'Guerrero Ninja', desc: '90 días de uso', icon: Crosshair, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.15)]', unlocked: false },
                { title: 'Oso Hibernando', desc: '10 horas de sueño', icon: Moon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', unlocked: false },
                { title: 'Gota de Agua', desc: 'Humidificador 10 días', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.15)]', unlocked: false },
                { title: 'Viento Suave', desc: 'Presión óptima 30 días', icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', shadow: 'shadow-[0_0_15px_rgba(45,212,191,0.15)]', unlocked: false },
                { title: 'Hielo Cósmico', desc: '30 días en invierno', icon: Snowflake, color: 'text-blue-300', bg: 'bg-blue-400/10', border: 'border-blue-400/20', shadow: 'shadow-[0_0_15px_rgba(147,197,253,0.15)]', unlocked: false },
                { title: 'Sol Radiante', desc: '30 días en verano', icon: Sun, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]', unlocked: false },
                { title: 'Campeón', desc: '1000 horas de vuelo', icon: Medal, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.15)]', unlocked: false },
                { title: 'Leyenda', desc: '2 años de uso', icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-600/10', border: 'border-yellow-600/20', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', unlocked: false },
                { title: 'Misión Cumplida', desc: 'Todos los logros', icon: Flag, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', unlocked: false },
              ].map((medal, i) => (
                <div key={i} className={cn(
                  "bg-slate-800 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center text-center gap-3 transition-colors cursor-pointer",
                  medal.unlocked ? "hover:border-slate-600" : "opacity-50 grayscale hover:opacity-70"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border",
                    medal.unlocked ? cn(medal.bg, medal.color, medal.border, medal.shadow) : "bg-slate-700 text-slate-400 border-slate-600"
                  )}>
                    {medal.unlocked ? <medal.icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{medal.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{medal.unlocked ? medal.desc : 'Desbloquear'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Adult Mode
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-24 relative overflow-hidden">
      {renderPinModal()}
      {toast && (
        <div className={cn(
          "fixed top-4 left-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-center animate-in fade-in slide-in-from-top-4",
          toast.type === 'warning' ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
        )}>
          {toast.text}
        </div>
      )}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold leading-tight flex-1 text-center">Perfil</h2>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* User Info Section */}
        <div className="flex flex-col items-center p-6 gap-4">
          <div className="relative">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 border-4 border-blue-600/20" 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop")' }}
            ></div>
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-slate-50 dark:border-slate-900 shadow-sm flex items-center justify-center">
              <Edit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-[22px] font-bold leading-tight text-center">Carlos Mendoza</p>
            <div className="flex items-center gap-1.5 mt-1 bg-blue-600/10 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400">
              <Award className="w-4 h-4" />
              <p className="text-sm font-medium">Usuario Experto</p>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="mt-2 mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <h3 className="text-lg font-bold px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Información Médica
          </h3>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Presión prescrita</p>
              <p className="text-sm font-medium">10 cmH2O</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Tipo de máscara</p>
              <p className="text-sm font-medium">Nasal (AirFit N20)</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Última polisomnografía</p>
              <p className="text-sm font-medium">12/05/2023</p>
            </div>
          </div>
        </div>

        {/* App Configuration */}
        <div className="mt-4 mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <h3 className="text-lg font-bold px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Configuración de la App
          </h3>
          <div className="flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Modo de Perfil</span>
              </div>
              <select 
                value={mode} 
                onChange={handleModeChange}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              >
                <option value="adult">Adulto</option>
                <option value="child">Infantil</option>
              </select>
            </div>
            <button className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left w-full">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Idioma</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <span className="text-sm">Castellano</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Notificaciones</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Modo Oscuro</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Device and Supplies */}
        <div className="mt-4 mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <h3 className="text-lg font-bold px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Dispositivo y Repuestos
          </h3>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Estado del Filtro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/4 h-full bg-orange-500"></div>
                </div>
                <span className="text-xs text-orange-500 font-medium">25%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Horas de Motor</span>
              </div>
              <p className="text-sm font-medium">4,250 hs</p>
            </div>

            {/* Limpieza de Máscara */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-medium">Limpieza de Máscara</span>
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  daysWithoutCleaning >= 5 ? "text-red-500" : "text-emerald-500"
                )}>
                  Hace {daysWithoutCleaning} {daysWithoutCleaning === 1 ? 'día' : 'días'}
                </span>
              </div>
              <button 
                onClick={() => setDaysWithoutCleaning(0)}
                className="w-full mt-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2 rounded-lg flex justify-center items-center gap-2 transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4" />
                He limpiado la máscara hoy
              </button>
            </div>

            <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              Pedir Repuestos
            </button>
          </div>
        </div>

        {/* Security & Legal */}
        <div className="mt-4 mx-4 mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex flex-col">
            <button className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left w-full">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Seguridad y Biometría</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            <button className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left w-full">
              <div className="flex items-center gap-3">
                <Gavel className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Portal DMV</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Certificados de aptitud</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        <button className="mx-4 mb-8 w-[calc(100%-2rem)] flex justify-center items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 py-3 rounded-lg transition-colors font-medium">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </main>
    </div>
  );
}
