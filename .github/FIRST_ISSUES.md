# 🎯 PREMIÈRES ISSUES - Pharmacie Paris Phase 1.1

Ce fichier contient des exemples d'issues à créer pour démarrer **Pharmacie Paris - Phase 1.1 (Référentiel Médicaments)**.

---

## 📋 MILESTONE À CRÉER

**Nom :** `v1.2.0 - Pharmacie Phase 1.1 (Référentiel)`  
**Date cible :** Semaine du 08-14 janvier 2026  
**Description :** Création du DocType Medicament avec enrichissement GTIN via BDPM France

---

## 🎯 ISSUES À CRÉER

### Issue #1 : Valider les 5 questions préalables

**Type :** Question  
**Labels :** `question`, `priority:high`, `module:pharmacie`  
**Milestone :** v1.2.0 - Pharmacie Phase 1.1

**Titre :** `[QUESTION] Valider les 5 questions préalables avant démarrage Pharmacie`

**Description :**

```markdown
Avant de démarrer le développement de la Pharmacie Paris, nous devons valider ces 5 questions :

## Questions

1. **Serveur** : On travaille directement sur **france.frappe.cloud** (production) ?
   - [ ] Oui
   - [ ] Non (préciser serveur de dev)

2. **Équipe** : Combien de pharmaciens dans l'équipe Paris ?
   - Réponse : _____

3. **Workflow** : Validation pharmacien responsable OBLIGATOIRE avant CHAQUE envoi ?
   - [ ] Oui
   - [ ] Non (préciser workflow)

4. **Stocks distants** : Phase 1 = juste tracer envois OU récupérer stocks réels via API ?
   - [ ] Tracer envois uniquement
   - [ ] Récupérer stocks via API Frappe

5. **Volumétrie** : Combien de références médicaments actuellement en stock Paris ?
   - Réponse : _____

## Contexte

Voir spécifications complètes : `SYNTHESE_V2_POLE_CH_PHARMACIE.md`
```

---

### Issue #2 : Créer DocType Medicament

**Type :** Feature  
**Labels :** `enhancement`, `priority:critical`, `module:pharmacie`  
**Milestone :** v1.2.0 - Pharmacie Phase 1.1

**Titre :** `[FEATURE] Créer DocType Medicament (référentiel unique)`

**Description :**

```markdown
## 🎯 Objectif

Créer le DocType master **Medicament** qui servira de référentiel unique partagé par tous les hôpitaux.

## 📋 Spécifications

### Sections

1. **Identification Produit**
   - `gtin` (Data, unique) - Code-barre international
   - `nom_commercial` (Data, requis)
   - `dci` (Data) - Dénomination Commune Internationale
   - `dosage` (Data) - Ex: "1000mg"
   - `forme_pharmaceutique` (Select) - Comprimé, Gélule, Sirop, etc.
   - `conditionnement` (Data) - Ex: "Boîte de 8"
   - `laboratoire` (Data)

2. **Classification ATC/OMS (5 niveaux)**
   - `atc_code_niveau_1` (Data, 1 lettre)
   - `atc_code_niveau_2` (Data, 2 chiffres)
   - `atc_code_niveau_3` (Data, 1 lettre)
   - `atc_code_niveau_4` (Data, 1 lettre)
   - `atc_code_niveau_5` (Data, 2 chiffres)
   - `atc_description` (Small Text, read-only)

3. **Enrichissement Auto**
   - `who_essential_medicine` (Check)
   - `unicef_supply_catalogue` (Check)
   - `bdpm_cis` (Data) - Code CIS ANSM France
   - `image_url` (Data)
   - `api_source` (Select: Manual / BDPM / WHO / UNICEF / IDA)
   - `api_last_sync` (Datetime, read-only)

4. **Statut**
   - `statut` (Select: Actif / Inactif, default Actif)

### Naming

- **Naming :** `field:gtin` (unique)
- **Title Field :** `nom_commercial`
- **Search Fields :** `gtin,nom_commercial,dci,laboratoire`
- **Show Title in Link Fields :** ☑️

### Permissions

- **Roles :** Pharmacien CH, Pharmacien Responsable CH, System Manager
- **All permissions :** Read, Write, Create, Delete, Report, Export

## 📚 Référence

Voir `SYNTHESE_V2_POLE_CH_PHARMACIE.md` section "DocTypes Pharmacie Paris"
```

