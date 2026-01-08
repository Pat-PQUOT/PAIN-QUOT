# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.1.0] - 2026-01-08 - 📱 OPTIMISATION MOBILE

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

## [1.0.0] - 2026-01-03 - 🚀 MISE EN PRODUCTION

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

## [0.2.0] - 2026-01-02

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

## [0.1.0] - 2026-01-01 - 🎬 PROJET INITIAL

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
- Catégories d'articles hiérarchiques (Item Groups)
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

### À venir
- [ ] Alertes automatiques stock bas
- [ ] Gestion dates d'expiration (DLC) + logique FIFO
- [ ] Rapports personnalisés avancés
- [ ] Module Pharmacie Solidaire
- [ ] Badges de couleur pour statuts Actif/Inactif

### En cours
- [ ] Première distribution réelle
- [ ] Première réception de dons

---

**Légende** :
- ✅ Terminé
- 🔄 En cours
- 📅 Planifié
- ⚠️ Problème connu
- 🚀 Mise en production
- 📱 Mobile optimisé
