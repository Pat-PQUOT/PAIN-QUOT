# ✅ SESSION 08/01/2026 - CLARIFICATIONS PÔLE CH & PHARMACIE PARIS

**Durée** : Session complète architecture Pharmacie Paris  
**Statut** : ✅ DOCUMENTATION COMPLÈTE SAUVEGARDÉE

---

## 📋 CE QUI A ÉTÉ FAIT

### 1. Clarification architecture majeure ⚠️

**Erreur corrigée** :
- ❌ Pharmacie Paris comprise comme pôle indépendant
- ✅ Pharmacie Paris = sous-module du **Pôle CH (Centres Hospitaliers)**

### 2. Architecture Pôle CH définie

```
PÔLE CH (CENTRES HOSPITALIERS)
│
├── Pharmacie Paris (Hub central) ← À DÉMARRER
│   └─> Envois → Hôpitaux distants
│
├── Hôpital Tananarive (Madagascar)
│   └─> Pharmacie locale (reçoit Paris)
│
├── Hôpital Kinshasa (RDC)
│   └─> Pharmacie locale (reçoit Paris)
│
└── 4 hôpitaux en construction
    └─> Pharmacies locales futures
```

### 3. Spécifications détaillées Pharmacie Paris

**DocTypes définis (8 au total)** :
1. Medicament - Référentiel unique partagé
2. Stock Pharmacie Paris - Hub central
3. Lot Stock Paris - Traçabilité stricte
4. Reception Pharmacie Paris - Entrées stock
5. Envoi Pharmacie - Sorties vers hôpitaux
6. Etablissement Sante - Destinations
7. Demande Approvisionnement - Hôpitaux → Paris
8. Donateur Pharmacie - Donneurs médicaments

**Client Scripts prévus (5)** :
- medicament_enrichissement_gtin.js
- lot_medicament_peremption.js
- envoi_pharmacie_fifo_scanner.js
- reception_pharmacie_scanner.js
- etablissement_historique.js

**Server Scripts prévus (6)** :
- reception_pharmacie_stock_update.py
- reception_pharmacie_stock_cancel.py
- envoi_pharmacie_stock_update.py
- envoi_pharmacie_stock_cancel.py
- lot_stock_alertes_peremption.py
- demande_approvisionnement_workflow.py

### 4. Workflow complet Hub Paris → Hôpitaux

**Paris (Hub)** :
1. Réception dons → Scan GTIN → Enrichissement BDPM
2. Classification ATC/DCI automatique
3. Stock central (traçabilité lots + péremptions)
4. Envoi → Validation pharmacien → Hôpital X

**Hôpitaux distants** :
1. Réception envoi Paris
2. Stock local (+)
3. Dispensation patients
4. Demande réapprovisionnement

### 5. Intégrations APIs prioritaires

**Priorité 1** : BDPM France (ANSM) - Base publique gratuite
**Priorité 2** : WHO ATC/DDD Index - Classification
**Priorité 3** : UNICEF Supply Catalogue - Prix référence
**Priorité 4** : IDA Foundation - Données complémentaires
**Priorité 5** : GS1 GTIN Database - Validation codes-barres

### 6. Roadmap Pharmacie Paris (5 phases)

- **Phase 1.1** - Référentiel (Semaine 08-14/01/2026)
- **Phase 1.2** - Réceptions (Semaine 15-21/01/2026)
- **Phase 1.3** - Envois (Février 2026)
- **Phase 1.4** - Alertes (Février 2026)
- **Phase 1.5** - Production (Mars 2026)

---

## 📂 FICHIERS CRÉÉS/MODIFIÉS

| Fichier | Type | Statut |
|---------|------|--------|
| `SYNTHESE_V2_POLE_CH_PHARMACIE.md` | Documentation | ✅ CRÉÉ |
| `CHANGELOG.md` | Historique | ✅ MIS À JOUR (v2.0.0) |
| `SAUVEGARDE_08012026.md` | Récap session précédente | ✅ EXISTANT |

**Emplacement** :
```
C:\Users\Patrick\OneDrive - PAIN QUOTIDIEN\Projets\ERP\Dev\GitHub\PAIN-QUOT\
```

---

## ⚠️ SPÉCIFICITÉS CRITIQUES PHARMACIE

### Traçabilité stricte
- ❗ Numéro de lot OBLIGATOIRE sur chaque ligne
- ❗ Date péremption OBLIGATOIRE sur chaque ligne
- ❗ FIFO automatique (lot le plus ancien en premier)
- ❗ Blocage automatique lots périmés ou < 3 mois

### Validation pharmaceutique
- ❗ Workflow Envoi : Préparation → **Validation pharmacien responsable** → Expédition
- ❗ Signature électronique pharmacien
- ❗ Bordereau envoi auto-généré

### Gros volumes
- ❗ Enrichissement Just-in-Time via scan GTIN
- ❗ Classification ATC/OMS (5 niveaux)
- ❗ Cache API pour performance
- ❗ Indexation BDD optimisée

---

## 🎯 PROCHAINES ÉTAPES

### Questions à valider AVANT démarrage

1. **Serveur** : Confirmer travail direct sur france.frappe.cloud ?
2. **Équipe** : Combien de pharmaciens dans l'équipe Paris ?
3. **Workflow** : Validation pharmacien responsable OBLIGATOIRE avant CHAQUE envoi ?
4. **Stocks distants** : Phase 1 = tracer envois OU récupérer stocks réels via API ?
5. **Volumétrie** : Combien de références médicaments actuellement en stock Paris ?

### Semaine 08-14/01/2026 (Phase 1.1)

Une fois questions validées :
1. Modéliser structure complète DocType Medicament
2. Créer DocType sur france.frappe.cloud
3. Client Script enrichissement GTIN
4. Tester intégration BDPM France
5. Importer base initiale médicaments essentiels OMS

---

## 🔧 DIFFÉRENCES CLÉS ÉPICERIE vs PHARMACIE

| Aspect | Épicerie | Pharmacie |
|--------|----------|-----------|
| **Destinataires** | Individuels | Établissements |
| **Traçabilité** | Simple | STRICTE (réglementaire) |
| **Workflow** | Direct | Validation obligatoire |
| **Volume** | Moyen | GROS |
| **Enrichissement** | Open Food Facts | BDPM + WHO + UNICEF |
| **Classification** | Catégories simples | ATC/OMS (5 niveaux) |

---

## 📚 DOCUMENTS DE RÉFÉRENCE

**Synthèse complète** : `SYNTHESE_V2_POLE_CH_PHARMACIE.md`  
**Changelog** : `CHANGELOG.md` (v2.0.0)  
**Épicerie** : `/docs/synthese_epicerie_solidaire_040126.md` (v1.1.0)  
**Scanner mobile** : `README_SCANNER_MOBILE.md`  

---

**✅ TOUT EST DOCUMENTÉ ! PRÊT À DÉMARRER PHARMACIE PARIS ! 🎉**

**⏳ EN ATTENTE : Validation des 5 questions ci-dessus**
