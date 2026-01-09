# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [2.0.0] - 2026-01-08 - 📚 CLARIFICATIONS ARCHITECTURE & PHARMACIE PARIS

### Documentation
- **SYNTHESE_V2_POLE_CH_PHARMACIE.md** - Résumé exécutif clarifications architecture
- Clarification majeure : Pharmacie Paris fait partie du **Pôle CH (Centres Hospitaliers)**
- Spécifications détaillées Pôle CH - Pharmacie Paris :
  - 8 DocTypes détaillés (Medicament, Stock, Lot, Reception, Envoi, Etablissement, Demande, Donateur)
  - 5 Client Scripts prévus (enrichissement GTIN, péremption, FIFO, scanner, historique)
  - 6 Server Scripts prévus (stock update, alertes, workflow)
  - Workflow complet Hub Paris → Hôpitaux distants
  - Intégrations APIs (BDPM France, WHO, UNICEF, IDA, GS1)
  - Traçabilité stricte (lots + péremptions obligatoires)
  - Classification ATC/OMS (5 niveaux)

### Architecture corrigée

**AVANT (incorrect)** :
```
Pôle Épicerie Solidaire (indépendant)
Pôle Pharmacie Paris (indépendant)
```

**MAINTENANT (correct)** :
```
Pôle Épicerie Solidaire (indépendant) ✅
Pôle CH (Centres Hospitaliers)
  └─> Pharmacie Paris (Hub central) 🆕
      └─> Envois vers hôpitaux distants
```

### Structure GitHub prévue
```
pain_quotidien/
├── epicerie_solidaire/    ✅ Actif (v1.1.0)
└── pole_ch/              🆕 À créer
    ├── pharmacie_paris/   🆕 Priorité immédiate
    └── healthcare/       📅 Futur
```

### Roadmap Pharmacie Paris (5 phases)
1. **Phase 1.1** - Référentiel Médicaments (Semaine 08-14/01/2026)
2. **Phase 1.2** - Réceptions & Stock (Semaine 15-21/01/2026)
3. **Phase 1.3** - Envois Hôpitaux (Février 2026)
4. **Phase 1.4** - Suivi & Alertes (Février 2026)
5. **Phase 1.5** - Production (Mars 2026)

### Statut
📚 **DOCUMENTATION COMPLÈTE**  
⏳ **EN ATTENTE VALIDATION** avant démarrage Pharmacie Paris  
🎯 **PRÊT À DÉMARRER** dès validation utilisateur

---

## [1.1.0] - 2026-01-08 - 📱 OPTIMISATION MOBILE ÉPICERIE

### Ajouté
- **Boutons scanner caméra 📷 sur mobile** (3 scripts)
  - `article_epicerie_api_integration.js` - Bouton après champ "famille"
  - `reception_don_scanner.js` - Bouton avant champ "scan_code_barre"
  - `distribution_don_scanner.js` - Bouton avant champ "scan_code_barre"
- Désactivation autofocus clavier mobile (évite masquage bouton)
- Gros boutons touch-friendly (padding 15px, font-size 18px)
- Détection mobile via User-Agent
- Documentation complète dans `README_SCANNER_MOBILE.md`

### Modifié
- Client Script `article_epicerie_api_integration.js` :
  - Bouton scanner uniquement sur mobile (pas sur PC)
  - Amélioration UX mobile avec blur() sur champ code-barre
- Simulation événement ENTER pour déclencher logiques existantes

### Technique
- User-Agent detection: `/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i`
- Scanner Frappe: `frappe.ui.Scanner` avec callback `on_scan`
- Simulation ENTER: `$.Event('keypress')` avec `which: 13`

### Statut
✅ **TESTÉ ET VALIDÉ** sur mobile  
✅ **DÉPLOYÉ** sur france.frappe.cloud  
📱 **UX MOBILE OPTIMISÉE**

---

## [1.0.0] - 2026-01-03 - 🚀 MISE EN PRODUCTION ÉPICERIE

### Ajouté
- Client Script `beneficiaire_calcul_nom_complet.js` - Calcul automatique du nom complet
- Documentation complète dans `/docs/synthese_complete.md`
- README.md enrichi avec documentation détaillée
- Dashboard graphique "Poids Distribué par Mois"
- Raccourcis filtrés dans le Workspace :
  - "Articles en Stock" (Vert, stock > 0)
  - "Stock Faible" (Orange, 0 < stock < 3)
- Import de 19 bénéficiaires réels
- .gitignore pour le projet
- CHANGELOG.md

