# 🔍 Debugging - Mensajes en Inbox

## ❌ El Problema

Los mensajes llegan al Monitor (en la consola HTML), pero **NO llegan a `/clientes`**.

---

## ✅ Cambios Realizados

He removido la ruta `/monitor` y agregado **logging detallado** para debuggear.

```
dashboard.routes.ts:
  ❌ REMOVIDO: ruta /monitor
  
sidebar.html:
  ❌ REMOVIDO: botón del monitor

inbox.ts:
  ✅ AGREGADO: logs detallados en escucharMensajes()
  ✅ AGREGADO: logs detallados en agregarOActualizarCliente()
```

---

## 🧪 Cómo Debuggear

### **Paso 1: Abre tu app**
```bash
npm start
```

### **Paso 2: Navega a Clientes**
```
http://localhost:4200/clientes
```

### **Paso 3: Abre la consola del navegador**
```
F12 → Console
```

**Deberías ver logs como estos:**
```
[Inbox] Iniciando escucha de mensajes...
[Inbox] Suscripción establecida. Total suscripciones: 1
```

Si **NO ves estos logs**, el Inbox no está inicializándose. 

### **Paso 4: Envía un mensaje desde el Simulador**

```
Nombre: Juan
Número: 928839393
Mensaje: Hola! ¿Cómo estás?

Click: Enviar Mensaje
```

### **Paso 5: Revisa la Consola**

**¿Qué deberías ver?**

```javascript
// ✅ CORRECTO (El mensaje llega):
[Inbox] ✅ Nuevo mensaje recibido: { 
  profile_name: "Juan",
  text: { body: "Hola! ¿Cómo estás?" },
  messaging_product: "whatsapp",
  ... 
}
[Inbox] Procesando cliente: Juan
[Inbox] ⭐ Cliente NUEVO: Juan. Creando...
[Inbox] ✅ Cliente Juan agregado a PROSPECTOS
[Inbox] 💾 Guardando grupos... Total clientes: X
```

**❌ O ESTO (El mensaje NO llega):**
```
(nada, solo silencio)
```

---

## 🎯 Posibles Problemas

### **PROBLEMA 1: No ves los logs iniciales**

**Síntomas:**
```
No ves: "[Inbox] Iniciando escucha de mensajes..."
```

**Causa:** 
- El componente Inbox no se está inicializando
- El `OnInit` no se ejecuta

**Solución:**
1. Verifica que estés en `/clientes`
2. Recarga la página (Ctrl+F5)
3. En la consola, escribe: `console.log('test')` para verificar que funciona

---

### **PROBLEMA 2: Ves los logs iniciales PERO el mensaje no llega**

**Síntomas:**
```
[Inbox] Iniciando escucha de mensajes...
[Inbox] Suscripción establecida.

(Envías mensaje)

(nada más)
```

**Causa:**
- El WebSocket NO está recibiendo el evento
- El backend NO está emitiendo el evento

**Solución:**
1. Abre el HTML del monitor: `lattice_monitor_console.html`
2. Verifica que SÍ llega allí
3. Si llega en el monitor pero NO en Inbox:
   - El evento se emite solo UNA vez
   - Ambos componentes comparten el mismo RealtimeService
   - Si el Monitor ya lo consumió, el Inbox no lo ve

---

### **PROBLEMA 3: Ves el mensaje en el monitor Y en Inbox**

**Síntomas:**
```
Monitor HTML: ✅ Mensaje recibido
Inbox console: ✅ [Inbox] Nuevo mensaje recibido
```

**Resultado:** ✅ ¡TODO FUNCIONA!

---

## 🔧 Soluciones Propuestas

### **Opción A: Ambos componentes escuchan (RECOMENDADO)**

El problema actual es que ambos comparten el mismo `RealtimeService` singleton.

**Solución:** Asegurarse de que AMBOS estén inicializados:

```typescript
// En RealtimeService:
onNewMessage(): Observable<LatticeMessage> {
  return new Observable(observer => {
    this.socket.on('new_message', (msg: LatticeMessage) => {
      observer.next(msg);
      // ← Se emite aquí
    });
  });
}

// El problema: Si Inbox se suscribe DESPUÉS de que Monitor,
// ambos reciben el mismo mensaje (no hay conflicto)
```

### **Opción B: Usar Subject en lugar de event listeners**

Cambiar el RealtimeService para usar un RxJS Subject:

```typescript
private messageSubject = new Subject<LatticeMessage>();

onNewMessage(): Observable<LatticeMessage> {
  return this.messageSubject.asObservable();
}

// En el constructor:
this.socket.on('new_message', (msg: LatticeMessage) => {
  this.messageSubject.next(msg);
  // ← Se emite a TODOS los suscriptores
});
```

---

## 📋 Checklist de Verificación

```
┌─────────────────────────────────────────┐
│ VERIFICACIÓN PASO A PASO                │
├─────────────────────────────────────────┤
│ □ npm start ejecuta sin errores         │
│ □ Navegas a http://localhost:4200/clientes │
│ □ F12 → Console funciona               │
│ □ Ves logs iniciales: "[Inbox]..."     │
│ □ Envías mensaje desde Simulador       │
│ □ Ves logs de "Nuevo mensaje recibido" │
│ □ Ves logs de "Cliente NUEVO" o "ENCONTRADO" │
│ □ Ves logs de "Guardando grupos"       │
│ □ En la UI aparece el nuevo cliente    │
└─────────────────────────────────────────┘
```

---

## 💻 Logs Esperados Completos

Cuando envías un mensaje de **Juan** por primera vez:

```javascript
// AL CARGAR /clientes:
[Inbox] Iniciando escucha de mensajes...
[Inbox] Suscripción establecida. Total suscripciones: 1

// AL ENVIAR MENSAJE:
[Inbox] ✅ Nuevo mensaje recibido: {
  message_id: "123456",
  profile_name: "Juan",
  text: { body: "Hola! ¿Cómo estás?" },
  messaging_product: "whatsapp",
  timestamp: "1731351234",
  type: "text",
  ...
}
[Inbox] Procesando cliente: Juan
[Inbox] ⭐ Cliente NUEVO: Juan. Creando...
[Inbox] ✅ Cliente Juan agregado a PROSPECTOS
[Inbox] 💾 Guardando grupos... Total clientes: 3

// EN LA UI:
┌──────────────────────┐
│ Juan (APARECE)       │
│ Hola! ¿Cómo estás?   │
└──────────────────────┘
```

---

## 🚀 Próximas Pruebas

Una vez verifiques que funciona:

### **Test 1: Actualizar cliente existente**
```
Enviar mensaje de Juan nuevamente
Resultado: El mensaje debe actualizar, NO crear duplicado
```

### **Test 2: Cliente existente (Josefina)**
```
Enviar mensaje de "Josefina araya"
Resultado: Se debe buscar y encontrar, solo actualizar
```

### **Test 3: Diferentes plataformas**
```
Cambiar plataforma a "messenger" o "instagram"
Resultado: El source debe actualizar en el UI
```

---

## 📸 Evidencia que Necesito

Para ayudarte mejor, envíame:

1. **Screenshot de la consola (F12)** cuando:
   - Cargas `/clientes`
   - Envías el mensaje
   - Ver los logs

2. **¿Ves el mensaje en el monitor HTML?** (SÍ/NO)

3. **¿Ves los logs `[Inbox]` en la consola?** (SÍ/NO)

---

## 🔗 Relación entre Componentes

```
RealtimeService (Singleton)
  │
  ├─→ MonitorComponent
  │   └─ onNewMessage() → renderiza en /monitor
  │
  └─→ InboxComponent
      └─ onNewMessage() → agrega cliente en /clientes
```

**La clave:** Ambos comparten el MISMO servicio, así que el evento llega a ambos.

---

**Inicia la app, navega a `/clientes`, abre F12 y envía un mensaje. Cuéntame qué ves en los logs.** 🔍

