# 📊 SYNTHÈSE V2 - CLARIFICATIONS PÔLE CH & PHARMACIE PARIS
## Mise à jour : 08 janvier 2026

---

## ⚠️ CLARIFICATION MAJEURE ARCHITECTURE

### ❌ ERREUR INITIALE

Pharmacie Paris était comprise comme un **pôle indépendant** séparé.

### ✅ ARCHITECTURE CORRECTE

**Pharmacie Paris** fait partie intégrante du **PÔLE CH (Centres Hospitaliers)** :

```
PÔLE CH (CENTRES HOSPITALIERS)
│
├── 💊 PHARMACIE PARIS (Hub central) ← À DÉMARRER
│   ├── Équipe pharmaciens diplômés Paris
│   ├── Gestion centralisée TOUS médicaments
│   ├── Réception dons médicaments (gros volumes)
│   ├── Classification ATC/DCI automatique
│   ├── Traçabilité stricte (lots + péremptions)
│   ├── Envois vers pharmacies hôpitaux
│   └── Suivi temps réel stocks distants
│
├── 🏥 Hôpital Tananarive (Madagascar) 📅 FUTUR
│   ├── Pharmacie locale (reçoit envois Paris)
│   ├── Dossiers patients
│   └── Healthcare complet
│
├── 🏥 Hôpital Kinshasa (RDC) 📅 FUTUR
│   ├── Pharmacie locale (reçoit envois Paris)
│   └── Healthcare complet
│
└── 🏥 4 hôpitaux en construction 📅 FUTUR
    └── Pharmacies locales futures
```

---

## 🔄 WORKFLOW COMPLET

### Pharmacie Paris (Hub central)

```
1. RÉCEPTION DONS
   └─> Scan GTIN → Enrichissement BDPM France
       └─> Classification ATC/DCI automatique
           └─> Lot + Péremption
               └─> Stock central Paris

2. GESTION STOCK CENTRAL
   ├─> Traçabilité stricte par lot
   ├─> Alertes péremption (< 6 mois)
   ├─> FIFO automatique
   └─> Dashboard temps réel

3. ENVOIS HÔPITAUX
   └─> Demande approvisionnement hôpital X
       └─> Préparation (FIFO auto)
           └─> Validation pharmacien responsable
               └─> Bordereau envoi
                   └─> Expédition
                       └─> Stock Paris (-) / Stock hôpital (+)
```

### Pharmacies hôpitaux distants

```
1. RÉCEPTION ENVOI PARIS
   └─> Accusé réception
       └─> Stock local (+)

2. DISPENSATION PATIENTS
   └─> Stock local (-)

3. DEMANDE RÉAPPROVISIONNEMENT
   └─> Alerte stock bas
       └─> Demande vers Paris
```

---

## 🏗️ STRUCTURE GITHUB CORRIGÉE

```
PAIN-QUOT/
├── pain_quotidien/
│   │
│   ├── epicerie_solidaire/        ✅ Pôle indépendant (v1.1.0)
│   │   ├── client_scripts/ (7)
│   │   ├── server_scripts/ (4)
│   │   ├── workspace/
│   │   └── README.md
│   │
│   └── pole_ch/                   🆕 Pôle Centres Hospitaliers
│       │
│       ├── pharmacie_paris/       🆕 Hub central à créer MAINTENANT
│       │   ├── client_scripts/
│       │   │   ├── medicament_enrichissement_gtin.js
│       │   │   ├── lot_medicament_peremption.js
│       │   │   ├── envoi_pharmacie_fifo_scanner.js
│       │   │   ├── reception_pharmacie_scanner.js
│       │   │   └── etablissement_historique.js
│       │   │
│       │   ├── server_scripts/
│       │   │   ├── reception_pharmacie_stock_update.py
│       │   │   ├── reception_pharmacie_stock_cancel.py
│       │   │   ├── envoi_pharmacie_stock_update.py
│       │   │   ├── envoi_pharmacie_stock_cancel.py
│       │   │   ├── lot_stock_alertes_peremption.py
│       │   │   └── demande_approvisionnement_workflow.py
│       │   │
│       │   ├── workspace/
│       │   │   └── pharmacie_paris.json
│       │   │
│       │   └── README_PHARMACIE_PARIS.md
│       │
│       └── healthcare/            📅 FUTUR (après Pharmacie)
│           ├── dossiers_patients/
│           ├── consultations/
│           └── workspace/
```

---

## 📋 DOCTYPES PHARMACIE PARIS (8 au total)

### 1️⃣ Medicament (Master - Référentiel unique)

**Partagé par TOUS les hôpitaux**

