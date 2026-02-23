# Integración WebSocket - Monitor de Mensajes en Tiempo Real

## Resumen de la Integración

Se ha integrado exitosamente la conexión WebSocket con tu aplicación Angular para monitorear mensajes en tiempo real desde múltiples plataformas de mensajería (WhatsApp, Messenger, Instagram).

## Archivos Creados/Modificados

### 1. **Servicio de Conexión WebSocket** 
📁 `src/app/core/services/realtime.service.ts`

Este servicio maneja toda la lógica de conexión con el backend mediante Socket.IO:

- **Conexión automática** al backend: `https://lattice-api-backend.onrender.com`
- **Eventos escuchados:**
  - `new_message`: Nuevos mensajes en tiempo real
  - `message_saved`: Eventos de guardado en MongoDB
  - Reconexión automática (hasta 10 intentos)

**Interfaz LatticeMessage:**
```typescript
export interface LatticeMessage {
  message_id?: string;
  from_number?: string;
  profile_name?: string;
  text?: { body: string } | string;
  body?: string;
  message?: string;
  type: 'text' | 'image' | 'button' | 'interactive' | 'unknown';
  messaging_product: 'whatsapp' | 'messenger' | 'instagram' | 'unknown';
  timestamp: string;
  media_url?: string | null;
  image_url?: string | null;
  _evt?: 'Nuevo Mensaje' | 'Guardado en MongoDB' | 'Histórico';
}
```

### 2. **Componente Monitor**
📁 `src/app/shared/components/monitor/monitor.component.ts`

Componente standalone que muestra los mensajes en tiempo real con:

- **Vista en lista**: Mensajes ordenados cronológicamente (más recientes primero)
- **Información mostrada**:
  - Nombre del contacto
  - Texto del mensaje
  - Timestamp formateado
  - Plataforma (WhatsApp, Messenger, Instagram)
  - Tipo de mensaje (texto, imagen, etc.)
  
- **Características**:
  - Animaciones suaves de entrada
  - Límite de 50 mensajes en memoria
  - Desuscripción automática al destruir el componente
  - Estilos responsivos

### 3. **Página Monitor del Dashboard**
📁 `src/app/pages/dashboard/monitor/monitor.component.ts`

Componente contenedor que envuelve el monitor dentro del layout del dashboard.

### 4. **Rutas Actualizadas**
📁 `src/app/pages/dashboard/dashboard.routes.ts`

Se agregó la ruta del monitor:
```
/monitor → Acceso a la página de monitoreo
```

### 5. **Navegación Actualizada**
📁 `src/app/layout/sidebar/sidebar.html`

Se agregó un botón de navegación al monitor en la barra lateral con ícono de pantalla.

## Cómo Usar

### Acceder al Monitor
1. Navega a `http://localhost:4200/monitor`
2. O haz clic en el ícono de monitor en la barra lateral

### Enviar Mensajes de Prueba
Usa el archivo HTML proporcionado (`Simulador mensaje Wsp.html`) para simular mensajes:

```html
<!-- Abre el archivo en el navegador -->
<!-- Completa los campos: nombre, número, mensaje -->
<!-- Haz clic en "Enviar Mensaje" -->
```

El flujo es:
1. Tu simulador envía a: `https://lattice-api-webhook.onrender.com/webhook/message`
2. El backend procesa y emite el evento
3. Tu aplicación Angular recibe vía WebSocket
4. El monitor muestra el mensaje en tiempo real

## Estructura del Código

```
src/app/
├── core/
│   └── services/
│       └── realtime.service.ts          ← Lógica WebSocket
├── shared/
│   └── components/
│       └── monitor/
│           └── monitor.component.ts      ← Componente del monitor
└── pages/
    └── dashboard/
        ├── monitor/
        │   └── monitor.component.ts      ← Página del monitor
        └── dashboard.routes.ts           ← Rutas actualizadas
```

## Instalaciones Realizadas

- ✅ `socket.io-client` - Cliente WebSocket necesario

## Próximos Pasos (Opcionales)

1. **Filtros**: Agregar filtros por plataforma, tipo de mensaje, fecha
2. **Búsqueda**: Implementar búsqueda de mensajes históricos
3. **Exportar**: Descargar mensajes como PDF/CSV
4. **Alertas**: Notificaciones push para mensajes importantes
5. **Almacenamiento**: Persistencia de histórico local
6. **Sincronización**: Cargar mensajes históricos del backend al conectarse

## Troubleshooting

### El monitor no muestra mensajes
1. Verifica que el backend esté corriendo en `https://lattice-api-backend.onrender.com`
2. Abre la consola (F12) y revisa los logs de conexión
3. Asegúrate de que tu cliente WebSocket esté conectado: `✅ Conectado al WebSocket`

### Errores de compilación
Si hay errores relacionados con `socket.io-client`:
```bash
npm install socket.io-client@latest
```

### El componente no carga
Verifica que:
- El servicio `RealtimeService` esté en `providedIn: 'root'`
- El componente `MonitorComponent` esté marcado como `standalone: true`
- Los imports estén correctos en la página padre

## Referencia Rápida

```typescript
// En cualquier componente, inyectar el servicio:
import { RealtimeService } from '@core/services/realtime.service';

constructor(private realtime: RealtimeService) {}

// Escuchar mensajes nuevos:
this.realtime.onNewMessage().subscribe(msg => {
  console.log('Nuevo mensaje:', msg);
});

// Escuchar eventos de guardado:
this.realtime.onMessageSaved().subscribe(msg => {
  console.log('Guardado en BD:', msg);
});

// Desconectar manualmente:
this.realtime.disconnect();
```

---

**Creado:** November 12, 2025
**Versión:** 1.0.0
