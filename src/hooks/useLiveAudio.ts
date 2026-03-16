import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function useLiveAudio() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'model', text: string }[]>([]);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const stopAudio = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    nextPlayTimeRef.current = 0;
  }, []);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    stopAudio();
    setIsConnected(false);
    setIsConnecting(false);
  }, [stopAudio]);

  const connect = useCallback(async (customSystemInstruction?: string) => {
    setIsConnecting(true);
    setError(null);
    setTranscript([]);

    const defaultSystemInstruction = 'Eres Simbie, un asistente experto en sueño, apnea del sueño y terapia CPAP. Todas tus respuestas deben estar enfocadas estrictamente en este contexto. Si el usuario menciona "máquina", asume que se refiere a una máquina CPAP o BiPAP, nunca a una máquina de café u otro electrodoméstico. Usa siempre el sistema métrico (litros, mililitros, centímetros, etc.) para medidas. Eres amable, empático y experto en trastornos del sueño. Responde de forma concisa y conversacional en español.';

    try {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      nextPlayTimeRef.current = audioContext.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: customSystemInstruction || defaultSystemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              const base64 = arrayBufferToBase64(pcm16.buffer);
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' },
                });
              });
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle interruption
            if (message.serverContent?.interrupted && audioContextRef.current) {
              nextPlayTimeRef.current = audioContextRef.current.currentTime;
            }

            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData && part.inlineData.data && audioContextRef.current) {
                  const ctx = audioContextRef.current;
                  const buffer = base64ToArrayBuffer(part.inlineData.data);
                  const pcm16 = new Int16Array(buffer);
                  const float32 = new Float32Array(pcm16.length);
                  for (let i = 0; i < pcm16.length; i++) {
                    float32[i] = pcm16[i] / 0x7FFF;
                  }

                  const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
                  audioBuffer.getChannelData(0).set(float32);

                  const playSource = ctx.createBufferSource();
                  playSource.buffer = audioBuffer;
                  playSource.connect(ctx.destination);

                  if (nextPlayTimeRef.current < ctx.currentTime) {
                    nextPlayTimeRef.current = ctx.currentTime;
                  }
                  playSource.start(nextPlayTimeRef.current);
                  nextPlayTimeRef.current += audioBuffer.duration;
                }

                if (part.text) {
                  setTranscript(prev => [...prev, { role: 'model', text: part.text as string }]);
                }
              }
            }
          },
          onerror: (err) => {
            console.error('Live API Error:', err);
            setError('Error de conexión con Simbie.');
            disconnect();
          },
          onclose: () => {
            disconnect();
          },
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error('Failed to connect:', err);
      setError(err.message || 'Error al conectar el micrófono.');
      disconnect();
    }
  }, [disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnecting,
    isConnected,
    error,
    transcript,
    connect,
    disconnect,
  };
}