Sections :
- Identification Produit (GTIN, nom commercial, DCI, dosage, forme, laboratoire)
- Classification ATC/OMS (5 niveaux)
- Enrichissement auto (BDPM, WHO, UNICEF, IDA)
- Statut

### 2️⃣ Stock Pharmacie Paris (Master)

**Stock central hub**

- Médicament
- Stock actuel total
- Seuil alerte
- Lots en stock (Child Table)

### 3️⃣ Lot Stock Paris (Child Table)

**Traçabilité stricte**

- Numéro lot
- Date péremption
- Quantité restante/initiale
- Statut (Disponible / Réservé / Périmé / Bloqué)

### 4️⃣ Reception Pharmacie Paris (Submittable)

**Entrées stock central**

- Date réception
- Donateur
- Articles reçus (Child Table avec lots)
- Totaux auto-calculés

### 5️⃣ Envoi Pharmacie (Submittable)

**Sorties vers hôpitaux**

- Date envoi
- Établissement santé
- Articles envoyés (Child Table FIFO)
- Bordereau numéro (auto)
- Statut envoi (Brouillon → Préparé → Validé → Expédié → Reçu)
- Validation pharmacien responsable

### 6️⃣ Etablissement Sante (Master)

**Hôpitaux destinations**

- Nom établissement
- Type (Hôpital / Centre médical / Clinique)
- Pays, ville, adresse
- Contact pharmacien responsable
- frappe_site_url (pour sync future)
- Historique envois

### 7️⃣ Demande Approvisionnement (Submittable)

**Hôpitaux → Paris**

- Établissement demandeur
- Articles demandés
- Priorité (Urgente / Normale)
- Stock actuel hôpital (info)
- Statut
- Envoi lié (quand créé)

### 8️⃣ Donateur Pharmacie (Master)

**Donneurs médicaments**

- Nom donateur
- Type (Laboratoire / Pharmacie / Hôpital / Grossiste / Particulier)
- Contact
- Historique dons

---

## 🎯 ROADMAP PHARMACIE PARIS

### Phase 1.1 - Référentiel (Priorité 1) ⏱️ Semaine 08-14/01/2026

- [ ] Créer DocType Medicament
- [ ] Client Script enrichissement GTIN
- [ ] Intégration API BDPM France (ANSM)
- [ ] Classification ATC automatique
- [ ] Tests scan + enrichissement

### Phase 1.2 - Réceptions (Priorité 2) ⏱️ Semaine 15-21/01/2026

- [ ] DocTypes: Reception, Stock, Lot, Donateur
- [ ] Server Scripts gestion stock
- [ ] Client Script scanner mobile
- [ ] Tests réception réelle

### Phase 1.3 - Envois (Priorité 3) ⏱️ Février 2026

- [ ] DocTypes: Envoi, Etablissement, Demande
- [ ] Server Script FIFO + workflow
- [ ] Client Script scanner envoi
- [ ] Tests envoi vers hôpital test

### Phase 1.4 - Alertes (Priorité 4) ⏱️ Février 2026

- [ ] Server Script alertes péremption
- [ ] Dashboard suivi stocks
- [ ] Notifications auto
- [ ] Rapports

### Phase 1.5 - Production (Priorité 5) ⏱️ Mars 2026

- [ ] Workspace complet
- [ ] Documentation pharmaciens
- [ ] Formation équipe Paris
- [ ] Import stock réel
- [ ] Mise en production
- [ ] Premier envoi hôpital réel

---

## 🔑 DIFFÉRENCES CLÉS ÉPICERIE vs PHARMACIE

| Aspect | Épicerie Solidaire | Pharmacie Paris |
|--------|-------------------|-----------------|
| **Destinataires** | Bénéficiaires individuels | Établissements de santé (hôpitaux) |
| **Stock** | Articles alimentaires | Médicaments |
| **Sortie** | Distribution | Envoi/Transfert |
| **Traçabilité** | Simple | STRICTE (lot, péremption, DCI) |
| **Réglementation** | Hygiène alimentaire | Pharmaceutique |
| **Transport** | Local (Paris) | International (Madagascar, RDC...) |
| **Workflow** | Direct | Validation pharmacien obligatoire |
| **Volume** | Moyen | GROS volumes |
| **Enrichissement** | Open Food Facts | BDPM + WHO + UNICEF + IDA |
| **Classification** | Catégories simples | ATC/OMS (5 niveaux) |

---

## 👥 RÔLES & PERMISSIONS

### Rôle : "Pharmacien CH"

**Utilisateurs** : Pharmaciens diplômés équipe Paris

