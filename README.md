# 🛍️ AXAM Shopify Integration

Integración de webhooks de Shopify con Firebase Functions para sincronizar automáticamente pedidos de Shopify con el sistema de gestión de AXAM.

## 📋 Descripción

Este proyecto recibe webhooks de Shopify cuando se crean nuevas órdenes y las procesa para crear órdenes de compra en el sistema ManagerMas de AXAM.

## 🚀 Características

- ✅ **Webhook Security**: Validación HMAC de webhooks de Shopify
- ✅ **Procesamiento Automático**: Conversión de órdenes de Shopify a formato ManagerMas
- ✅ **Firebase Functions**: Serverless functions con Node.js 20
- ✅ **Error Handling**: Manejo robusto de errores y logging
- ✅ **Testing**: Script de prueba para simular webhooks

## 🏗️ Arquitectura

```
Shopify Store → Webhook → Firebase Function → ManagerMas API
```

1. **Shopify** envía webhook cuando se crea una orden
2. **Firebase Function** valida el HMAC y procesa la orden
3. **ManagerMas API** recibe y registra la orden de compra

## 📦 Estructura del Proyecto

```
shopify-integration/
├── functions/
│   ├── index.js              # Firebase Function principal
│   ├── package.json          # Dependencias (Node 20)
│   └── node_modules/         # Dependencias instaladas
├── test-webhook.js           # Script para pruebas locales
├── .gitignore               # Archivos ignorados
└── README.md                # Este archivo
```

## 🛠️ Tecnologías

- **Firebase Functions**: Serverless backend
- **Node.js 20**: Runtime actualizado
- **Express.js**: Framework web
- **Crypto**: Validación HMAC
- **Axios**: Llamadas HTTP

## 📝 Configuración

### Variables de Entorno

Configurar en Firebase Functions:

```bash
firebase functions:config:set \
  shopify.webhook_secret="tu_webhook_secret" \
  managermas.api_url="https://api.managermas.com" \
  managermas.api_token="tu_api_token"
```

### Webhook en Shopify

1. Ir a **Settings → Notifications → Webhooks**
2. Crear webhook para **Order creation**
3. URL: `https://tu-region-tu-proyecto.cloudfunctions.net/shopifyWebhook`
4. Format: **JSON**
5. API version: **2024-01**

## 🧪 Testing

### Test Local

```bash
node test-webhook.js
```

El script te pedirá:
- URL del endpoint
- Secret del webhook
- Shop domain

### Logs en Firebase

```bash
firebase functions:log
```

O en Google Cloud Console: **Logging → Logs Explorer**

## 🚀 Deploy

```bash
# Login a Firebase
firebase login

# Deploy functions
firebase deploy --only functions
```

## 📊 Monitoreo

### Ver Logs

```bash
firebase functions:log --only shopifyWebhook
```

### Google Cloud Console

1. Ir a **Cloud Functions**
2. Seleccionar `shopifyWebhook`
3. Ver **Logs** y **Metrics**

## 🔒 Seguridad

- **HMAC Validation**: Todos los webhooks se validan con HMAC SHA256
- **Environment Variables**: Secrets almacenados en Firebase Config
- **HTTPS Only**: Comunicación encriptada

## 📈 Estado Actual

✅ **Implementado**:
- Validación HMAC
- Procesamiento de órdenes
- Integración con ManagerMas API
- Actualización a Node 20
- Logging completo

⚠️ **Pendiente**:
- Retry logic para fallos de API
- Queue para procesamiento asíncrono
- Dashboard de monitoreo

## 🐛 Troubleshooting

### Error: `Cannot read properties of null`

**Solución**: Validar que los productos en las órdenes tengan códigos válidos.

### Webhook no recibe datos

**Verificar**:
1. URL del webhook en Shopify
2. Secret configurado correctamente
3. Logs en Firebase/Google Cloud
4. Deliveries en Shopify Admin

## 📅 Desarrollo

**Año**: 2024-2025  
**Runtime**: Node.js 20  
**Firebase SDK**: Functions v4.9.0

## 🔗 Recursos

- [Shopify Webhooks Documentation](https://shopify.dev/docs/api/admin-rest/2024-01/resources/webhook)
- [Firebase Functions Guide](https://firebase.google.com/docs/functions)
- [ManagerMas API Documentation](https://managermas.com/api-docs)

---

**Nota**: Este proyecto forma parte del ecosistema AXAM de automatización de operaciones.
