# CLAUDE.MD — Projet : Site Web PRINT.BZH

> Ce fichier est le blueprint principal du projet. Claude Code doit le lire en premier avant toute action et s'y référer à chaque étape.

---

## 🏗️ ARCHITECTURE DU PROJET

```
/print-bzh
├── /directives         → Règles métier, charte graphique, contenus
├── /design             → Maquettes, assets, composants UI
├── /dev                → Code source du site (front + intégrations)
└── /tmp                → Fichiers temporaires, exports, logs
```

---

## COUCHE 1 — DIRECTIVES

### 🎯 Identité du projet

**PRINT.BZH** est le site web de **Personnalise Ton Textile** (SARL YOUTAR 1894), une entreprise de personnalisation textile basée à **Brest, Bretagne**.

**Services proposés :**
- Sérigraphie (screen printing)
- Broderie
- Marquage DTG / DTF

**Cibles :**
- **B2C** : particuliers, associations, sportifs, groupes
- **B2B** : entreprises, collectivités, revendeurs

**Univers de marque :**
- Identité visuelle CMYK (Cyan, Magenta, Yellow, Black)
- Ancrage breton fort (`.BZH`, Brest, artisanat)
- Ton direct, artisanal, pro sans être corporate

---

### 🎨 Charte graphique

| Élément | Valeur |
|---------|--------|
| Couleurs primaires | CMYK : `#00AEEF` (C), `#EC008C` (M), `#FFF200` (Y), `#231F20` (K) |
| Couleur de fond | `#F5F5F5` ou `#FFFFFF` |
| Typographie titre | Police bold, impactante, industrielle |
| Typographie corps | Claire, lisible, neutre |
| Ton visuel | Atelier, impression, encre, texture |

> ⚠️ Ne jamais utiliser des esthétiques génériques (Inter/Roboto, dégradés violets, style SaaS corporate). Le site doit ressembler à un atelier de sérigraphie breton, pas à une startup tech.

---

### 📋 Pages du site

| Page | Contenu clé |
|------|-------------|
| `/` — Accueil | Hero percutant, 3 services, CTA devis, preuves sociales |
| `/serigraaphie` | Présentation technique, avantages, galerie, tarifs indicatifs |
| `/broderie` | Idem sérigraphie |
| `/dtg-dtf` | Idem + différence DTG vs DTF expliquée |
| `/catalogue` | Intégration Stanley/Stella + autres marques (filtres matière, couleur, type) |
| `/devis` | Formulaire de demande de devis intelligent (qualification B2B/B2C) |
| `/realisations` | Portfolio photos des productions |
| `/contact` | Coordonnées boutique Brest, horaires, formulaire |
| `/blog` (optionnel) | Articles SEO (sérigraphie Brest, broderie entreprise, etc.) |

---

### 🛠️ Stack technique

- **Frontend** : HTML/CSS/JS vanilla ou **Shopify Liquid** selon contexte
- **Framework CSS** : TailwindCSS (si hors Shopify) ou styles inline Shopify
- **Animations** : CSS natif, GSAP si nécessaire
- **Simulateur de prix** : JavaScript vanilla avec grille tarifaire en JSON
- **Personnalisation produit** : Intégration **Zakeke**
- **CMS/E-commerce** : **Shopify Basic** (plan actuel)
- **Paiement boutique physique** : Shopify POS

> ⚠️ Toujours coder mobile-first. Le site doit être parfait sur smartphone.

---

### 📐 Skills Claude à utiliser

| Tâche | Skill |
|-------|-------|
| Création de composants UI, pages, maquettes | `frontend-design` (user skill) |
| Audit SEO, balises, structure | `seo-audit` (user skill) |
| Génération de documents Word (devis, BL) | `docx` |
| Création/édition de grilles tarifaires | `xlsx` |
| Lecture de fichiers PDF fournisseurs | `pdf-reading` |

> Le skill `frontend-design` est **prioritaire** pour tout travail visuel. Il doit être lu avant de coder quoi que ce soit d'UI.

---

## COUCHE 2 — RÈGLES DE DÉVELOPPEMENT

### 🧠 Comportement attendu de Claude

1. **Avant tout travail UI** : lire `/mnt/skills/user/frontend-design/SKILL.md`
2. **Avant tout audit SEO** : lire `/mnt/skills/user/seo-audit/SKILL.md`
3. **Toujours produire du code complet et fonctionnel**, pas de pseudo-code
4. **Versionner les fichiers** avec un suffixe `_v1`, `_v2` si plusieurs itérations
5. **Commenter le code** en français

### 🎨 Règles de design

- Utiliser les 4 couleurs CMYK comme système de couleur principal
- Chaque section peut être "colorée" par une couleur CMYK dominante
- Les textures et effets doivent évoquer l'impression (tramé, encre, sérigraphie)
- Les images produits doivent avoir un fond neutre ou contextualisé atelier
- Animations : sobres mais impactantes (pas d'effets de particules inutiles)

### 🔍 Règles SEO

- Chaque page doit avoir : `<title>` unique (50-60 car.), meta description (150-160 car.), un seul `<h1>`
- Mots-clés prioritaires : `sérigraphie Brest`, `broderie entreprise Bretagne`, `marquage textile Brest`, `t-shirt personnalisé Finistère`
- Structured data (Schema.org) : `LocalBusiness`, `Product`, `FAQPage`
- URLs propres : `/serigraaphie-brest`, `/broderie-personnalisee`, `/dtg-dtf`

### ⚡ Règles de performance

- Images : WebP, lazy loading, taille max 200 Ko
- Fonts : max 2 familles, preload activé
- CSS critique inline pour le First Paint
- Score Lighthouse cible : > 90 sur mobile

---

## COUCHE 3 — FONCTIONNALITÉS CLÉS

### 💰 Simulateur de prix

Logique de calcul à intégrer en JS :

```
Prix = (Prix unitaire palier) × Quantité + Frais de setup
```

Paramètres :
- Technique : sérigraphie / broderie / DTG / DTF
- Nombre de couleurs (sérigraphie uniquement)
- Quantité (paliers : 10, 25, 50, 100, 200, 500+)
- Emplacement (poitrine, dos, manche, etc.)

> Le fichier source des tarifs est dans `/dev/data/tarifs.json`

---

### 📬 Formulaire de devis

Qualification en 2 étapes :

**Étape 1 — Qualification :**
- Particulier ou professionnel ?
- Technique souhaitée
- Quantité estimée
- Date souhaitée

**Étape 2 — Coordonnées :**
- Nom, email, téléphone
- Message + upload fichier (logo, BAT)

> Le formulaire envoie vers l'email professionnel via n8n ou webhook Shopify.

---

### 🤖 Chatbot devis (intégration Claude API)

Un chatbot en bas de page qualifie les prospects et génère des devis automatiques via l'API Claude (projet "Devis" configuré dans Claude.ai).

Architecture : `Shopify widget JS → Webhook n8n → API Claude → Réponse affichée`

---

## ✅ Définition du "Done"

Le site est considéré terminé quand :
- [ ] Toutes les pages listées sont codées et responsives
- [ ] Le simulateur de prix fonctionne sur mobile
- [ ] Le formulaire de devis envoie correctement
- [ ] Score Lighthouse mobile > 90
- [ ] SEO on-page validé (balises, schema, sitemap)
- [ ] Intégration Zakeke testée sur au moins 1 produit
- [ ] Chatbot devis opérationnel en production
