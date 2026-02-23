# 🎯 Integración de Mensajes en Inbox (Clientes)

## ✅ Lo que cambió

He integrado el WebSocket directamente en el componente **Inbox** (`/clientes`). Ahora:

1. ✅ Cuando **Juan** envía un mensaje
2. ✅ Se **busca si existe** en los grupos
3. ✅ Si **existe**: Se **actualiza** con el nuevo mensaje
4. ✅ Si **NO existe**: Se **crea un nuevo recuadro** con su nombre

---

## 🔄 Flujo de Mensajes

```
┌──────────────────────┐
│   Juan envía mensaje │
│  (Simulador HTML)    │
└──────────┬───────────┘
           │
           │ HTTP POST
           │
┌──────────▼──────────────┐
│  Webhook del Backend    │
│  Procesa el mensaje     │
└──────────┬──────────────┘
           │
           │ Emite evento
           │ via WebSocket
           │
┌──────────▼──────────────┐
│  RealtimeService        │
│  onNewMessage()         │
└──────────┬──────────────┘
           │
           │ Observable
           │
┌──────────▼──────────────────────────┐
│  InboxComponent                     │
│  escucharMensajes()                 │
│                                     │
│  ¿Cliente existe?                   │
│  ├─ SÍ → Actualizar desc + source   │
│  └─ NO → Crear nuevo en PROSPECTOS  │
└──────────┬──────────────────────────┘
           │
           │
┌──────────▼──────────────────────────┐
│  LocalStorage                       │
│  (Persistencia)                     │
└──────────┬──────────────────────────┘
           │
           │
┌──────────▼──────────────────────────┐
│  UI actualizada                     │
│                                     │
│  PROSPECTOS:                        │
│  ┌────────────────────────────┐    │
│  │ Juan                       │    │
│  │ Hola! ¿Cómo estás?        │    │
│  │ [WhatsApp]                │    │
│  └────────────────────────────┘    │
└──────────────────────────────────────┘
```

---

## 📝 Cambios en el Código

### **1. Imports Agregados**
```typescript
import { OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealtimeService, LatticeMessage } from '../../../core/services';
```

### **2. Interfaz OnDestroy**
```typescript
export class InboxComponent implements OnInit, OnDestroy {
```

### **3. Inyección del Servicio**
```typescript
private realtime = inject(RealtimeService);
private subs: Subscription[] = [];
```

### **4. Método escucharMensajes()**
```typescript
escucharMensajes() {
  this.subs.push(
    this.realtime.onNewMessage().subscribe((msg: LatticeMessage) => {
      console.log('Nuevo mensaje recibido en Inbox:', msg);
      this.agregarOActualizarCliente(msg);
    })
  );
}
```

### **5. Método agregarOActualizarCliente()**
```typescript
private agregarOActualizarCliente(msg: LatticeMessage) {
  // 1. Extrae nombre, texto y plataforma
  const nombreContacto = msg.profile_name || 'Contacto desconocido';
  const textoMensaje = this.extraerTexto(msg);
  const plataforma = msg.messaging_product || 'whatsapp';

  // 2. Busca en todos los grupos
  let clienteEncontrado = false;
  for (const grupo of this.grupos) {
    const cliente = grupo.prospectos.find(
      (p: any) => p.nombre.toLowerCase() === nombreContacto.toLowerCase()
    );
    
    if (cliente) {
      // 3. Si existe: ACTUALIZA
      cliente.desc = textoMensaje;
      cliente.source = plataforma;
      clienteEncontrado = true;
      break;
    }
  }

  // 4. Si NO existe: CREA NUEVO
  if (!clienteEncontrado) {
    const grupoProspectos = this.grupos.find(g => g.id === 'prospectos');
    if (grupoProspectos) {
      grupoProspectos.prospectos.unshift({
        nombre: nombreContacto,
        desc: textoMensaje,
        source: plataforma
      });
    }
  }

  // 5. Guarda cambios
  this.guardarGrupos();
}
```

### **6. Método ngOnDestroy()**
```typescript
ngOnDestroy() {
  this.subs.forEach(s => s.unsubscribe());
  this.realtime.disconnect();
}
```

---

## 🎯 Cómo Funciona

### **Escenario 1: Cliente NUEVO (Juan)**

```
1. Carga: /clientes
   └─ PROSPECTOS:
      ├─ Josefina araya
      └─ Roberto del Riio

2. Juan envía mensaje: "Hola! ¿Cómo estás?"
   └─ Se recibe en WebSocket
   └─ Se busca en PROSPECTOS
   └─ NO EXISTE
   └─ Se crea nuevo
   └─ Se coloca PRIMERO (unshift)

3. Resultado:
   PROSPECTOS:
   ├─ Juan (NUEVO)
   │  └─ "Hola! ¿Cómo estás?" [WhatsApp]
   ├─ Josefina araya
   └─ Roberto del Riio
```

### **Escenario 2: Cliente EXISTENTE (Josefina)**

```
1. Carga: /clientes
   PROSPECTOS:
   ├─ Josefina araya
   │  └─ "Reparación de abolladuras, pintura"
   └─ Roberto del Riio

2. Josefina envía: "¿Cuánto cuesta?"
   └─ Se recibe en WebSocket
   └─ Se busca en PROSPECTOS
   └─ EXISTE ✅
   └─ Se actualiza descripción

3. Resultado:
   PROSPECTOS:
   ├─ Josefina araya (ACTUALIZADO)
   │  └─ "¿Cuánto cuesta?" [WhatsApp]
   └─ Roberto del Riio
```

