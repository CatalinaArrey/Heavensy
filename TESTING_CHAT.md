# 🧪 TESTING - VISTA DE CHAT

## 1️⃣ Inicia la Aplicación

```bash
npm start
```

Espera a que compile. La app estará en: `http://localhost:4200`

## 2️⃣ Navega a la Vista de Chat

En la aplicación:
1. Haz login (si es necesario)
2. Haz click en el icono de **Chat** en la sidebar
3. O navega directamente a: `http://localhost:4200/dashboard/chat`

## 3️⃣ Prueba: Enviar Mensaje

### Usando el Simulador:
1. Abre `Simulador mensaje Wsp.html` (archivo del repo)
2. Selecciona número y plataforma (WhatsApp, Messenger, Instagram)
3. Escribe un mensaje
4. Haz click en "Enviar"

### Resultado esperado:
- ✅ Aparece un nuevo contacto en la lista izquierda
- ✅ Se selecciona automáticamente
- ✅ El mensaje aparece en el panel central (lado izquierdo, gris)
- ✅ Último mensaje actualizado en lista
- ✅ Timestamp agregado

## 4️⃣ Prueba: Responder Mensaje

1. En el panel central, escribe una respuesta
2. Presiona **Enter** o haz click en el botón azul redondo
3. Deberías ver:
   - ✅ Tu mensaje aparece en el lado derecho (azul)
   - ✅ Timestamp correcto
   - ✅ Último mensaje actualizado en lista

## 5️⃣ Prueba: Múltiples Contactos

1. Usa el simulador para enviar mensajes de **diferentes números**
2. Cada número aparecerá como contacto separado
3. Al seleccionar cada uno, se muestran sus mensajes

## 6️⃣ Prueba: Mensajes No Leídos

1. Envía un mensaje del simulador
2. Si está en el chat de otro contacto, verás un **badge rojo** con el número
3. Cuando haces click, el badge desaparece (marca como leído)

## 7️⃣ Debugging - Abre F12 Console

```
[Chat] 📨 Nuevo mensaje recibido: {profile_name: "Juan", text: {...}, ...}
[Chat] 👤 Seleccionando contacto: Juan
```

### Verifica localStorage:
1. F12 → Application → LocalStorage
2. Busca `misChats`
3. Deberías ver array de contactos con mensajes

## 📋 Checklist de Funcionalidad

- [ ] **Lista de contactos** carga correctamente
- [ ] **Seleccionar contacto** actualiza vista central
- [ ] **Enviar mensaje** aparece en conversación
- [ ] **Recibir mensaje** (simulador) aparece en conversación
- [ ] **Timestamp** es correcto en mensajes
- [ ] **Último mensaje** se actualiza en lista
- [ ] **No-leídos badge** aparece cuando hay nuevos mensajes
- [ ] **Avatar** se muestra para cada contacto
- [ ] **Información derecha** muestra datos del contacto
- [ ] **Botón agendar** está presente y clickeable
- [ ] **Responsive** - panel derecho desaparece en pantallas <1200px

## 🐛 Si Algo No Funciona

### Los mensajes no aparecen:
1. Verifica F12 Console para logs `[Chat]`
2. Mira que el RealtimeService esté conectado: `[RealtimeService] ✅ Conectado`
3. Verifica localStorage['misChats'] en F12

### Los mensajes no se guardan:
1. Abre F12 → Application → LocalStorage
2. Busca `misChats`
3. Si está vacío, hay un problema con `guardarContactos()`

### El chat está vacio cuando recargo:
1. Eso es normal si los mensajes no vinieron del WebSocket
2. Deberían persistir en localStorage
3. Si se borra al recargar, revisa `cargarContactos()`

## 🎯 Endpoint de Prueba

El simulador envía a: `https://lattice-api-webhook.onrender.com/webhook/message`

Estructura de mensaje de ejemplo:
```json
{
  "from_number": "598765321",
  "profile_name": "Juan Pérez",
  "text": {
    "body": "Hola, ¿cómo estás?"
  },
  "messaging_product": "whatsapp",
  "timestamp": "2025-11-12T20:00:00Z"
}
```

## 📞 Estructura Esperada en la UI

```
┌──────────────┬─────────────────────┬──────────────┐
│              │                     │              │
│  CONTACTOS   │   CONVERSACIÓN      │  INFO        │
│              │                     │              │
│ [Avatar] Juan│  [Hora] Mensaje 1   │ Avatar       │
│              │  [Hora] Mensaje 2   │ Juan Pérez   │
│ [Avatar] Ana │  [Hora] Mensaje 3   │ WhatsApp     │
│              │                     │              │
│ [Avatar] ...│  [Input]            │ Información  │
│              │  [Enviar]            │ ...          │
│              │                     │              │
└──────────────┴─────────────────────┴──────────────┘
```

## 🎉 ¡Listo!

Ahora deberías tener una vista de chat completamente funcional integrada con el WebSocket.

**Próximos pasos sugeridos:**
1. Conectar con InboxComponent para sincronizar contactos
2. Implementar búsqueda/filtro
3. Agregar historiador de mensajes desde API
4. Mejorar UX con indicadores de escribiendo...