---

### Issue #3 : Client Script enrichissement GTIN

**Type :** Feature  
**Labels :** `enhancement`, `priority:critical`, `module:pharmacie`  
**Milestone :** v1.2.0 - Pharmacie Phase 1.1

**Titre :** `[FEATURE] Client Script enrichissement automatique via GTIN`

**Description :**

```markdown
## 🎯 Objectif

Créer le Client Script qui permet :
1. Scanner un code-barre GTIN (mobile + PC)
2. Appeler l'API BDPM France
3. Enrichir automatiquement les champs du médicament
4. Afficher dialog de prévisualisation avant validation

## 📋 Fonctionnalités

### 1. Bouton scanner mobile
- Détection User-Agent mobile
- Bouton 📷 après champ `gtin`
- Utilisation `frappe.ui.Scanner`

### 2. Recherche auto sur ENTER
- Événement `gtin` (change)
- Appel API BDPM via `frappe.call`

### 3. Enrichissement auto
- Mapping GTIN → CIP → CIS
- Remplissage automatique :
  - `nom_commercial`
  - `dci`
  - `forme_pharmaceutique`
  - `laboratoire`
  - `bdpm_cis`
  - Classification ATC (via table de correspondance DCI → ATC)

### 4. Dialog prévisualisation
- Affichage données trouvées
- Bouton "Valider" → Remplit les champs
- Bouton "Annuler" → Conserve manuel

## 📚 Référence

- Similaire à : `article_epicerie_api_integration.js` (Épicerie)
- Voir `SYNTHESE_V2_POLE_CH_PHARMACIE.md` section "Client Scripts"
- API BDPM : https://base-donnees-publique.medicaments.gouv.fr/
```

---

### Issue #4 : Intégration API BDPM France

**Type :** Feature  
**Labels :** `enhancement`, `priority:high`, `module:pharmacie`, `technical-debt`  
**Milestone :** v1.2.0 - Pharmacie Phase 1.1

**Titre :** `[FEATURE] Intégration API BDPM France (ANSM)`

**Description :**

```markdown
## 🎯 Objectif

Intégrer l'API BDPM France (Base de Données Publique des Médicaments) pour enrichissement automatique.

## 📋 Spécifications

### API BDPM

**URL :** https://base-donnees-publique.medicaments.gouv.fr/  
**Type :** Base publique gratuite France  
**Format :** CSV téléchargeables + possibilité scraping  

### Workflow

1. **Input :** GTIN (code-barre)
2. **Recherche CIP** (Code Identifiant Présentation)
3. **CIP → CIS** (Code Identifiant Spécialité)
4. **CIS → Données complètes**

### Données à récupérer

- Nom commercial
- DCI (Dénomination Commune Internationale)
- Forme pharmaceutique
- Laboratoire (titulaire AMM)
- Conditionnement
- Statut AMM

### Implémentation

**Option 1 : Server Script Python**
- Endpoint custom `/api/method/pharmacie.get_medicament_bdpm`
- Cache Redis pour performance
- Gestion erreurs HTTP

**Option 2 : Client Script JS**
- Appel direct BDPM (si CORS OK)
- Fallback sur Server Script

## 📚 Ressources

- BDPM Datasets : https://base-donnees-publique.medicaments.gouv.fr/telechargement.php
- Documentation BDPM : (à rechercher)

## 📝 Notes

- Prévoir gestion cas "médicament non trouvé"
- Prévoir fallback manuel si API down
- Cache les résultats pour éviter appels répétés
```

---

### Issue #5 : Import base initiale médicaments OMS

**Type :** Feature  
**Labels :** `enhancement`, `priority:medium`, `module:pharmacie`  
**Milestone :** v1.2.0 - Pharmacie Phase 1.1

