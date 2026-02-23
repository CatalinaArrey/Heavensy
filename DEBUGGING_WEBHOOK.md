# 🔍 Debugging: Webhook No Está Llegando

## Problema
Los mensajes NO están llegando al webhook. Necesitamos verificar el flujo completo.

## Checklist de Debugging

### 1️⃣ **Verificar Conexión WebSocket (PASO 1)**

Ejecuta:
```bash
npm start
```

Abre la app en `http://localhost:4200`

Abre **F12 Console** y deberías ver:

```
[RealtimeService] 🔧 Inicializando conexión a: https://lattice-api-backend.onrender.com
[RealtimeService] ✅ Conectado al WebSocket
[RealtimeService] Socket ID: xxxxx
[Inbox] Iniciando escucha de mensajes...
[RealtimeService] 👂 Registrando listener para "new_message"
[Inbox] Suscripción establecida. Total suscripciones: 1
```

**❌ Si NO ves estos logs:** El RealtimeService no se está inicializando.
- Verifica que InboxComponent esté siendo cargado
- Verifica que RealtimeService esté inyectado

---

### 2️⃣ **Enviar Mensaje de Prueba (PASO 2)**

Ve a: `http://localhost:4200/clientes` (Inbox)

Abre **F12 Console**

Usa el HTML simulator para enviar un mensaje:
- Abre `Simulador mensaje Wsp.html` (desde el repo)
- Selecciona un número
- Escribe un mensaje
- Haz click en "Enviar"

**Observa qué logs aparecen en F12:**

#### Caso A: ✅ TODO FUNCIONA
```
[RealtimeService] 📨 Evento "new_message" recibido: {
  profile_name: "Juan",
  text: { body: "Hola!" },
  messaging_product: "whatsapp",
  timestamp: "2025-11-12T10:30:00",
  ...
}
[Inbox] ✅ Nuevo mensaje recibido: {...}
[Inbox] Procesando cliente: Juan
[Inbox] ⭐ Cliente NUEVO: Juan. Creando...
[Inbox] ✅ Cliente Juan agregado a PROSPECTOS
[Inbox] 💾 Guardando grupos... Total clientes: 1
```

#### Caso B: ❌ NO LLEGA AL EVENTO
```
// SOLO ves los logs iniciales, pero NADA cuando envías mensaje
[RealtimeService] 🔧 Inicializando...
[RealtimeService] ✅ Conectado...
[Inbox] Iniciando escucha...
// ... silencio ...
```

#### Caso C: ⚠️ EVENTO LLEGA PERO NO PROCESA
```
[RealtimeService] 📨 Evento "new_message" recibido: {...}
// Pero NADA de [Inbox] logs
```

---

## 🔧 Qué Verificar Según Cada Caso

### Si es Caso B (Evento NO llega)

Esto significa que el **backend NO está enviando eventos Socket.IO**

**Verificaciones:**

1. **¿El backend está corriendo?**
   ```bash
   # Conecta a https://lattice-api-backend.onrender.com
   # Abre F12 y mira Network tab
   # Deberías ver una conexión WebSocket
   ```

2. **¿El webhook del backend está configurado?**
   ```
   Backend URL: https://lattice-api-webhook.onrender.com/webhook/message
   ```
   Pregunta: ¿Dónde se envía el mensaje desde WhatsApp/Messenger/Instagram?

3. **¿El servidor está escuchando y emitiendo?**
   En el backend Node.js debería tener algo como:
   ```javascript
   io.emit('new_message', messageData);
   ```

### Si es Caso C (Evento llega pero NO procesa)

El evento llega a `RealtimeService` pero no llega al subscriber en `Inbox`

**Verificar:**
- ¿El `onNewMessage()` está creando múltiples listeners?
- ¿Hay error silencioso en `agregarOActualizarCliente()`?

**Solución propuesta:** Cambiar a RxJS Subject (ver abajo)

---

## 🔧 Solución Alternativa: Usar RxJS Subject

Si el problema es que hay múltiples listeners, la solución es usar `Subject`:

```typescript
// En RealtimeService
import { Subject } from 'rxjs';

private messageSubject = new Subject<LatticeMessage>();

constructor() {
  console.log('[RealtimeService] 🔧 Inicializando...');
  this.socket = io(this.BACKEND_URL, {...});
  
  // IMPORTANTE: Un solo listener en constructor
  this.socket.on('new_message', (msg: LatticeMessage) => {
    console.log('[RealtimeService] 📨 new_message recibido:', msg);
    this.messageSubject.next(msg);  // ← Emite a TODOS los subscribers
  });
}

onNewMessage(): Observable<LatticeMessage> {
  console.log('[RealtimeService] 👂 Nuevo subscriber a "new_message"');
  return this.messageSubject.asObservable();
}
```

Esta garantiza que:
1. **Un solo listener** en el socket
2. **Múltiples subscribers** pueden recibir el mismo evento
3. No hay duplicación de listeners

---

## 📋 Próximos Pasos

1. **Inicia la app**: `npm start`
2. **Navega a `/clientes`**
3. **Abre F12 Console**
4. **Envía un mensaje con el simulador**
5. **Copia y pega los logs que ves**
6. **Dime en cuál de los 3 casos estás:**
   - ✅ Caso A = TODO FUNCIONA ✨
   - ❌ Caso B = Evento NO llega del backend
   - ⚠️ Caso C = Evento llega pero no procesa

---

## 🔗 URLs Importantes

| Concepto | URL |
|----------|-----|
| App Frontend | http://localhost:4200 |
| Inbox (Clientes) | http://localhost:4200/clientes |
| Backend WebSocket | https://lattice-api-backend.onrender.com |
| Webhook Backend | https://lattice-api-webhook.onrender.com/webhook/message |

