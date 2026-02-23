# 🚀 Guía Rápida: Monitor de Mensajes en Tiempo Real

## ✅ Instalación Completada

Se ha integrado exitosamente el sistema de WebSocket con tu aplicación Angular. Aquí está todo lo que necesitas saber para empezar.

---

## 📍 Dónde Acceder

### Opción 1: Desde la Barra Lateral
- Abre tu aplicación en `http://localhost:4200`
- Busca el ícono de **monitor** (pantalla) en la barra lateral izquierda
- Haz clic para acceder

### Opción 2: URL Directa
```
http://localhost:4200/monitor
```

---

## 🧪 Probar la Conexión

### Paso 1: Abre el Monitor
Navega a `/monitor` en tu aplicación

### Paso 2: Simula un Mensaje
1. Abre el archivo `Simulador mensaje Wsp.html` en tu navegador
2. Completa los campos:
   - **Nombre del contacto**: Ej: "Juan"
   - **Número de teléfono**: Ej: "56912345678"
   - **Mensaje**: Ej: "Hola, ¿cómo estás?"
3. Haz clic en **"Enviar Mensaje"**

### Paso 3: Observa el Monitor
El mensaje debe aparecer instantáneamente en el monitor con:
- ✅ Nombre del contacto
- ✅ Texto del mensaje
- ✅ Hora exacta
- ✅ Plataforma (WhatsApp/Messenger/Instagram)
- ✅ Tipo de mensaje

---

## 🏗️ Arquitectura

```
┌─────────────────────┐
│  Tu Aplicación      │
│  Angular            │
└──────────┬──────────┘
           │
      RealtimeService
    (WebSocket Socket.IO)
           │
           ▼
┌──────────────────────┐
│  Backend             │
│  (Render.com)        │
└──────────┬───────────┘
           │
      Webhook HTTP
           │
           ▼
┌──────────────────────┐
│  Simulador           │
│  (HTML File)         │
└──────────────────────┘
```

**Flujo de mensajes:**
1. Simulador → Webhook Backend (HTTP POST)
2. Backend procesa → Emite evento vía WebSocket
3. Tu aplicación recibe → Muestra en tiempo real

---

## 📁 Archivos Creados/Modificados

| Archivo | Descripción |
|---------|-------------|
| `src/app/core/services/realtime.service.ts` | 🔧 Servicio WebSocket |
| `src/app/shared/components/monitor/monitor.component.ts` | 📺 Componente visualización |
| `src/app/pages/dashboard/monitor/monitor.component.ts` | 📄 Página del dashboard |
| `src/app/pages/dashboard/dashboard.routes.ts` | 🗺️ Rutas actualizadas |
| `src/app/layout/sidebar/sidebar.html` | 🧭 Navegación actualizada |
| `src/app/core/services/index.ts` | 📦 Barrel export |

---

## 💻 Instalaciones

```bash
npm install socket.io-client
npm install --save-dev @types/socket.io-client
```

---

## 🔌 API del Servicio

### Dentro de cualquier componente:

```typescript
// Importar
import { RealtimeService, LatticeMessage } from '@core/services';

export class MiComponente {
  constructor(private realtime: RealtimeService) {}

  // Escuchar nuevos mensajes
  escuchar() {
    this.realtime.onNewMessage().subscribe((msg: LatticeMessage) => {
      console.log('Nuevo mensaje:', msg);
      // Hacer algo con el mensaje
    });
  }

  // Escuchar eventos de guardado
  guardar() {
    this.realtime.onMessageSaved().subscribe((msg: LatticeMessage) => {
      console.log('Guardado en BD:', msg);
    });
  }

  // Desconectar
  desconectar() {
    this.realtime.disconnect();
  }
}
```

---

## 🎨 Estructura de un Mensaje

```typescript
interface LatticeMessage {
  message_id?: string;                                    // ID único
  from_number?: string;                                   // Número de origen
  profile_name?: string;                                  // Nombre del contacto
  text?: { body: string } | string;                       // Texto del mensaje
  body?: string;                                          // Alternativa 1
  message?: string;                                       // Alternativa 2
  type: 'text' | 'image' | 'button' | 'interactive';     // Tipo
  messaging_product: 'whatsapp' | 'messenger' | 'instagram'; // Plataforma
  timestamp: string;                                      // Tiempo (Unix)
  media_url?: string | null;                              // URL de media
  image_url?: string | null;                              // URL de imagen
  _evt?: 'Nuevo Mensaje' | 'Guardado en MongoDB';         // Evento
}
```

---

## 🔧 Troubleshooting

### ❌ "El monitor no muestra mensajes"

**Solución:**
1. Abre la consola (F12)
2. Busca en la consola → Should see: `✅ Conectado al WebSocket`
3. Si ves `❌ Desconectado`, verifica:
   - Que el backend esté corriendo
   - La URL: `https://lattice-api-backend.onrender.com`
   - Tu conexión a internet

### ❌ "Error: Cannot find module 'socket.io-client'"

**Solución:**
```bash
npm install socket.io-client --save
npm install @types/socket.io-client --save-dev
```

### ❌ "El componente no carga"

**Solución:**
- Verifica que la ruta sea `/monitor`
- Revisa que el componente esté en el dashboard.routes.ts
- Recarga la página (Ctrl+F5)

---

## 🎯 Próximas Características (Ideas)

- [ ] Filtrar mensajes por plataforma
- [ ] Buscar en histórico
- [ ] Descargar mensajes como PDF
- [ ] Notificaciones push
- [ ] Cargar histórico al conectarse
- [ ] Exportar a CSV
- [ ] Estadísticas en tiempo real

---

## 📞 Soporte

Si necesitas ayuda adicional o integración con otras plataformas:

1. **Backend URL:** `https://lattice-api-backend.onrender.com`
2. **Webhook URL:** `https://lattice-api-webhook.onrender.com/webhook/message`
3. **Documentación completa:** Ver `MONITOR_INTEGRATION.md`

---

**Versión:** 1.0.0  
**Fecha:** November 12, 2025  
**Estado:** ✅ Completo y Funcional