**Titre :** `[FEATURE] Import base initiale Liste Essentielle OMS`

**Description :**

```markdown
## 🎯 Objectif

Importer une base initiale de médicaments depuis la **Liste Modèle OMS des Médicaments Essentiels** pour avoir un référentiel de départ.

## 📋 Source

**WHO Essential Medicines List (EML)**
- URL : https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines/essential-medicines-lists
- Format : PDF + Excel disponibles
- ~500 médicaments essentiels

## 📊 Process

1. **Télécharger** la liste OMS (Excel si possible)
2. **Nettoyer** les données (DCI, forme, dosage)
3. **Créer fichier import** compatible Data Import Tool Frappe
4. **Mapper colonnes** :
   - INN Name → `dci`
   - Pharmaceutical form → `forme_pharmaceutique`
   - Strength → `dosage`
   - WHO flag → `who_essential_medicine` (True)
5. **Importer** via Data Import Tool

## 📝 Champs à remplir

- `dci` (requis)
- `forme_pharmaceutique`
- `dosage`
- `who_essential_medicine` = True
- `statut` = Actif
- `api_source` = Manual

## 🎯 Résultat attendu

- Base de ~500 médicaments essentiels
- Permettra recherche par DCI même sans GTIN
- Base pour tests Phase 1.2 (Réceptions)

## 📚 Référence

- Liste OMS : https://list.essentialmeds.org/
```

---

### Issue #6 : Documentation Medicament

**Type :** Documentation  
**Labels :** `documentation`, `priority:medium`, `module:pharmacie`  
**Milestone :** v1.2.0 - Pharmacie Phase 1.1

**Titre :** `[DOC] Documentation utilisateur DocType Medicament`

**Description :**

```markdown
## 🎯 Objectif

Créer la documentation utilisateur pour le DocType **Medicament** à destination des pharmaciens.

## 📋 Contenu

### 1. Guide rapide

- Comment ajouter un nouveau médicament
- Comment scanner un code-barre
- Comment rechercher un médicament existant

### 2. Guide détaillé

- Explication champs obligatoires vs optionnels
- Classification ATC/OMS expliquée
- Enrichissement automatique BDPM
- Cas particuliers (médicament non trouvé)

### 3. FAQ

- Que faire si GTIN non reconnu ?
- Comment modifier un médicament existant ?
- Différence entre GTIN, CIP, CIS, DCI ?

## 📁 Emplacement

`/docs/utilisateur/pharmacie/medicament.md`

## 📸 Captures d'écran

- Formulaire vide
- Scan code-barre mobile
- Dialog enrichissement
- Formulaire rempli automatiquement
```

---

## 📊 RÉSUMÉ PHASE 1.1

| # | Issue | Type | Priorité | Statut |
|---|-------|------|----------|--------|
| 1 | Valider 5 questions | Question | High | À créer |
| 2 | DocType Medicament | Feature | Critical | À créer |
| 3 | Client Script GTIN | Feature | Critical | À créer |
| 4 | API BDPM France | Feature | High | À créer |
| 5 | Import base OMS | Feature | Medium | À créer |
| 6 | Documentation | Doc | Medium | À créer |

---

## 🚀 ORDRE DE RÉALISATION RECOMMANDÉ

1. **Issue #1** (Valider questions) → Bloquant avant tout
2. **Issue #2** (DocType Medicament) → Base technique
3. **Issue #4** (API BDPM) → Nécessaire pour script enrichissement
4. **Issue #3** (Client Script) → Utilise DocType + API
5. **Issue #5** (Import OMS) → Base de données initiale
6. **Issue #6** (Documentation) → Une fois tout fonctionnel

---

## 📝 NOTES

Une fois ces issues créées sur GitHub :
1. Les assigner au **Milestone** `v1.2.0 - Pharmacie Phase 1.1`
2. Les ajouter au **Project Board** "Pharmacie Paris - Phase 1"
3. Commencer par l'issue #1 (questions)
4. Puis développer dans l'ordre recommandé

---

**Prêt à créer ces issues sur GitHub ! 🚀**
