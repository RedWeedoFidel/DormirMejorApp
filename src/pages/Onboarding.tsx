import React, { useState } from 'react';
import { Rocket, Shield, Activity, ChevronRight, Moon, Settings, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

type Step = 'welcome' | 'treatment' | 'equipment' | 'pressure' | 'severity' | 'finish';

export default function Onboarding() {
    const { user, refreshOnboardingStatus, setOnboardingCompleted } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('welcome');
    const [loading, setLoading] = useState(false);

    // Form State
    const [inTreatment, setInTreatment] = useState<boolean | null>(null);
    const [machineModel, setMachineModel] = useState('');
    const [maskModel, setMaskModel] = useState('');
    const [prescribedPressure, setPrescribedPressure] = useState<string>('');
    const [apneaSeverity, setApneaSeverity] = useState('');

    const finalizeOnboarding = async (hasTreatment: boolean, severityOverride?: string) => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('user_profiles').update({
                in_treatment: hasTreatment,
                machine_model: hasTreatment ? machineModel : null,
                mask_model: hasTreatment ? maskModel : null,
                prescribed_pressure: hasTreatment && prescribedPressure ? parseFloat(prescribedPressure) : null,
                apnea_severity: hasTreatment ? (severityOverride || apneaSeverity) : null,
                onboarding_completed: true
            }).eq('id', user.id);

            if (error) throw error;
            setStep('finish');
        } catch (err) {
            console.error("Error saving onboarding:", err);
            alert("Hubo un error al guardar tu configuración.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'welcome':
                return (
                    <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Rocket className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">¡Bienvenido a bordo!</h1>
                            <p className="text-slate-400 max-w-xs">Vamos a configurar tu perfil estelar para que tu descanso sea perfecto.</p>
                        </div>
                        <button
                            onClick={() => setStep('treatment')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group"
                        >
                            Empezar Configuración
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                );

            case 'treatment':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold text-white">¿Ya estás en tratamiento?</h2>
                            <p className="text-slate-400">Queremos saber si ya utilizas una máquina CPAP o similar.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => { setInTreatment(true); setStep('equipment'); }}
                                className="flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all text-left group"
                            >
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Sí, estoy en tratamiento</p>
                                    <p className="text-xs text-slate-400">Uso equipo para dormir mejor.</p>
                                </div>
                            </button>
                            <button
                                onClick={() => { setInTreatment(false); finalizeOnboarding(false); }}
                                className="flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-500 transition-all text-left group"
                            >
                                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Aún no / Solo monitorización</p>
                                    <p className="text-xs text-slate-400">Quiero empezar a mejorar mi descanso.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                );

            case 'equipment':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold text-white">Tu Equipo</h2>
                            <p className="text-slate-400">Esto nos ayuda a darte consejos precisos.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Modelo de la Máquina</label>
                                <input
                                    type="text"
                                    value={machineModel}
                                    onChange={(e) => setMachineModel(e.target.value)}
                                    placeholder="Ej. ResMed AirSense 10"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Modelo de la Máscara</label>
                                <input
                                    type="text"
                                    value={maskModel}
                                    onChange={(e) => setMaskModel(e.target.value)}
                                    placeholder="Ej. AirFit P10"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button
                                onClick={() => { setMachineModel('No lo sé'); setMaskModel('No lo sé'); setStep('pressure'); }}
                                className="w-full py-2 text-sm text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Info className="w-4 h-4" />
                                No lo sé, lo completaré más tarde
                            </button>
                        </div>
                        <button
                            onClick={() => setStep('pressure')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                );

            case 'pressure':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold text-white">Presión Recetada</h2>
                            <p className="text-slate-400">¿Qué presión te indicó tu médico para la máquina?</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Presión (cmH2O)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={prescribedPressure}
                                        onChange={(e) => setPrescribedPressure(e.target.value)}
                                        placeholder="Ej. 10.5"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                        cmH2O
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => { setPrescribedPressure(''); setStep('severity'); }}
                                className="w-full py-2 text-sm text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Info className="w-4 h-4" />
                                No lo sé / No tengo el dato
                            </button>
                        </div>
                        <button
                            onClick={() => setStep('severity')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                );

            case 'severity':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold text-white">Severidad de la Apnea</h2>
                            <p className="text-slate-400">¿Qué nivel te indicó tu médico?</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {['Leve', 'Moderada', 'Grave', 'No lo sé'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setApneaSeverity(s); finalizeOnboarding(true, s); }}
                                    className={cn(
                                        "p-4 rounded-2xl border text-center font-bold transition-all",
                                        apneaSeverity === s
                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'finish':
                return (
                    <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-700">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">¡Todo listo!</h1>
                            <p className="text-slate-400">Tu perfil ha sido configurado. Ahora, a descansar como un profesional.</p>
                        </div>
                        <button
                            onClick={() => {
                                setOnboardingCompleted(true);
                                navigate('/home');
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20"
                        >
                            Entrar a la Nave
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 p-6 relative overflow-hidden items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900 pointer-events-none"></div>

            {/* Decorative stars */}
            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-30 animate-pulse delay-75"></div>
            <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse delay-150"></div>

            <div className="z-10 w-full max-w-md">
                {step !== 'welcome' && step !== 'finish' && (
                    <div className="mb-8 flex justify-between items-center px-2">
                        <div className="flex gap-2">
                            <div className={cn("h-1.5 w-6 rounded-full transition-colors", step === 'treatment' || step === 'equipment' || step === 'pressure' || step === 'severity' ? "bg-blue-500" : "bg-slate-700")}></div>
                            <div className={cn("h-1.5 w-6 rounded-full transition-colors", step === 'equipment' || step === 'pressure' || step === 'severity' ? "bg-blue-500" : "bg-slate-700")}></div>
                            <div className={cn("h-1.5 w-6 rounded-full transition-colors", step === 'pressure' || step === 'severity' ? "bg-blue-500" : "bg-slate-700")}></div>
                            <div className={cn("h-1.5 w-6 rounded-full transition-colors", step === 'severity' ? "bg-blue-500" : "bg-slate-700")}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paso {step === 'treatment' ? 1 : step === 'equipment' ? 2 : step === 'pressure' ? 3 : 4} de 4</span>
                    </div>
                )}

                {renderStep()}

                {step !== 'welcome' && step !== 'finish' && step !== 'treatment' && (
                    <p className="mt-8 text-center text-xs text-slate-500">
                        No te preocupes, siempre puedes editar estos datos <br /> en tu perfil más adelante.
                    </p>
                )}
            </div>
        </div>
    );
}

