# Guide d'intégration Shopify — PRINT.BZH

## Fichiers produits
| Fichier | Description |
|---|---|
| `printbzh-landing.liquid` | Section Shopify complète (HTML + CSS + JS) |
| `images/README-images.md` | Guide pour préparer et uploader les photos |

---

## Étape 1 — Uploader la section dans Shopify

1. Aller dans **Shopify Admin > Boutique en ligne > Thèmes**
2. Cliquer sur **Modifier le code** (Actions > Modifier le code)
3. Dans le dossier **Sections**, cliquer sur **Ajouter une nouvelle section**
4. Nommer le fichier : `printbzh-landing`
5. Remplacer tout le contenu par le contenu de `printbzh-landing.liquid`
6. **Sauvegarder**

---

## Étape 2 — Créer une page dédiée

1. Aller dans **Shopify Admin > Boutique en ligne > Pages**
2. Créer une nouvelle page : `Accueil PRINT.BZH`
3. Dans **Modèle de suffixe de page**, sélectionner `printbzh` (si template créé) ou utiliser directement la section via le personnaliseur

**Alternative (plus simple) :**
1. Aller dans **Boutique en ligne > Personnaliser**
2. Naviguer vers la page d'accueil
3. Cliquer **Ajouter une section**
4. Choisir **PRINT.BZH Landing Page**

---

## Étape 3 — Uploader les images

1. Dans **Modifier le code > Assets**, cliquer sur **Ajouter des fichiers**
2. Uploader chaque photo selon les noms définis dans `images/README-images.md`
3. Décommenter les lignes d'images dans `printbzh-landing.liquid` (instructions dans le fichier)

---

## Étape 4 — Configurer le webhook n8n

Dans `printbzh-landing.liquid`, ligne ~920 :
```js
const N8N_WEBHOOK = 'VOTRE_WEBHOOK_N8N';
```
Remplacer par l'URL de votre webhook n8n (ex: `https://votre-instance.n8n.cloud/webhook/devis-printbzh`)

Le chatbot envoie automatiquement ces données au webhook :
```json
{
  "source": "chatbot_printbzh",
  "produit": "t-shirts",
  "quantite": 50,
  "technique": "serigraphie",
  "couleurs": "2",
  "details": "visuel prêt",
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "telephone": "06 XX XX XX XX",
  "estimation_unitaire": "5.50",
  "estimation_total": "310.00",
  "date": "2026-03-12T10:00:00.000Z"
}
```

---

## Étape 5 — Personnaliser les infos de contact

Dans `printbzh-landing.liquid`, section Contact (chercher `06 XX XX XX XX`) :
- Remplacer le numéro de téléphone
- Vérifier l'email `contact@print.bzh`
- Mettre à jour l'adresse si nécessaire

---

## Structure des dossiers

```
SITE WEB/
├── printbzh-landing.liquid     ← Section Shopify principale
├── cahier-des-charges-printbzh.md
├── hero-printbzh.jsx           ← Source React originale
├── README-shopify.md           ← Ce fichier
└── images/
    ├── README-images.md        ← Guide photos
    ├── hero/                   ← Photos hero
    ├── atelier/                ← Photos atelier
    ├── produits/               ← Photos produits
    └── realisations/           ← Photos projets clients
```

---

## Questions ouvertes (cahier des charges)

- [ ] Couleur d'accent confirmée ? (actuellement vert #1B5E3B + orange #D4762C)
- [ ] Numéro de téléphone réel
- [ ] Compte Shopify créé et thème choisi
- [ ] Compte n8n créé pour le webhook chatbot
- [ ] Photos disponibles (voir `images/README-images.md`)