**Permissions** :
- Medicament : Read, Write, Create, Delete, Report
- Stock, Lot, Reception, Envoi : Complet
- Demande Approvisionnement : Read, Update
- Etablissement, Donateur : Read, Write, Create

### Rôle : "Pharmacien Responsable CH"

**Utilisateurs** : Pharmacien(s) responsable(s)

**Permissions** : Pharmacien CH +
- **Validation Envoi obligatoire**
- Gestion utilisateurs Pharmacie
- Configuration système

### Rôle : "Pharmacien Hôpital"

**Utilisateurs** : Pharmaciens hôpitaux distants

**Permissions** :
- Medicament : Read
- Stock Paris : Read (voir disponibilités)
- Envoi : Read (leurs envois)
- Demande Approvisionnement : Read, Write, Create
- Leur stock local : Read, Write (si Healthcare activé)

---

## 🔗 INTÉGRATIONS APIs PRIORITAIRES

### 1. BDPM France (ANSM) - PRIORITÉ 1 🎯

**URL** : https://base-donnees-publique.medicaments.gouv.fr/  
**Type** : Base publique gratuite France  
**Format** : CSV / API REST  

**Workflow** :
1. Scan GTIN (code-barre)
2. → Recherche CIP (Code Identifiant Présentation)
3. → CIP → CIS (Code Identifiant Spécialité)
4. → Enrichissement TOUTES données :
   - Nom commercial
   - DCI
   - Forme pharmaceutique
   - Laboratoire
   - AMM
   - Conditionnements

### 2. WHO ATC/DDD Index

**URL** : https://www.whocc.no/  
**Usage** : Classification ATC automatique via DCI

### 3. UNICEF Supply Catalogue

**Usage** : Prix de référence humanitaire, valorisation

### 4. IDA Foundation

**Usage** : Données complémentaires

### 5. GS1 GTIN Database

**Usage** : Validation codes-barres internationaux

---

## ⚠️ SPÉCIFICITÉS CRITIQUES

### 1. Traçabilité OBLIGATOIRE

- ❗ Numéro de lot SUR CHAQUE ligne (réception, envoi)
- ❗ Date péremption SUR CHAQUE ligne
- ❗ FIFO automatique (lot le plus ancien en premier)
- ❗ Blocage automatique lots périmés ou < 3 mois

### 2. Validation pharmaceutique

- ❗ Workflow Envoi : Préparation → **Validation pharmacien responsable** → Expédition
- ❗ Signature électronique pharmacien
- ❗ Bordereau envoi généré automatiquement

### 3. Gros volumes

- ❗ Indexation BDD optimisée
- ❗ Enrichissement Just-in-Time (pas tout d'un coup)
- ❗ Cache API pour performance
- ❗ Pagination listes

### 4. Réglementaire

- ❗ Conformité pharmaceutique France
- ❗ Conformité internationale (OMS)
- ❗ Audit trail complet
- ❗ Rapports obligatoires

---

## ✅ PROCHAINES ÉTAPES IMMÉDIATES

### Cette semaine (08-14/01/2026)

1. ⏳ **Confirmer questions ci-dessous**
2. ⏳ Modéliser DocType Medicament (structure complète)
3. ⏳ Créer DocType sur france.frappe.cloud
4. ⏳ Client Script enrichissement GTIN
5. ⏳ Tester intégration BDPM France

### Questions à clarifier AVANT de démarrer

1. **Serveur** : Confirmer travail direct sur **france.frappe.cloud** ?
2. **Équipe** : Combien de pharmaciens dans l'équipe Paris ?
3. **Workflow** : Validation pharmacien responsable OBLIGATOIRE avant CHAQUE envoi ?
4. **Stocks distants** : Phase 1 = juste tracer envois OU récupérer stocks réels via API ?
5. **Volumétrie** : Combien de références médicaments actuellement en stock Paris ?

---

## 📚 DOCUMENTS COMPLÉMENTAIRES

Ce document = **Résumé exécutif** clarifications Pôle CH

**Documents détaillés disponibles** :
- `/docs/SYNTHESE_COMPLETE_DETAILLEE.md` (spécifications complètes 1200+ lignes)
- `/docs/synthese_epicerie_solidaire_040126.md` (Épicerie v1.1.0)
- `CHANGELOG.md` (historique versions)
- `README_SCANNER_MOBILE.md` (technique scanner mobile)

---

**VERSION** : 2.0 - Clarifications Pôle CH  
**DATE** : 08 janvier 2026  
**AUTEUR** : Claude AI + Patrick BELLANTI  
**STATUT** : Document de référence - À valider avant démarrage Pharmacie
