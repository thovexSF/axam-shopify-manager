#!/usr/bin/env node

/**
 * Script de prueba para verificar webhooks de Shopify
 * Uso: node test-webhook.js
 */

const axios = require('axios');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function calculateHMAC(data, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(data, 'utf8')
    .digest('base64');
}

async function testWebhook() {
  log('\n=== TEST DE WEBHOOK SHOPIFY ===\n', 'cyan');
  
  // Solicitar información
  const endpoint = await question('🔗 URL del endpoint (ej: https://xxx.cloudfunctions.net/shopifyWebhook): ');
  const secret = await question('🔐 Secret del webhook (SHOPIFY_WEBHOOK_SECRET): ');
  const shopDomain = await question('🏪 Shop domain (ej: tu-tienda.myshopify.com): ');
  
  // Datos de prueba
  const testData = {
    id: 123456789,
    order_number: 1001,
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    line_items: [
      {
        id: 1,
        title: 'Producto de Prueba',
        quantity: 1,
        price: '100.00'
      }
    ],
    total_price: '100.00',
    currency: 'CLP'
  };
  
  const jsonData = JSON.stringify(testData);
  const hmac = calculateHMAC(jsonData, secret);
  
  log('\n📤 Enviando webhook de prueba...\n', 'blue');
  log(`Endpoint: ${endpoint}`, 'cyan');
  log(`HMAC: ${hmac.substring(0, 20)}...`, 'cyan');
  log(`Data size: ${jsonData.length} bytes\n`, 'cyan');
  
  try {
    const startTime = Date.now();
    
    const response = await axios.post(endpoint, testData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Topic': 'orders/create',
        'X-Shopify-Shop-Domain': shopDomain,
        'X-Shopify-Hmac-Sha256': hmac,
        'X-Shopify-Webhook-Id': `test-${Date.now()}`
      },
      timeout: 30000 // 30 segundos
    });
    
    const responseTime = Date.now() - startTime;
    
    log('\n✅ RESPUESTA RECIBIDA\n', 'green');
    log(`Status: ${response.status} ${response.statusText}`, 'green');
    log(`Response Time: ${responseTime}ms`, 'green');
    log(`Response Body: ${JSON.stringify(response.data).substring(0, 200)}...`, 'green');
    
    if (response.status === 200) {
      log('\n🎉 Webhook funcionando correctamente!', 'green');
    } else {
      log(`\n⚠️  Webhook respondió con status ${response.status}`, 'yellow');
    }
    
  } catch (error) {
    log('\n❌ ERROR AL ENVIAR WEBHOOK\n', 'red');
    
    if (error.response) {
      // El servidor respondió con un código de error
      log(`Status: ${error.response.status}`, 'red');
      log(`Status Text: ${error.response.statusText}`, 'red');
      log(`Response: ${JSON.stringify(error.response.data)}`, 'red');
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      log('No se recibió respuesta del servidor', 'red');
      log('Verifica:', 'yellow');
      log('  - Que la URL sea correcta', 'yellow');
      log('  - Que la función esté desplegada', 'yellow');
      log('  - Que no haya problemas de red', 'yellow');
    } else {
      // Error al configurar la petición
      log(`Error: ${error.message}`, 'red');
    }
    
    log(`\nError completo: ${error.message}`, 'red');
  }
  
  rl.close();
}

// Verificar versión de Node
log(`\nNode version: ${process.version}`, 'cyan');
if (parseInt(process.version.split('.')[0].substring(1)) < 20) {
  log('⚠️  Advertencia: Estás usando Node < 20', 'yellow');
}

// Ejecutar test
testWebhook().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
