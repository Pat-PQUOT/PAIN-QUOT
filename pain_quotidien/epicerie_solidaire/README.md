# Scripts Épicerie Solidaire - Pain Quotidien

Ce dossier contient tous les scripts créés pour le module Épicerie Solidaire.

## Structure

```
epicerie_solidaire/
├── server_scripts/
│   ├── reception_don_stock_update.py      # Stock + lors validation réception
│   ├── reception_don_stock_cancel.py      # Stock - lors annulation réception
│   ├── distribution_don_stock_update.py   # Stock - lors validation distribution
│   └── distribution_don_stock_cancel.py   # Stock + lors annulation distribution
│
├── client_scripts/
│   ├── reception_don_calculs.js           # Calculs auto + scan code-barre + API
│   ├── distribution_don_calculs.js        # Calculs auto + scan code-barre
│   ├── beneficiaire_historique.js         # Historique 5 dernières distributions
│   ├── donateur_historique.js             # Historique 5 dernières réceptions
│   ├── article_epicerie_list_settings.js  # Cache colonne ID dans liste
│   └── article_epicerie_api.js            # Intégration APIs Open Food Facts
│
└── README.md
```

## Server Scripts

Ces scripts sont exécutés côté serveur lors des événements DocType.

| Script | DocType | Événement | Action |
|--------|---------|-----------|--------|
| reception_don_stock_update | Reception Don | After Submit | +stock articles, +stats donateur |
| reception_don_stock_cancel | Reception Don | After Cancel | -stock articles, -stats donateur |
| distribution_don_stock_update | Distribution Don | After Submit | -stock articles, +stats bénéficiaire |
| distribution_don_stock_cancel | Distribution Don | After Cancel | +stock articles, -stats bénéficiaire |

## Client Scripts

Ces scripts sont exécutés côté navigateur.

| Script | DocType | Vue | Fonction |
|--------|---------|-----|----------|
| reception_don_calculs | Reception Don | Form | Calculs totaux, scan code-barre, création article via API |
| distribution_don_calculs | Distribution Don | Form | Calculs totaux, scan code-barre, vérification stock |
| beneficiaire_historique | Beneficiaire Epicerie | Form | Affiche tableau 5 dernières distributions |
| donateur_historique | Donateur Epicerie | Form | Affiche tableau 5 dernières réceptions |
| article_epicerie_list_settings | Article Epicerie | List | Cache colonne ID redondante |
| article_epicerie_api | Article Epicerie | Form | Recherche API sur saisie code-barre |

## Installation dans Frappe

### Server Scripts
1. Aller dans **Server Script** > **New**
2. Copier le contenu du fichier .py
3. Configurer :
   - Script Type: DocType Event
   - Reference DocType: (voir tableau)
   - DocType Event: (voir tableau)
4. Sauvegarder et activer

### Client Scripts
1. Aller dans **Client Script** > **New**
2. Copier le contenu du fichier .js
3. Configurer :
   - DocType: (voir tableau)
   - View: Form ou List
   - Enabled: ✓
4. Sauvegarder

## APIs Utilisées

- **Open Food Facts** : `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- **Open Products Facts** : `https://world.openproductsfacts.org/api/v2/product/{barcode}.json`
- **Open Price** : `https://prices.openfoodfacts.org/api/v1/prices?product_code={barcode}`

## Auteur

Projet Pain Quotidien - Gestion Solidaire
Dernière mise à jour : Janvier 2026
