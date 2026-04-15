# Cahier des Charges — Site Web PRINT.BZH
**Version :** 1.0  
**Date :** Mars 2026  
**Statut :** Document de référence projet

---

## 1. Présentation du client

**Entreprise :** PRINT.BZH  
**Activité :** Atelier d'impression textile artisanal basé à Brest, Bretagne  
**Spécialités :**
- Sérigraphie
- Broderie
- Marquage DTG (Direct to Garment)

**Positionnement :** Atelier local, savoir-faire premium, interlocuteur unique de la création à la livraison.

**Fournisseurs textiles :**
- **Stanley Stella** — revendeur officiel (marque principale mise en avant)
- AS Colour
- Native Spirit
- SOLS
- ATLANTIS

---

## 2. Cible et objectifs business

### Cible principale (B2B)
- Associations et organisations
- Entreprises (uniformes, vêtements de travail, cadeaux)
- Bars, restaurants, hôtels (staff, merch)
- Artistes, créateurs, marques indépendantes (merch)

### Besoin client type
Des professionnels cherchant à **marquer des vêtements premium pour la revente ou l'usage interne**, avec une exigence de qualité, de conseil et de réactivité.

### Objectifs du site
1. Générer des demandes de devis qualifiées
2. Renforcer la crédibilité et l'image premium de l'atelier
3. Présenter les techniques et produits disponibles
4. Permettre une exploration autonome des gammes textiles
5. Préparer les intégrations futures (automatisations, CRM, e-commerce)

---

## 3. Direction artistique

### Positionnement visuel
**Premium, épuré, impactant.**

### Références visuelles
- **YOUTAR 1894** — sobriété craft, typographie forte
- **RENDERED** — hero plein écran, photographie lifestyle textile
- **MERCHERY** — preuve sociale, pricing transparent, CTA clairs

### Principes graphiques
| Élément | Directive |
|---|---|
| Visuels | Plein écran, photographies lifestyle Stanley Stella en fond |
| Typographie | Bold, contrastée, sans-serif impactante pour les titres |
| Palette | Sobre (noir, blanc, gris chaud) + **1 couleur d'accent forte** à définir |
| Espacement | Généreux, mise en page aérée, sections bien séparées |
| Preuve sociale | Témoignages clients, photos avant/après, avis intégrés |

### Ton éditorial
- Professionnel et motivant
- Humain, incarné, ancré dans le territoire breton
- Pas de jargon corporate ni d'anglicismes inutiles
- **Langue : français uniquement**

---

## 4. Architecture du site

### Pages principales

#### 4.1 Page d'accueil
- Hero section immersive (visuel plein écran + accroche forte)
- Présentation rapide de l'atelier (3–4 lignes max)
- Mise en avant des 3 techniques (sérigraphie, broderie, DTG)
- Sélection de produits phares
- Bloc témoignages / preuve sociale
- Carrousel Instagram
- CTA demande de devis

#### 4.2 L'atelier
- Histoire et valeurs de PRINT.BZH
- L'équipe (si applicable)
- Photos de l'atelier / process de fabrication
- Localisation Brest

#### 4.3 Nos techniques
- **Sérigraphie** — présentation, avantages, cas d'usage idéaux
- **Broderie** — présentation, avantages, cas d'usage idéaux
- **DTG** — présentation, avantages, cas d'usage idéaux
- Tableau comparatif des techniques

#### 4.4 Stanley Stella
- Page dédiée au partenariat revendeur officiel
- Présentation de la marque et de ses valeurs (éco-responsabilité, qualité)
- Catalogue produits Stanley Stella disponibles

#### 4.5 Nos produits textiles
- T-shirts
- Sweats & hoodies
- Casquettes
- Tote bags
- Autres (à compléter)

Chaque catégorie : fiche avec marques disponibles, matières, coloris, visuels.

#### 4.6 Personnalisation en ligne
- Intégration du plug-in **Zakeke**
- Parcours guidé de création
- Explication du process de commande

#### 4.7 Réalisations & témoignages
- Galerie de projets clients (photos)
- Témoignages écrits avec nom, structure, secteur
- Avis clients

#### 4.8 Blog / Conseils
- Articles conseils (choix technique, entretien vêtements, tendances merch...)
- À activer progressivement

#### 4.9 Contact & Devis
- Formulaire de demande de devis structuré
- Intégration future avec n8n (prise de RDV, notifications, CRM)
- Adresse, téléphone, email
- Lien Instagram

---

## 5. Stack technique

| Élément | Choix |
|---|---|
| CMS / e-commerce | **Shopify** |
| Personnalisation produit | **Zakeke** (plug-in Shopify) |
| Automatisations | **n8n** (intégrations futures) |
| Code produit | HTML / CSS / JavaScript (intégration manuelle dans Shopify) |
| Composants UI | React si nécessaire |

### Contraintes techniques
- Code **propre, commenté, modulaire** pour faciliter la maintenance
- Formulaires structurés pour **compatibilité n8n** (champs nommés clairement)
- Pas de dépendances inutiles
- Performance et accessibilité (images optimisées, balises sémantiques)

---

## 6. Intégrations prévues

### Présentes dès le lancement
- Zakeke (configurateur produit en ligne)
- Instagram feed (carrousel)

### Futures (à anticiper dans la structure du code)
| Intégration | Usage |
|---|---|
| n8n | Prise de RDV, notifications email/SMS, CRM |
| CRM | Suivi des prospects et clients |
| Séquences email | Nurturing post-devis |
| Chatbot / formulaire IA | Pré-qualification des demandes, devis automatisé |

---

## 7. Livrables attendus

- [ ] Maquettes / wireframes des pages principales (à valider avant code)
- [ ] Composants HTML/CSS/JS pour chaque section
- [ ] Hero section immersive (page d'accueil)
- [ ] Page atelier
- [ ] Page Stanley Stella
- [ ] Fiches produits (structure générique réutilisable)
- [ ] Section témoignages
- [ ] Carrousel Instagram
- [ ] Formulaire de devis (compatible n8n)
- [ ] Page contact

---

## 8. Process de travail

### Règles de collaboration

1. **Valider avant de produire** — Toujours résumer la compréhension, proposer un plan, attendre validation avant tout code ou contenu.
2. **Proposer des alternatives** — Sur les choix créatifs (visuels, wording, structure), présenter 2 à 3 options argumentées.
3. **Itérer par sections** — Livraison progressive, section par section, avec validation à chaque étape.

### Workflow type pour chaque livrable
```
1. Brief → Résumé de compréhension + plan proposé
2. Validation client
3. Développement (code + contenu)
4. Révisions
5. Livraison finale + documentation
```

---

## 9. Ce qu'il faut éviter

- ❌ Produire du code ou contenu sans validation préalable
- ❌ Designs génériques ou templates reconnaissables
- ❌ Ton corporate froid
- ❌ Anglicismes inutiles dans le contenu
- ❌ Lourdeur visuelle, surinformation
- ❌ Formulaires non compatibles avec une intégration n8n future

---

## 10. Questions ouvertes (à clarifier)

- [ ] Couleur d'accent principale — à choisir parmi des propositions
- [ ] Visuels disponibles — photos de l'atelier, productions clients existantes ?
- [ ] Logo et charte graphique existants ?
- [ ] Domaine et hébergement Shopify — déjà en place ?
- [ ] Priorité de lancement — quelles pages en premier ?
- [ ] Budget et délais indicatifs
- [ ] Accès au compte Shopify pour intégration

---

*Document évolutif — mis à jour au fil des validations client.*