#!/usr/bin/env node
/**
 * PRINTIG.BZH — Upload sections Shopify
 * Usage: node upload-to-shopify.js <SHOPIFY_ACCESS_TOKEN>
 *
 * Pour obtenir le token:
 * 1. Shopify Admin → Paramètres → Apps → "Développer des apps"
 * 2. Créer une app → Configure Admin API scopes → cocher "write_themes"
 * 3. Installer l'app → copier le "Admin API access token" (commence par shpat_)
 * 4. node upload-to-shopify.js shpat_XXXX
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const STORE = 'czhasn-qf';
const THEME_ID = '191358632313';
const ACCESS_TOKEN = process.argv[2];

if (!ACCESS_TOKEN) {
  console.error('❌  Usage: node upload-to-shopify.js <SHOPIFY_ACCESS_TOKEN>');
  console.error('\nPour créer un token:');
  console.error('  → Shopify Admin > Paramètres > Apps > Développer des apps');
  console.error('  → Créer une app > Config API Admin > cocher "write_themes"');
  console.error('  → Installer l\'app > copier le token (shpat_...)');
  process.exit(1);
}

const FILES = [
  {
    localPath: path.join(__dirname, 'shopify', 'sections', 'catalogue-stanley-stella.liquid'),
    shopifyKey: 'sections/catalogue-stanley-stella.liquid'
  },
  {
    localPath: path.join(__dirname, 'shopify', 'sections', 'produit-stanley-stella.liquid'),
    shopifyKey: 'sections/produit-stanley-stella.liquid'
  }
];

function uploadAsset(key, value) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ asset: { key, value } });
    const options = {
      hostname: `${STORE}.myshopify.com`,
      path: `/admin/api/2024-01/themes/${THEME_ID}/assets.json`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ status: 200, key });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`\n🚀  PRINTIG.BZH — Upload Shopify (thème ${THEME_ID})\n`);
  for (const file of FILES) {
    if (!fs.existsSync(file.localPath)) {
      console.error(`❌  Fichier introuvable: ${file.localPath}`);
      continue;
    }
    const content = fs.readFileSync(file.localPath, 'utf8');
    const sizeKB = (content.length / 1024).toFixed(1);
    process.stdout.write(`   Uploading ${file.shopifyKey} (${sizeKB} KB)... `);
    try {
      await uploadAsset(file.shopifyKey, content);
      console.log('✅  HTTP 200');
    } catch (e) {
      console.log(`❌  ${e.message}`);
    }
  }
  console.log('\nTerminé.\n');
}

main();
