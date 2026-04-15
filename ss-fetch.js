#!/usr/bin/env node
/**
 * Stanley Stella — Extracteur produits phares
 * Filtre T-Shirts + Sweatshirts/Hoodies en fr_FR
 * Sauvegarde dans .ss-cache.json (utilisé par ss-proxy.js)
 *
 * Usage: node ss-fetch.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Lire .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

const CONFIG = {
  db_name: 'production_api',
  user: process.env.SS_USER,
  password: process.env.SS_PASSWORD,
  LanguageCode: 'fr_FR'
};

// TypeCodes à garder pour "produits phares"
const KEEP_TYPES = ['T-SHIRT', 'CREWNECKS', 'HOODIES', 'ZIPTHRU'];
// StyleCodes prioritaires
const PRIORITY_STYLES = ['STTU169', 'STTU758', 'STTU171', 'STSU178', 'STSU177', 'STSU168', 'STTU199'];

console.log('\n📡 Connexion à l\'API Stanley Stella...');
console.log('   (réponse ~600 MB, peut prendre 30-60s)\n');

const body = JSON.stringify({ jsonrpc: '2.0', method: 'call', id: 0, params: CONFIG });

const req = https.request({
  hostname: 'api.stanleystella.com',
  path: '/webrequest/products/get_json',
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Accept-Encoding': 'gzip'
  }
}, (res) => {
  const zlib = require('zlib');
  console.log(`Status: ${res.statusCode}`);
  console.log(`Encoding: ${res.headers['content-encoding'] || 'none'}`);

  const stream = res.headers['content-encoding'] === 'gzip'
    ? res.pipe(zlib.createGunzip())
    : res;

  let rawChunks = [];
  let totalBytes = 0;
  let lastLog = 0;

  stream.on('data', chunk => {
    rawChunks.push(chunk);
    totalBytes += chunk.length;
    const mb = Math.floor(totalBytes / 1024 / 1024);
    if (mb > lastLog) {
      process.stdout.write(`\r   Reçu : ${mb} MB...`);
      lastLog = mb;
    }
  });

  stream.on('end', () => {
    console.log(`\n   Total reçu : ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
    console.log('\n🔄 Parsing JSON...');

    try {
      const raw = Buffer.concat(rawChunks).toString('utf8');
      rawChunks = null; // libérer la mémoire

      // Parser l'enveloppe externe
      const outer = JSON.parse(raw);
      if (outer.error) {
        console.error('❌ Erreur API:', outer.error.data?.message);
        process.exit(1);
      }

      // Le result est une string double-encodée
      let variants = typeof outer.result === 'string'
        ? JSON.parse(outer.result)
        : outer.result;

      console.log(`   ${variants.length} variantes au total`);

      // ── Filtrer ──────────────────────────────────────────────
      const filtered = variants.filter(v => KEEP_TYPES.includes(v.TypeCode || ''));
      console.log(`   ${filtered.length} variantes T-Shirts + Sweats (fr_FR)`);

      variants = null; // libérer mémoire

      // ── Grouper par style ─────────────────────────────────────
      const styles = {};
      filtered.forEach(v => {
        const ref = v.StyleCode;
        if (!styles[ref]) {
          styles[ref] = {
            ref,
            name: v.StyleName || ref,
            type: v.TypeCode || v.Type || '',
            category: v.Category || '',
            gender: v.Gender || 'Unisexe',
            weight: v.Weight ? `${v.Weight} g/m²` : '',
            composition: v.CompositionList || '',
            description: v.ShortDescription || '',
            colors: [],
            colorHexMap: {},
            sizes: [],
            stock_total: 0,
            price_from: null,
            main_image: v.MainPicture || '',
            images: v.MainPicture ? [v.MainPicture] : [],
            published: v.StylePublished || false
          };
        }

        const s = styles[ref];

        // Couleurs
        const colorName = v.Color || '';
        const colorCode = v.ColorCode || '';
        if (colorName && !s.colors.find(c => c.name === colorName)) {
          // L'API ne donne pas le hex — on utilise le ColorCode comme clé
          // Les images permettent de voir la couleur
          s.colors.push({ name: colorName, code: colorCode, img: v.MainPicture || '' });
        }

        // Tailles
        const size = v.SizeCode || '';
        if (size && !s.sizes.includes(size)) s.sizes.push(size);

        // Stock
        s.stock_total += (v.Stock || 0);

        // Prix (dealer price > 10 pièces en EUR)
        const price = parseFloat(v['Price>10 EUR'] || 0);
        if (price > 0 && (!s.price_from || price < s.price_from)) s.price_from = price;

        // Image principale
        if (!s.main_image && v.MainPicture) s.main_image = v.MainPicture;
        if (v.MainPicture && !s.images.includes(v.MainPicture)) s.images.push(v.MainPicture);
      });

      const products = Object.values(styles).filter(p => p.published);
      console.log(`   ${products.length} styles uniques publiés`);

      // ── Trier : prioritaires d'abord ──────────────────────────
      products.sort((a, b) => {
        const ia = PRIORITY_STYLES.indexOf(a.ref);
        const ib = PRIORITY_STYLES.indexOf(b.ref);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return 0;
      });

      // ── Construire le cache ────────────────────────────────────
      const featured = products.slice(0, 8); // garder les 8 premiers pour le carousel
      const cache = {
        timestamp: Date.now(),
        total_variants: filtered.length,
        total_styles: products.length,
        featured,
        all: products
      };

      const cacheFile = path.join(__dirname, '.ss-cache.json');
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
      const cacheSize = (fs.statSync(cacheFile).size / 1024).toFixed(0);
      console.log(`\n✅ Cache sauvegardé : .ss-cache.json (${cacheSize} KB)`);

      // ── Afficher les produits phares ──────────────────────────
      console.log('\n📦 Produits phares :');
      featured.forEach((p, i) => {
        console.log(`  ${i+1}. ${p.ref} — ${p.name} (${p.type})`);
        console.log(`     ${p.colors.length} couleurs · ${p.price_from?.toFixed(2) || '?'}€ HT · stock: ${p.stock_total}`);
        console.log(`     🖼  ${p.main_image ? p.main_image.substring(0, 70) + '...' : 'pas d\'image'}`);
      });

    } catch (err) {
      console.error('\n❌ Erreur parsing:', err.message);
    }
  });

  stream.on('error', err => console.error('Erreur stream:', err.message));
});

req.on('error', err => console.error('Erreur réseau:', err.message));
req.write(body);
req.end();
