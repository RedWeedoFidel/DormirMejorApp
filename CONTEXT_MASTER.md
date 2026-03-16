# 🧠 Registro Maestro de Proyecto: DormirMejorApp

Este documento es la única fuente de verdad para la continuidad del proyecto. Combina la arquitectura base, las funcionalidades de IA implementadas y las correcciones técnicas críticas.

## 📌 Estado Actual del Proyecto
- **Versión**: 1.5.0
- **Última actualización**: 17 de marzo, 2026
- **Estado**: Funcional y desplegado localmente.

---

## 🏗️ Arquitectura Técnica de Base

### 1. Stack Tecnológico
- **Frontend**: React 19 + Vite (Port 3000).
- **Styling**: Tailwind CSS + Framer Motion.
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions).
- **IA**: Google Gemini 1.5 Flash (vía Edge Functions).

### 2. Base de Datos (Esquema `public`)
- **`user_profiles`**: Datos médicos (máquina, máscara, severidad de apnea, estado de onboarding).
- **`user_stats`**: Rachas de uso y horas totales.
- **`sleep_records`**: Registros diarios de calidad y horas.
- **`community_posts` / `community_likes`**: Feed social de usuarios.

---

## 👁️ Implementación: Simbie AI Vision (Completado)

Simbie ahora tiene capacidades multimodales.
- **Frontend (`SimbieAI.tsx`)**:
  - Selector de archivos y acceso directo a cámara móvil (`capture="environment"`).
  - **Optimización Crítica**: Redimensionamiento automático en cliente vía Canvas (máx 1024px, JPEG 80%) para evitar errores de "Payload Too Large" en Supabase.
  - Envío de imágenes en Base64 con headers de autorización JWT.
- **Backend (`gemini-chat` Edge Function)**:
  - Sistema de reintentos: Prueba secuencialmente `gemini-1.5-flash`, `gemini-flash-latest` and `gemini-1.5-pro` para mitigar errores de cuota.
  - Soporta `inlineData` para análisis de imágenes de equipos CPAP y códigos de error.

---

## 🛠️ Correcciones de Rendimiento Recientes

### 1. Auth & Loading Screen Fix (Marzo 2026)
- **Problema**: La app se quedaba bloqueada en "Cargando..." si la respuesta de Supabase para el perfil de usuario era lenta.
- **Solución**: Se implementó un **Safety Timeout** en `AuthContext.tsx`. 
  - Si `fetchProfileData` no resuelve en 5 segundos, la app libera el estado `loading: false` para permitir la navegación.
  - Se añadió logging detallado para trazar la inicialización de Auth.

---

## 📝 Lista de Tareas Pendientes (Backlog)

### Prioridad Alta 🔴
- **Subida de Imágenes en Comunidad**: Implementar la lógica de `storage` en Supabase para `community_posts` (actualmente solo texto).
- **Integración Google Fit**: Terminar la sincronización automática de datos de sueño.

### Prioridad Media 🟡
- **Notificaciones**: Avisar al usuario cuando toque limpiar el equipo (basado en `days_without_cleaning` de `user_stats`).
- **Exportación de Informes**: Generar PDF con las "Tendencias de Recuperación" para llevar al médico.

---

## 🔐 Configuración de Entorno (Recordatorio)
Para que todo funcione, estas variables deben estar en el Dashboard de Supabase (Edge Functions) y en el `.env` local:
- `GEMINI_API_KEY`: Clave de Google AI Studio.
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`.

---

> [!IMPORTANT]
> **Nota para el futuro Antigravity**: Si la app se bloquea en carga, revisa `AuthContext.tsx`. Si Simbie falla al ver fotos, revisa los secretos de la Edge Function en Supabase.