---

## 📊 Estructura de Datos

### **Antes:**
```typescript
grupos = [
  {
    id: 'prospectos',
    titulo: 'PROSPECTOS',
    prospectos: [
      { nombre: 'Josefina araya', desc: 'Reparacion aboyaduras...', source: 'whatsapp' },
      { nombre: 'Roberto del Riio', desc: 'Venta palta hass', source: 'instagram' }
    ]
  }
]
```

### **Después (Con nuevo mensaje de Juan):**
```typescript
grupos = [
  {
    id: 'prospectos',
    titulo: 'PROSPECTOS',
    prospectos: [
      { nombre: 'Juan', desc: 'Hola! ¿Cómo estás?', source: 'whatsapp' },  // ✨ NUEVO
      { nombre: 'Josefina araya', desc: 'Reparacion aboyaduras...', source: 'whatsapp' },
      { nombre: 'Roberto del Riio', desc: 'Venta palta hass', source: 'instagram' }
    ]
  }
]
```

---

## 🚀 Prueba Ahora

### **Paso 1: Inicia la app**
```bash
npm start
```

### **Paso 2: Navega a Clientes**
```
http://localhost:4200/clientes
```
Deberías ver los clientes actuales.

### **Paso 3: Abre el Simulador**
```
Simulador mensaje Wsp.html
```

### **Paso 4: Envía un mensaje de un cliente NUEVO**
```
Nombre: Juan
Número: 928839393
Mensaje: Hola! ¿Cómo estás?

Click: "Enviar Mensaje"
```

### **Paso 5: Mira la magia ✨**
```
En tiempo REAL debería aparecer:

PROSPECTOS:
┌──────────────────────────────┐
│ Juan (NUEVO)                 │
│ Hola! ¿Cómo estás?           │
│ [WhatsApp]                   │
└──────────────────────────────┘
```

### **Paso 6: Envía otro mensaje de Juan**
```
Nombre: Juan (MISMO)
Número: 928839393
Mensaje: ¿Puedo ir mañana?

Click: "Enviar Mensaje"
```

### **Paso 7: Resultado**
```
El recuadro de Juan se ACTUALIZA:

PROSPECTOS:
┌──────────────────────────────┐
│ Juan (ACTUALIZADO)           │
│ ¿Puedo ir mañana?            │
│ [WhatsApp]                   │
└──────────────────────────────┘
```

---

## 🎨 Características

✅ **Actualizaciones en Tiempo Real**
- Los mensajes se reciben instantáneamente
- No necesita refrescar la página

✅ **Búsqueda Inteligente**
- Busca por nombre (case-insensitive)
- Funciona en todos los grupos

✅ **Creación Automática**
- Si no existe, se crea nuevo
- Se coloca primero (más reciente)

✅ **Persistencia**
- Se guarda en localStorage
- Los datos se mantienen entre sesiones

✅ **Información Actualizada**
- Nombre del cliente
- Último mensaje
- Plataforma (WhatsApp, Messenger, Instagram)

---

## 📱 Plataformas Soportadas

```typescript
// El campo 'source' se actualiza automáticamente:
source: 'whatsapp'   // Verde ✅
source: 'messenger'  // Azul ✅
source: 'instagram'  // Rosa ✅
source: 'facebook'   // Azul ✅
```

---

## 🔍 Debug en Consola

Abre **F12 → Console** para ver logs:

```javascript
// Cuando llega un mensaje:
"Nuevo mensaje recibido en Inbox: {
  profile_name: 'Juan',
  text: { body: 'Hola! ¿Cómo estás?' },
  messaging_product: 'whatsapp',
  ...
}"
```

---

## ❌ Troubleshooting

### **No aparecen nuevos clientes**

**Verifica:**
1. ✅ El WebSocket esté conectado (F12 → Console)
2. ✅ El mensaje llegó al webhook
3. ✅ Estés en `/clientes`
4. ✅ Los datos se guardaron en localStorage

**Solución:**
```bash
# Borra localStorage y prueba de nuevo
# F12 → Application → LocalStorage → Elimina "misClientes"
npm start
```

### **Mensajes no se actualizan**

**Causas:**
- El nombre no coincide exactamente
- El componente se destruyó antes de recibir el mensaje

**Solución:**
```bash
# Recarga la página
Ctrl + F5

# O reinicia el servidor
npm start
```

---

## 📁 Archivo Modificado

```
src/app/pages/dashboard/inbox/inbox.ts
├── Agregados:
│   ├─ OnDestroy interface
│   ├─ Importaciones de RealtimeService
│   ├─ escucharMensajes()
│   ├─ agregarOActualizarCliente()
│   ├─ extraerTexto()
│   └─ ngOnDestroy()
└── Mantenido:
    ├─ cargarGrupos()
    ├─ guardarGrupos()
    ├─ drop()
    ├─ agregarColumna()
    └─ eliminarColumna()
```

---

## ✅ Resumen

```
Tu Inbox (/clientes) ahora es:

✨ En tiempo real
✨ Recibe mensajes del WebSocket
✨ Crea nuevos clientes automáticamente
✨ Actualiza clientes existentes
✨ Mantiene la persistencia
✨ Muestra plataforma del mensaje
✨ Completamente integrado
```

---

**Versión:** 1.0.0 (Inbox Integration)  
**Fecha:** November 12, 2025  
**Status:** ✅ COMPLETADO
