#!/usr/bin/env node
// Test de connexion à l'API Stanley Stella
// Usage: node test-ss-api.js

// Lire .env manuellement sans dépendance
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

const SS_USER = process.env.SS_USER || 'DEALER_PORTAL_atelier@printig.bzh';
const SS_PASS = process.env.SS_PASSWORD || '';
const SS_LANG = process.env.SS_LANG || 'fr_FR';

const BASE_URL = 'https://api.stanleystella.com/webrequest';

// Encode les credentials en Base64 pour Basic Auth
const credentials = Buffer.from(`${SS_USER}:${SS_PASS}`).toString('base64');

const headers = {
  'Authorization': `Basic ${credentials}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// Payload JSON-RPC Stanley Stella (format officiel)
function rpcPayload(params = {}) {
  return JSON.stringify({
    jsonrpc: '2.0',
    method: 'call',
    id: 0,
    params: {
      db_name: process.env.SS_DB || 'production_api',
      user: SS_USER,
      password: SS_PASS,
      LanguageCode: SS_LANG,
      ...params
    }
  });
}

async function callAPI(endpoint, extraParams = {}) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers,
    body: rpcPayload(extraParams)
  });
  const text = await res.text();
  console.log(`Status: ${res.status} ${res.statusText}`);
  try {
    return JSON.parse(text);
  } catch {
    console.log('Response (raw):', text.substring(0, 400));
    return null;
  }
}

async function testConnection() {
  console.log('\n🔌 Test connexion Stanley Stella API (JSON-RPC)');
  console.log('─'.repeat(50));
  console.log(`User: ${SS_USER}`);
  console.log(`DB:   ${process.env.SS_DB}`);
  console.log(`Lang: ${SS_LANG}`);
  console.log('─'.repeat(50));

  // Test — Récupérer les produits
  console.log('\n📦 Fetching products...');
  const data = await callAPI('products/get_json');

  if (!data) return;

  if (data.error) {
    console.log('❌ Erreur JSON-RPC:', JSON.stringify(data.error));
    return;
  }

  const result = data.result;
  console.log('Résultat type:', typeof result, Array.isArray(result) ? `(${result.length} items)` : '');

  if (typeof result === 'string') {
    console.log('Message:', result);
    return;
  }

  if (Array.isArray(result) && result.length > 0) {
    console.log(`✅ ${result.length} produits récupérés!`);

    // Afficher les clés disponibles
    console.log('\nClés disponibles sur un produit:', Object.keys(result[0]).join(', '));
    console.log('\nExemple produit 1:');
    console.log(JSON.stringify(result[0], null, 2).substring(0, 600));

    // Filtrer t-shirts et sweatshirts
    const cats = [...new Set(result.map(p => p.category_name || p.product_type || p.category || ''))];
    console.log('\nCatégories disponibles:', cats.slice(0, 20).join(', '));
  } else {
    console.log('Résultat complet:', JSON.stringify(data).substring(0, 600));
  }
}

async function testImages() {
  console.log('\n\n🖼  Test endpoint images...');
  const data = await callAPI('products_images/get_json');
  if (!data) return;
  if (data.error) { console.log('❌', JSON.stringify(data.error)); return; }
  const result = data.result;
  if (Array.isArray(result)) {
    console.log(`✅ ${result.length} images`);
    if (result.length > 0) console.log('Exemple:', JSON.stringify(result[0], null, 2).substring(0, 300));
  } else {
    console.log('Résultat:', JSON.stringify(data).substring(0, 300));
  }
}

async function testPrices() {
  console.log('\n\n💶 Test endpoint prix...');
  const data = await callAPI('products/get_prices');
  if (!data) return;
  if (data.error) { console.log('❌', JSON.stringify(data.error)); return; }
  console.log('Résultat:', JSON.stringify(data).substring(0, 400));
}

(async () => {
  await testConnection();
  await testImages();
  await testPrices();
  console.log('\n─'.repeat(50) + '\n');
})();
