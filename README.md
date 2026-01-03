# Pain Quotidien - Application ERPNext Épicerie Solidaire

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ERPNext](https://img.shields.io/badge/ERPNext-v15-blue.svg)](https://erpnext.com)
[![Statut](https://img.shields.io/badge/Statut-Production-green.svg)](https://france.frappe.cloud)

Application ERPNext personnalisée pour la gestion de l'Épicerie Solidaire de l'association Pain Quotidien.

## 📋 Vue d'ensemble

Ce projet fournit une solution complète de gestion pour une épicerie solidaire, incluant :

- 🧑‍🤝‍🧑 **Gestion des bénéficiaires** - Suivi des familles aidées
- 🎁 **Gestion des donateurs** - Traçabilité des dons
- 📦 **Gestion de stock** - Suivi des articles et inventaire
- 📊 **Distributions** - Traçabilité des distributions aux bénéficiaires
- 📈 **Dashboard & Rapports** - Statistiques et graphiques

## 🚀 Mise en production

✅ **Statut actuel** : EN PRODUCTION depuis le 03/01/2026  
🌐 **Serveur** : [france.frappe.cloud](https://france.frappe.cloud)  
👥 **Bénéficiaires actifs** : 19

## 📂 Structure du projet

```
PAIN-QUOT/
├── docs/                           # Documentation complète
│   └── synthese_complete.md       # Synthèse technique détaillée
├── pain_quotidien/
│   └── epicerie_solidaire/
│       ├── client_scripts/        # Scripts côté client (6 scripts)
│       ├── server_scripts/        # Scripts côté serveur (4 scripts)
│       └── workspace/             # Configuration Workspace
├── README.md                      # Ce fichier
└── license.txt
```

## 🎯 Fonctionnalités principales

### 1. Gestion des Bénéficiaires
- ✅ Fiche complète (nom, prénom, contact, foyer)
- ✅ Historique des distributions
- ✅ Statistiques automatiques
- ✅ Import en masse depuis Excel

### 2. Gestion des Dons et Donateurs
- ✅ Enregistrement des réceptions de dons
- ✅ Suivi des donateurs (particuliers, entreprises, associations)
- ✅ Statistiques par donateur

### 3. Gestion de Stock
- ✅ Catalogue d'articles avec catégories hiérarchiques
- ✅ Mise à jour automatique du stock (réceptions/distributions)
- ✅ Intégration API OpenFoodFacts (scan code-barre)
- ✅ Alertes stock faible

### 4. Dashboard & Reporting
- ✅ Graphique évolution distributions par mois
- ✅ Raccourcis filtrés (articles en stock, stock faible)
- ✅ Compteurs en temps réel

## 🛠️ Installation

### Prérequis
- ERPNext v15.x
- Frappe Framework v15.x
- Python 3.10+
- MariaDB 10.6+

### Installation via bench

```bash
# 1. Télécharger l'application
bench get-app https://github.com/Pat-PQUOT/PAIN-QUOT

# 2. Installer sur votre site
bench --site votre-site.local install-app pain_quotidien

# 3. Migrer la base de données
bench --site votre-site.local migrate

# 4. Redémarrer
bench restart
```

### Configuration initiale

1. **Créer le rôle "Bénévole Épicerie"** (automatique lors de l'installation)
2. **Assigner le Role Profile** aux utilisateurs
3. **Configurer le Module Profile** "Épicerie Solidaire"
4. **Importer les catégories d'articles** (Item Groups)
5. **Configurer le Workspace** (déjà créé)

## 📖 Documentation

- **Documentation complète** : [`/docs/synthese_complete.md`](./docs/synthese_complete.md)
- **Scripts serveur** : [`/pain_quotidien/epicerie_solidaire/server_scripts/`](./pain_quotidien/epicerie_solidaire/server_scripts/)
- **Scripts client** : [`/pain_quotidien/epicerie_solidaire/client_scripts/`](./pain_quotidien/epicerie_solidaire/client_scripts/)

## 🔐 Sécurité et Permissions

### Rôles
- **Bénévole Épicerie** : Accès complet au module Épicerie
- **System Manager** : Administration complète

### SSO
- ✅ Connexion via Office 365 configurée
- Domain : `@painquotidien.org`

## 🗄️ DocTypes personnalisés

| DocType | Type | Description |
|---------|------|-------------|
| **Article Epicerie** | Master | Catalogue des articles avec stock |
| **Beneficiaire Epicerie** | Master | Fichier des bénéficiaires (19 actifs) |
| **Donateur Epicerie** | Master | Fichier des donateurs |
| **Reception Don** | Transaction | Entrées de stock |
| **Distribution Don** | Transaction | Sorties de stock |

## 📊 Flux de données

```
DONATEUR → RECEPTION DON → STOCK ARTICLES → DISTRIBUTION DON → BENEFICIAIRE
              (+stock)          (inventaire)      (-stock)
```

## 🎨 Catégories d'articles

- **Alimentaire**
  - Fruits et Légumes, Produits Laitiers, Viandes et Poissons
  - Boulangerie, Épicerie Sèche, Conserves, Surgelés
  - Boissons, Petit Déjeuner, Condiments, Snacks, Plats Préparés
  
- **Non Alimentaire**
  - Hygiène, Entretien, Bébé

## 🚦 Statut du projet

### ✅ Réalisé
- [x] Architecture complète des DocTypes
- [x] Scripts de gestion de stock (4 server scripts)
- [x] Scripts calculs automatiques (6 client scripts)
- [x] Workspace personnalisé avec dashboard
- [x] Import de 19 bénéficiaires
- [x] Permissions et sécurité
- [x] Intégration SSO Office 365

### 🔄 En cours
- [ ] Premières distributions
- [ ] Premières réceptions de dons

### 📅 À venir
- [ ] Alertes automatiques (stock bas, DLC)
- [ ] Gestion dates d'expiration (FIFO)
- [ ] Rapports personnalisés avancés
- [ ] Module Pharmacie Solidaire

## 🤝 Contribution

Ce projet est développé pour l'association Pain Quotidien. Pour toute question ou suggestion :

- 📧 Contact : [votre-email]
- 🐛 Issues : [GitHub Issues](https://github.com/Pat-PQUOT/PAIN-QUOT/issues)

## 📝 Changelog

### v1.0.0 - 03/01/2026 - Mise en Production
- ✅ Système complet fonctionnel
- ✅ 19 bénéficiaires importés
- ✅ Dashboard avec graphiques
- ✅ Workspace personnalisé
- ✅ Scripts de gestion de stock
- ✅ Intégration OpenFoodFacts

### v0.2.0 - 02/01/2026
- ✅ Création Reception Don et Distribution Don
- ✅ Server Scripts gestion de stock
- ✅ Permissions et rôles

### v0.1.0 - 01/01/2026
- ✅ Création DocTypes de base
- ✅ Intégration APIs (OpenFoodFacts)
- ✅ Workspace initial

## 📄 License

MIT License - voir [license.txt](./license.txt)

---

**Développé avec ❤️ pour l'association Pain Quotidien**  
*Serveur de production : [france.frappe.cloud](https://france.frappe.cloud)*
