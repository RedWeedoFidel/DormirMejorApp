import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Image as ImageIcon, Video, Mic, Bot, Loader2, Paperclip, ArrowLeft, Settings, SlidersHorizontal, Wind, ShoppingCart, Brain, MicOff } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';
import { useLiveAudio } from '../hooks/useLiveAudio';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
};

export default function SimbieAI() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [lastSleep, setLastSleep] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<{ file: File; dataUrl: string; type: 'image' | 'video' } | null>(
    null
  );
  
  const { isConnecting, isConnected, error, transcript, connect, disconnect } = useLiveAudio();
  const isListening = isConnected || isConnecting;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const { data: p } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle();
        const { data: s } = await supabase.from('sleep_records').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(1).maybeSingle();
        setProfile(p);
        setLastSleep(s);
      };
      fetchData();
    }
  }, [user]);

  const systemInstruction = useMemo(() => {
    let base = 'Eres Simbie, un asistente experto en sueño, apnea del sueño y terapia CPAP. Todas tus respuestas deben estar enfocadas en este contexto. Si el usuario menciona "máquina", asume que se refiere a una máquina CPAP o BiPAP, nunca a una máquina de café u otro electrodoméstico. Usa siempre el sistema métrico (litros, mililitros, centímetros, etc.) para medidas. Sé empático y profesional.';
    
    if (profile) {
      base += `\n\nDATOS DEL USUARIO:\n- Nombre: ${profile.name || 'Usuario'}\n- En tratamiento: ${profile.in_treatment ? 'Sí' : 'No'}`;
      if (profile.machine_model) base += `\n- Máquina: ${profile.machine_model}`;
      if (profile.mask_model) base += `\n- Máscara: ${profile.mask_model}`;
      if (profile.prescribed_pressure) base += `\n- Presión prescrita: ${profile.prescribed_pressure} cmH2O`;
      if (profile.apnea_severity) base += `\n- Gravedad de apnea: ${profile.apnea_severity}`;
    }

    if (lastSleep) {
      base += `\n\nÚLTIMA NOCHE (${lastSleep.date}):\n- Horas dormidas: ${lastSleep.sleep_hours}h\n- Calidad: ${lastSleep.sleep_quality}%\n- Fugas de máscara: ${lastSleep.mask_leaks ? 'Sí' : 'No'}`;
    }

    return base;
  }, [profile, lastSleep]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, transcript]);

  const toggleListening = () => {
    if (isListening) {
      disconnect();
    } else {
      connect(systemInstruction);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('video/') ? 'video' : 'image';
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        file,
        dataUrl: reader.result as string,
        type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      mediaUrl: selectedFile?.dataUrl,
      mediaType: selectedFile?.type,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const currentFile = selectedFile;
    setSelectedFile(null);

    try {
      let responseText = '';

      if (currentFile) {
        const base64Data = currentFile.dataUrl.split(',')[1];
        const parts: any[] = [];
        
        if (textToSend.trim()) {
          parts.push({ text: textToSend });
        } else {
          parts.push({ text: currentFile.type === 'image' ? 'Analiza esta imagen.' : 'Analiza este video.' });
        }

        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: currentFile.file.type,
          },
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: { parts },
          config: {
            systemInstruction: systemInstruction,
          }
        });
        
        responseText = response.text || 'No pude analizar el archivo.';
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: textToSend,
          config: {
            systemInstruction: systemInstruction,
          }
        });
        responseText = response.text || 'No pude generar una respuesta.';
      }

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    handleSend(text);
  };

  if (messages.length === 0 && transcript.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 pointer-events-none"></div>
        
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-800 transition-colors text-slate-300">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Centro de Soporte Simbie AI</h1>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-800 transition-colors text-slate-300">
            <Settings className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-6 relative z-10">
          <div className="relative flex items-center justify-center mb-10 w-full aspect-square max-w-[320px]">
            <div className={cn("absolute inset-0 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000", isListening && "animate-pulse bg-blue-500/30")}></div>
            <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute w-48 h-48 bg-blue-500/30 rounded-full blur-xl"></div>
            <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden cursor-pointer" onClick={toggleListening}>
              {isConnecting ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : isListening ? (
                <div className="flex items-center justify-center gap-1 h-12">
                  <div className={cn("w-1 bg-white/80 rounded-full transition-all duration-300", isListening ? "h-8 animate-bounce" : "h-4")}></div>
                  <div className={cn("w-1 bg-white/90 rounded-full transition-all duration-300 delay-75", isListening ? "h-12 animate-bounce" : "h-8")}></div>
                  <div className={cn("w-1 bg-white rounded-full transition-all duration-300 delay-150", isListening ? "h-10 animate-bounce" : "h-6")}></div>
                  <div className={cn("w-1 bg-white/90 rounded-full transition-all duration-300 delay-75", isListening ? "h-14 animate-bounce" : "h-10")}></div>
                  <div className={cn("w-1 bg-white rounded-full transition-all duration-300 delay-150", isListening ? "h-8 animate-bounce" : "h-5")}></div>
                  <div className={cn("w-1 bg-white/80 rounded-full transition-all duration-300", isListening ? "h-6 animate-bounce" : "h-3")}></div>
                </div>
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute -bottom-12 text-center w-full">
              {error ? (
                <p className="text-red-400 text-sm font-medium">{error}</p>
              ) : isConnecting ? (
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Conectando...</p>
              ) : isListening ? (
                <>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Escuchando...</p>
                  <h2 className="text-2xl font-bold text-white">Simbie está escuchando...</h2>
                </>
              ) : (
                <>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Toca para hablar</p>
                  <h2 className="text-2xl font-bold text-white">Habla con Simbie</h2>
                </>
              )}
            </div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 mt-12">
            <button onClick={() => handleQuickAction(`Hola Simbie, soy ${profile?.name?.split(' ')[0] || 'yo'}. ¿Me ayudas con mi máquina ${profile?.machine_model || 'CPAP'}?`)} className="group flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">Ajustar su Equipo</h3>
                <p className="text-xs text-slate-400">Personalizado para su {profile?.machine_model?.split(' ')[0] || 'máquina'}</p>
              </div>
            </button>
            <button onClick={() => handleQuickAction("Siento que me asfixio, ¿qué hago?")} className="group flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-red-900/30 text-red-400 flex items-center justify-center shrink-0">
                <Wind className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">Detener Sensación de Asfixia</h3>
                <p className="text-xs text-slate-400">Impulso de aire de emergencia</p>
              </div>
            </button>
            <button onClick={() => handleQuickAction("¿Cómo fue mi registro de sueño anoche?")} className="group flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-900/30 text-green-400 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">Analizar Mi Noche</h3>
                <p className="text-xs text-slate-400">Revisar registros recientes</p>
              </div>
            </button>
            <button onClick={() => handleQuickAction("Quiero hacer ejercicios de desensibilización")} className="group flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">Desensibilización</h3>
                <p className="text-xs text-slate-400">Ejercicios de habituación</p>
              </div>
            </button>
          </div>

          <div className="w-full">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-1">Preguntas Sugeridas</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleQuickAction(`¿Mi máscara ${profile?.mask_model || ''} es compatible con mi presión?`)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors">
                "¿Mi máscara es compatible?"
              </button>
              <button onClick={() => handleQuickAction("Muéstrame mi puntaje de sueño")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors">
                "Muéstrame mi puntaje de sueño"
              </button>
              <button onClick={() => handleQuickAction("Iniciar ejercicio de respiración")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors">
                "Iniciar ejercicio de respiración"
              </button>
            </div>
          </div>
        </main>
        
        {/* Floating input bar for when there are no messages yet */}
        <div className="fixed bottom-24 left-0 w-full px-4 z-50">
          <div className="max-w-md mx-auto bg-slate-800 rounded-full p-2 flex items-center gap-2 shadow-xl border border-slate-700">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-700 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-sm px-2"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() && !selectedFile}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Simbie AI</h1>
            <p className="text-xs text-green-500 font-medium">{isListening ? 'Escuchando...' : 'En línea'}</p>
          </div>
        </div>
        <button 
          onClick={toggleListening}
          className={cn(
            "p-2 rounded-full transition-colors",
            isListening ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          )}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex w-full',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl p-3 shadow-sm',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
              )}
            >
              {msg.mediaUrl && (
                <div className="mb-2 rounded-lg overflow-hidden">
                  {msg.mediaType === 'image' ? (
                    <img src={msg.mediaUrl} alt="Uploaded content" className="w-full h-auto max-h-48 object-cover" />
                  ) : (
                    <video src={msg.mediaUrl} controls className="w-full h-auto max-h-48 object-cover" />
                  )}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {transcript.map((msg, idx) => (
          <div
            key={`transcript-${idx}`}
            className={cn(
              'flex w-full',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl p-3 shadow-sm',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Simbie está pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        {selectedFile && (
          <div className="mb-3 relative inline-block">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-blue-500">
              {selectedFile.type === 'image' ? (
                <img src={selectedFile.dataUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={selectedFile.dataUrl} className="w-full h-full object-cover" />
              )}
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            disabled={isLoading || isListening}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Simbie está escuchando..." : "Pregúntale a Simbie..."}
              className="w-full bg-slate-100 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-full py-3 pl-4 pr-12 text-sm text-slate-900 dark:text-white placeholder-slate-500"
              disabled={isLoading || isListening}
            />
            <button
              onClick={toggleListening}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-colors rounded-full",
                isListening ? "text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" : "text-slate-400 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isLoading || isListening || (!input.trim() && !selectedFile)}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
