# 🌙 DormirMejorApp - Tu Compañero de Descanso

DormirMejorApp es una aplicación diseñada para transformar la vida de pacientes con apnea del sueño. Combinamos el seguimiento médico con el poder de la Inteligencia Artificial (Simbie AI) para que cada noche sea un paso hacia una mejor salud.

---

## 🚀 Estado Actual del Proyecto (v1.5.0)
**Estado**: Estable y Funcional.
Todo el sistema de **Onboarding** y el **Dashboard principal** han sido validados y funcionan correctamente.

### ✨ Funcionalidades Estrella
1.  **Simbie AI (Visión Artificial)**: Simbie ahora puede "ver". Puedes subir fotos de tu equipo CPAP o de tu cara con la máscara, y Simbie analizará posibles fugas o errores.
    - *Nota técnica*: Las imágenes se optimizan automáticamente antes de enviarse para ahorrar datos y evitar errores.
2.  **Dashboard Inteligente**: Resumen de tus horas de sueño, calidad y "niebla mental".
3.  **Comunidad**: Espacio social para compartir consejos (Próximamente: subida de fotos en posts).
4.  **Onboarding Guiado**: Configuración fácil de tu equipo y presión médica.

---

## 🛠️ Lo que hemos arreglado hoy (Historial técnico)
*Si eres programador o IA, lee esto para entender los últimos cambios:*

- **Arreglo de Pantalla de Carga**: Se añadió un sistema de seguridad que evita que la app se quede bloqueada en "Cargando..." si la base de datos tarda en responder.
- **Simbie AI Multimodal**: Implementado el soporte para imágenes en el chat. Se utiliza `gemini-1.5-flash` con un sistema de reintentos automático para asegurar respuestas rápidas.
- **Optimización de Imágenes**: La app ahora reduce el tamaño de las fotos automáticamente en el móvil/navegador antes de subirlas (máx 1024px, calidad 80%).

---

## 📂 Guía Rápida para Desarrolladores (o Agentes de IA)
- **Tecnologías**: React 19, Supabase, Google Gemini.
- **Base de Datos**: Tablas `user_profiles`, `sleep_records` y `community_posts`.
- **Variables necesarias**: `GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## 📝 Próximos pasos (Backlog de Fidel)
- [ ] **Fotos en Comunidad**: Permitir que los usuarios suban fotos en sus publicaciones del feed.
- [ ] **Sincronización Google Fit**: Conectar automáticamente los datos de otros relojes/apps de salud.
- [ ] **Notificaciones**: Avisos para limpiar la máscara y el filtro.

---

*Este archivo es la única fuente de verdad del proyecto. Actualizado el 17 de marzo, 2026.*
