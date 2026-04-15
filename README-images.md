# Guide — Photos à préparer pour PRINT.BZH

## Où mettre les photos
Placer les photos dans le dossier correspondant, puis les **uploader dans Shopify Admin > Thèmes > Modifier le code > Assets**.

---

## images/hero/
| Fichier Shopify (Assets) | Description | Format conseillé |
|---|---|---|
| `printbzh-hero-bg.jpg` | Photo fond hero plein écran — atelier, textile premium, ambiance sombre | 1920×1080px min, JPG optimisé |

---

## images/atelier/
| Fichier Shopify (Assets) | Description | Format conseillé |
|---|---|---|
| `printbzh-atelier.jpg` | Photo de l'atelier ou du process de fabrication | 800×1000px (ratio 4/5), JPG |

---

## images/produits/
| Fichier Shopify (Assets) | Description | Format conseillé |
|---|---|---|
| `printbzh-produit-tshirt.jpg` | T-shirt Stanley Stella porté ou à plat | 600×800px (ratio 3/4), JPG |
| `printbzh-produit-sweat.jpg` | Sweat/hoodie Stanley Stella | 600×800px, JPG |
| `printbzh-produit-casquette.jpg` | Casquette | 600×800px, JPG |
| `printbzh-produit-totebag.jpg` | Tote bag | 600×800px, JPG |

---

## images/techniques/
| Fichier Shopify (Assets) | Description | Format conseillé |
|---|---|---|
| `printbzh-serigraphie.jpg` | Photo sérigraphie — process ou résultat, fond sombre | 1920×1080px min, JPG |
| `printbzh-broderie.jpg` | Photo broderie — gros plan aiguille ou résultat, fond sombre | 1920×1080px min, JPG |
| `printbzh-dtf.jpg` | Photo marquage DTF — imprimante ou résultat, fond sombre | 1920×1080px min, JPG |

---

## images/realisations/
Réservé aux futures photos de projets clients (section Réalisations à venir).

---

## Activer les images dans le Liquid

Une fois les photos uploadées dans Shopify Assets, décommenter les lignes dans `printbzh-landing.liquid` :

**Hero** (ligne ~272) :
```
/* Dès que la photo est uploadée dans Shopify, décommenter :
background-image: url('{{ "printbzh-hero-bg.jpg" | asset_url }}');
```

**Atelier** (ligne ~450) :
```html
<!-- Remplacer par : <img src="{{ 'printbzh-atelier.jpg' | asset_url }}" alt="Atelier PRINT.BZH"> -->
```

**Techniques** — chaque bloc a son commentaire :
```
/* Shopify: background-image:url('{{ "printbzh-serigraphie.jpg" | asset_url }}') */
```

**Produits** — chaque carte a son commentaire :
```html
<!-- <img src="{{ 'printbzh-produit-tshirt.jpg' | asset_url }}" alt="T-shirts personnalisés"> -->
```