### Modifié
- **BREAKING CHANGE**: Restructuration DocType `Beneficiaire Epicerie`
  - Nouveau naming: `BEN####` (sans tiret, ex: BEN0001)
  - Champs `nom` et `prenom` séparés
  - Champ `full_name` devient read-only auto-calculé
  - Format: "NOM Prénom" (ex: "DUPONT Jean")
- Workspace avec graphiques et compteurs actifs
- Correction compteur raccourci Bénéficiaires

### Supprimé
- Toutes les données de test
- Raccourci doublon "Stock Articles"

### Statut
✅ **EN PRODUCTION** sur france.frappe.cloud  
👥 **19 bénéficiaires actifs**  
📊 **Dashboard opérationnel**

---

## [0.2.0] - 2026-01-02 - TRANSACTIONS ÉPICERIE

### Ajouté
- DocType `Reception Don` (Submittable)
- DocType `Distribution Don` (Submittable)
- Server Scripts gestion de stock (4 scripts):
  - `reception_don_stock_update.py`
  - `reception_don_stock_cancel.py`
  - `distribution_don_stock_update.py`
  - `distribution_don_stock_cancel.py`
- Client Scripts calculs automatiques (réceptions et distributions)
- Historiques donateurs et bénéficiaires
- Permissions et rôles
- Configuration SSO Office 365

### Modifié
- Workspace amélioré avec sections organisées
- Permissions DocType "Page" pour accès Workspace

---

## [0.1.0] - 2026-01-01 - 🎬 PROJET INITIAL ÉPICERIE

### Ajouté
- DocType `Article Epicerie` avec gestion de stock
- DocType `Beneficiaire Epicerie` (version initiale)
- DocType `Donateur Epicerie`
- Child Tables:
  - `Ligne Reception Don`
  - `Ligne Distribution Don`
- Intégration APIs:
  - OpenFoodFacts
  - Open Products Facts
  - Open Price
- Scan code-barre fonctionnel avec dialog prévisualisation
- Workspace "Épicerie Solidaire" initial
- Catégories d'articles hiérarchiques (Item Groups → Categorie Article Epicerie)
- Rôle "Bénévole Épicerie"
- Role Profile "Bénévole Épicerie"
- Module Profile "Épicerie Solidaire"

### Structure
- `/pain_quotidien/epicerie_solidaire/` - Module principal
- `/pain_quotidien/epicerie_solidaire/client_scripts/` - Scripts client
- `/pain_quotidien/epicerie_solidaire/server_scripts/` - Scripts serveur
- `/pain_quotidien/epicerie_solidaire/workspace/` - Configuration Workspace

---

## [Non publié]

### À venir - Pharmacie Paris (Phase 1)
- [ ] Phase 1.1 - Référentiel Médicaments (Semaine 08-14/01/2026)
  - [ ] DocType Medicament avec classification ATC
  - [ ] Enrichissement GTIN via BDPM France
  - [ ] Client Script scan + enrichissement auto
- [ ] Phase 1.2 - Réceptions & Stock (Semaine 15-21/01/2026)
  - [ ] DocTypes Reception, Stock, Lot, Donateur
  - [ ] Server Scripts gestion stock + traçabilité lots
  - [ ] Client Script scanner mobile
- [ ] Phase 1.3 - Envois Hôpitaux (Février 2026)
  - [ ] DocTypes Envoi, Etablissement, Demande
  - [ ] Workflow validation pharmacien
  - [ ] FIFO automatique
- [ ] Phase 1.4 - Alertes (Février 2026)
  - [ ] Alertes péremption automatiques
  - [ ] Dashboard suivi stocks distants
- [ ] Phase 1.5 - Production (Mars 2026)
  - [ ] Workspace complet
  - [ ] Formation équipe
  - [ ] Premier envoi réel

### À venir - Autres pôles (À planifier)
- [ ] Pôle Soutien (Orphelinats, parrainages)
- [ ] Pôle Logistique (Dons matériels)
- [ ] Pôle CH - Healthcare (Dossiers patients)
- [ ] Pôle Comptabilité (2 comptabilités séparées)
- [ ] Autres pôles...

### En cours - Épicerie
- [ ] Première réception de dons réelle
- [ ] Première distribution réelle

---

**Légende** :
- ✅ Terminé
- 🔄 En cours
- 📅 Planifié
- ⚠️ Problème connu
- 🚀 Mise en production
- 📱 Mobile optimisé
- 📚 Documentation
- 🎯 Prêt à démarrer
