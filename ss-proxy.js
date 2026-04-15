#!/usr/bin/env node
/**
 * Proxy Stanley Stella API — PRINTIG.BZH
 * Lance avec : node ss-proxy.js
 * Accessible sur : http://localhost:3001/api/ss/products
 *
 * Ce proxy est nécessaire car l'API SS ne supporte pas CORS depuis le navigateur.
 * Il récupère les produits SS et les met en cache 24h.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────
const PORT = 3001;
const CACHE_FILE = path.join(__dirname, '.ss-cache.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// Lire .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

const SS_CONFIG = {
  db_name: process.env.SS_DB || 'production_api',
  user: process.env.SS_USER || '',
  password: process.env.SS_PASSWORD || '',
  LanguageCode: process.env.SS_LANG || 'fr_FR'
};

const SS_BASE = 'https://api.stanleystella.com/webrequest';

// ── Catégories d'intérêt ──────────────────────────────────────
// Ces codes sont les product_type SS pour filtrer t-shirts et sweats
const FEATURED_CATEGORIES = ['T-Shirts', 'Sweatshirts', 'Hoodies', 'T-shirts'];
const FEATURED_REFS = [
  'STTU755', 'STTU169', 'STTU758', // T-shirts populaires
  'STSU178', 'STSU177', 'STSU168', // Sweats/Hoodies populaires
];

// ── Fonctions API ─────────────────────────────────────────────
async function fetchSS(endpoint) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 0,
      params: SS_CONFIG
    });

    const options = {
      hostname: 'api.stanleystella.com',
      path: `/webrequest/${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ error: 'Parse error', raw: data.substring(0, 200) }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Cache (généré par ss-fetch.js) ────────────────────────────
function readCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const c = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (Date.now() - c.timestamp > CACHE_TTL_MS) {
      console.log('⚠️  Cache expiré — relance: node ss-fetch.js');
    }
    return c; // retourner l'objet complet {timestamp, featured, all, ...}
  } catch { return null; }
}

// ── Normalisation produit ─────────────────────────────────────
function normalizeProducts(raw) {
  // L'API SS retourne un tableau de variantes — on groupe par style
  const styles = {};

  raw.forEach(variant => {
    const ref = variant.style_reference || variant.reference || variant.sku || '';
    const styleRef = ref.replace(/-\d+$/, ''); // enlever le suffix de couleur

    if (!styles[styleRef]) {
      styles[styleRef] = {
        ref: styleRef,
        name: variant.style_name || variant.name || styleRef,
        category: variant.category_name || variant.product_type || '',
        gender: variant.gender || 'Unisexe',
        weight: variant.fabric_weight || '',
        composition: variant.fabric_composition || '',
        colors: [],
        images: [],
        sizes: [],
        price_from: null
      };
    }

    const s = styles[styleRef];

    // Couleurs
    const colorHex = variant.color_hex_code || variant.hex_code || '';
    const colorName = variant.color_name || '';
    if (colorHex && !s.colors.find(c => c.hex === colorHex)) {
      s.colors.push({ name: colorName, hex: colorHex });
    }

    // Images
    const img = variant.image_url || variant.photo || '';
    if (img && !s.images.includes(img)) s.images.push(img);

    // Tailles
    const size = variant.size || '';
    if (size && !s.sizes.includes(size)) s.sizes.push(size);

    // Prix
    const price = parseFloat(variant.price || variant.price_ht || 0);
    if (price > 0 && (!s.price_from || price < s.price_from)) s.price_from = price;
  });

  return Object.values(styles);
}

// ── Filtrer les produits phares ────────────────────────────────
function getFeatured(products) {
  const byRef = products.filter(p => FEATURED_REFS.includes(p.ref));
  if (byRef.length >= 4) return byRef.slice(0, 6);

  const byCat = products.filter(p =>
    FEATURED_CATEGORIES.some(c => p.category.toLowerCase().includes(c.toLowerCase()))
  );
  return byCat.slice(0, 6);
}

// ── Routes ────────────────────────────────────────────────────
async function handleRequest(req, res) {
  // CORS pour le HTML local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = req.url.split('?')[0];

  // GET /api/ss/featured — produits phares (t-shirts + sweats)
  if (url === '/api/ss/featured') {
    const cache = readCache();
    if (!cache) {
      res.writeHead(200);
      res.end(JSON.stringify({ source: 'static', products: STATIC_FALLBACK }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ source: 'api', products: cache.featured, total_styles: cache.total_styles }));
    return;
  }

  // GET /api/ss/products — catalogue complet
  if (url === '/api/ss/products') {
    const cache = readCache();
    if (!cache) {
      res.writeHead(200);
      res.end(JSON.stringify({ source: 'static', products: STATIC_FALLBACK }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ source: 'api', products: cache.all, total_styles: cache.total_styles }));
    return;
  }

  // GET /api/ss/status
  if (url === '/api/ss/status') {
    const cache = readCache();
    if (cache) {
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, message: `Cache OK — ${cache.total_styles} styles`, timestamp: cache.timestamp }));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ ok: false, message: 'Pas de cache — lance: node ss-fetch.js' }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
}

// ── Produits statiques de fallback ────────────────────────────
// Utilisés tant que l'API SS n'est pas activée
const STATIC_FALLBACK = [
  {
    ref: 'STTU169',
    name: 'Creator 2.0',
    category: 'T-Shirts',
    gender: 'Unisexe',
    weight: '155 g/m²',
    composition: '100% coton biologique',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1916' },
      { name: 'Bottle Green', hex: '#1B4332' },
      { name: 'French Navy', hex: '#1B2A4A' },
      { name: 'Mid Heather Grey', hex: '#9CA3AF' }
    ],
    color_count: 65,
    sizes: ['XS','S','M','L','XL','2XL','3XL'],
    price_from: 4.15,
    images: [],
    img_bg: '#C2BDB6'
  },
  {
    ref: 'STTU758',
    name: 'Rocker',
    category: 'T-Shirts',
    gender: 'Unisexe',
    weight: '150 g/m²',
    composition: '100% coton biologique',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1916' },
      { name: 'French Navy', hex: '#1B2A4A' },
      { name: 'Burgundy', hex: '#6B2C3A' }
    ],
    color_count: 48,
    sizes: ['XS','S','M','L','XL','2XL','3XL'],
    price_from: 2.92,
    images: [],
    img_bg: '#A09890'
  },
  {
    ref: 'STSU178',
    name: 'Changer 2.0',
    category: 'Sweatshirts',
    gender: 'Unisexe',
    weight: '300 g/m²',
    composition: '85% coton bio / 15% polyester recyclé',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1916' },
      { name: 'Khaki', hex: '#6B6B47' },
      { name: 'French Navy', hex: '#1B2A4A' }
    ],
    color_count: 42,
    sizes: ['XS','S','M','L','XL','2XL','3XL'],
    price_from: 12.86,
    images: [],
    img_bg: '#8A9498'
  },
  {
    ref: 'STSU177',
    name: 'Cruiser 2.0',
    category: 'Hoodies',
    gender: 'Unisexe',
    weight: '350 g/m²',
    composition: '85% coton bio / 15% polyester recyclé',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1916' },
      { name: 'Mid Heather Grey', hex: '#9CA3AF' },
      { name: 'Bottle Green', hex: '#1B4332' }
    ],
    color_count: 38,
    sizes: ['XS','S','M','L','XL','2XL','3XL'],
    price_from: 16.75,
    images: [],
    img_bg: '#6A6460'
  }
];

// ── Start ─────────────────────────────────────────────────────
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`\n✅ Proxy Stanley Stella démarré sur http://localhost:${PORT}`);
  console.log(`   /api/ss/status   — vérifier les credentials`);
  console.log(`   /api/ss/featured — produits phares (avec fallback statique)`);
  console.log(`   /api/ss/products — catalogue complet\n`);
});
