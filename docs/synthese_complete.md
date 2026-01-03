# SYNTHÈSE PROJET ÉPICERIE SOLIDAIRE - PAIN QUOTIDIEN
## Mise à jour : 03/01/2026 - 18h00

---

**📖 NOTE** : Ceci est la version complète et détaillée de la synthèse du projet.  
Pour le README utilisateur, voir `/README.md` à la racine du projet.

---

# TABLE DES MATIÈRES

1. [Architecture Globale](#1-architecture-globale)
2. [Structure des DocTypes](#2-structure-des-doctypes)
3. [Server Scripts](#3-server-scripts)
4. [Permissions & Sécurité](#4-permissions--sécurité)
5. [Workspace Épicerie Solidaire](#5-workspace-épicerie-solidaire)
6. [Catégories d'Articles](#6-catégories-darticles)
7. [Client Scripts](#7-client-scripts)
8. [Property Setters](#8-property-setters)
9. [Branding](#9-branding)
10. [Données Actuelles](#10-données-actuelles)
11. [Limitations Connues](#11-limitations-connues)
12. [Architecture Multi-Départements](#12-architecture-multi-départements)
13. [Serveurs](#13-serveurs)
14. [Prochaines Étapes](#14-prochaines-étapes)
15. [Contacts & Configuration](#15-contacts--configuration)
16. [Historique des Sessions](#16-historique-des-sessions)
17. [Best Practices Découvertes](#17-best-practices-découvertes)

---

# 1. ARCHITECTURE GLOBALE

## 1.1 DocTypes Créés (Module Custom)

| DocType | Type | Description |
|---------|------|-------------|
| Article Epicerie | Master | Catalogue des articles avec stock |
| Beneficiaire Epicerie | Master | Fichier des bénéficiaires |
| Donateur Epicerie | Master | Fichier des donateurs |
| Reception Don | Transaction (Submittable) | Entrées de stock |
| Distribution Don | Transaction (Submittable) | Sorties de stock |
| Ligne Reception Don | Child Table | Lignes de réception |
| Ligne Distribution Don | Child Table | Lignes de distribution |

## 1.2 Flux de Données

```
DONATEUR → RECEPTION DON → STOCK ARTICLES → DISTRIBUTION DON → BENEFICIAIRE
              (+stock)                           (-stock)
```

---

# 2. STRUCTURE DES DOCTYPES

## 2.1 Article Epicerie
**Naming** : `nom_article` (champ Data)

**Champs principaux** :
- nom_article (Data, requis, unique)
- categorie_epicerie (Link → Item Group, filtré sur "Epicerie Solidaire")
- stock_actuel (Float, read-only, défaut 0)
- unite_stock (Data, défaut "Unité")
- poids_kg (Float)
- prix_moyen_eur (Currency EUR, read-only)
- statut (Select: Actif/Inactif, défaut Actif)
- seuil_alerte (Float)
- description (Small Text)

**Champs API** (OpenFoodFacts) :
- code_barre, product_name_api, brands, quantity_text, image_url
- api_source, api_last_sync

**Permissions** : Bénévole Épicerie, System Manager  
**Import** : Activé

## 2.2 Beneficiaire Epicerie ⭐
**Naming** : `format:BEN{####}` (sans tiret - ex: BEN0001, BEN0002...)  
**Title Field** : `full_name`  
**Import** : Activé ✅

**Champs principaux** :
- **Section "Informations de Base"** :
  - nom (Data, requis, in_list_view) ← NOUVEAU 03/01/2026
  - prenom (Data, requis, in_list_view) ← NOUVEAU 03/01/2026
  - full_name (Data, read-only) ← MODIFIÉ : auto-calculé via Client Script
  - nb_personnes_foyer (Int, requis, défaut 1)
  - status (Select: Actif/Inactif)
  - date_inscription (Date, requis, défaut Today)

- **Section "Contact"** :
  - telephone, email, adresse

- **Section "Distributions"** :
  - derniere_distribution (Date, read-only)
  - nombre_distributions (Int, read-only)
  
- **Section "Historique Distributions"** :
  - historique_distributions_html (HTML) → Affiche les 5 dernières distributions

**Client Scripts** :
1. "Beneficiaire Historique Distributions" : Charge et affiche l'historique
2. "Beneficiaire Calcul Nom Complet" ← NOUVEAU 03/01/2026
   - Calcule automatiquement `full_name = nom.toUpperCase() + " " + prenom`
   - Événements : nom (change), prenom (change), onload
   - Exemple : "DUPONT Jean"

## 2.3 Donateur Epicerie
**Naming** : `nom_donateur` (champ Data)  
**Title Field** : `nom_donateur`

**Champs principaux** :
- nom_donateur, type_donateur, nom_contact, email, telephone
- statut, adresse, notes
- dernier_don, nombre_total_dons, valeur_totale_dons, poids_total_dons
- historique_receptions_html (affiche 5 dernières réceptions)

## 2.4 Reception Don (Submittable)
**Naming** : `format:REC-{YYYY}-{#####}`

**Sections** :
- Informations Réception : date, donateur, notes
- Articles Reçus : table des lignes
- Totaux : nombre_articles, poids_total, valeur_totale

**Child Table "Ligne Reception Don"** :
- article, quantite, poids (auto), prix_unitaire (fetch), valeur (auto)

## 2.5 Distribution Don (Submittable)
**Naming** : `format:DIST-{YYYY}-{#####}`

**Sections** :
- Informations Distribution : date, bénéficiaire, notes
- Articles Distribués : table des lignes
- Totaux : nombre_articles, poids_total, valeur_totale

**Child Table "Ligne Distribution Don"** :
- article, quantite, poids (auto), prix_unitaire (fetch), valeur (auto)

---

# 3. SERVER SCRIPTS (Logique Métier)

## 3.1 Stock Reception Don (on_submit)
```python
# Augmente le stock + met à jour statistiques donateur
for ligne in doc.articles:
    article.stock_actuel += ligne.quantite
    
donateur.dernier_don = doc.date_reception
donateur.nombre_total_dons += 1
donateur.valeur_totale_dons += doc.valeur_totale
donateur.poids_total_dons += doc.poids_total
```

## 3.2 Stock Reception Don (on_cancel)
```python
# Diminue le stock + corrige statistiques donateur
for ligne in doc.articles:
    article.stock_actuel -= ligne.quantite
    
donateur.nombre_total_dons -= 1
# etc.
```

## 3.3 Stock Distribution Don (on_submit)
```python
# Diminue le stock + met à jour statistiques bénéficiaire
for ligne in doc.articles:
    article.stock_actuel -= ligne.quantite
    
beneficiaire.derniere_distribution = doc.date_distribution
beneficiaire.nombre_distributions += 1
```

## 3.4 Stock Distribution Don (on_cancel)
```python
# Restaure le stock + corrige statistiques bénéficiaire
for ligne in doc.articles:
    article.stock_actuel += ligne.quantite
    
beneficiaire.nombre_distributions -= 1
```

**Fichiers** : Voir `/pain_quotidien/epicerie_solidaire/server_scripts/`

---

# 4. PERMISSIONS & SÉCURITÉ

## 4.1 Rôle Créé
**Nom** : "Bénévole Épicerie"  
**Permissions** : Read, Write, Create, Delete, Report, Export, Share, Print, Email

## 4.2 Role Profile
**Nom** : "Bénévole Épicerie"  
Contient le rôle ci-dessus

## 4.3 Module Profile
**Nom** : "Épicerie Solidaire"  
Bloque TOUS les modules sauf "Custom"

## 4.4 Permission DocType "Page"
Permission "read" ajoutée pour "Bénévole Épicerie" → nécessaire pour accès Workspace

## 4.5 Configuration Utilisateur (epicerie@painquotidien.org)
- Module Profile : Épicerie Solidaire
- Role Profile : Bénévole Épicerie
- Default Workspace : Épicerie Solidaire
- Voit uniquement le Workspace "Épicerie Solidaire"

## 4.6 SSO Office 365
Fonctionnel pour @painquotidien.org

---

# 5. WORKSPACE ÉPICERIE SOLIDAIRE

## 5.1 Configuration
- Module : Custom
- Public : Oui

## 5.2 Structure des Raccourcis ⭐

```
📊 GRAPHIQUES
└── [Poids Distribué par Mois] → Dashboard Chart

Section "Gestion Bénéficiaires & Distributions"
├── [Bénéficiaires] (19) → Beneficiaire Epicerie List (Bleu)
└── [Distributions] (0) → Distribution Don List (Violet)

Section "Gestion Donateurs & Réceptions"
├── [Donateurs] (0) → Donateur Epicerie List (Bleu)
└── [Réceptions Dons] (0) → Reception Don List (Orange)

Section "Stock & Articles"
├── [Articles Épicerie] (0) → Tous les articles (Gris)
├── [Articles en Stock] (0) → stock_actuel > 0 (Vert) ← NOUVEAU 03/01
└── [Stock Faible] (0) → 0 < stock_actuel < 3 (Orange) ← NOUVEAU 03/01
```

## 5.3 Dashboard Charts ⭐

**Nom** : "Distributions - Poids par Mois"  
**Type** : Line Chart  
**Configuration** :
- DocType : Distribution Don
- Type : Sum
- Champ : poids_total
- Basé sur : date_distribution
- Filtre : docstatus = 1 (validées uniquement)
- Période : Last Year
- Intervalle : Monthly
- Couleur : Bleu (#5E64FF)

---

# 6. CATÉGORIES D'ARTICLES (Item Groups)

```
All Item Groups
└── Epicerie Solidaire
    ├── Alimentaire
    │   ├── Fruits et Légumes
    │   ├── Produits Laitiers
    │   ├── Viandes et Poissons
    │   ├── Boulangerie
    │   ├── Épicerie Sèche
    │   ├── Conserves
    │   ├── Surgelés
    │   ├── Boissons
    │   ├── Petit Déjeuner
    │   ├── Condiments
    │   ├── Snacks
    │   ├── Plats Préparés
    │   └── Autres Alimentaire
    └── Non Alimentaire
        ├── Hygiène
        ├── Entretien
        ├── Bébé
        └── Autres Non Alimentaire
```

---

# 7. CLIENT SCRIPTS

## Scripts Existants
1. **Reception Don Calculs** : Calculs automatiques (poids, valeur, totaux)
2. **Distribution Don Calculs** : Idem
3. **Beneficiaire Historique** : Affiche 5 dernières distributions
4. **Donateur Historique** : Affiche 5 dernières réceptions
5. **Article Epicerie List Settings** : hide_name_column
6. **Beneficiaire Calcul Nom Complet** ⭐ NOUVEAU 03/01/2026

**Fichiers** : Voir `/pain_quotidien/epicerie_solidaire/client_scripts/`

---

# 10. DONNÉES ACTUELLES

## État au 03/01/2026 - 18h00

| DocType | Nombre | Statut |
|---------|--------|--------|
| Beneficiaire Epicerie | 19 | ✅ Production |
| Distribution Don | 0 | 🆕 Prêt |
| Reception Don | 0 | 🆕 Prêt |
| Donateur Epicerie | 0 | 🆕 Prêt |
| Article Epicerie | 0 | 🆕 Prêt |

## Bénéficiaires Importés (03/01/2026)
- Total : 19 bénéficiaires
- Avec téléphone : 15
- Avec email : 1
- À compléter (nb_personnes_foyer = 0) : 3

---

# 11. LIMITATIONS CONNUES

## 11.1 ListView - Largeur Colonnes
Pas de contrôle natif sur largeurs colonnes

## 11.2 Customize Form - DocTypes Custom
Customize Form ne fonctionne que pour DocTypes standard

## 11.3 Import en Masse & Client Scripts ⚠️
Les Client Scripts ne s'exécutent PAS lors d'imports masse  
**Solution** : Pré-calculer champs dans Excel

## 11.4 Raccourcis Workspace & Cache ⚠️
Raccourcis créés via API nécessitent positionnement manuel via drag & drop  
Compteurs nécessitent parfois "Clear Filters"

---

# 13. SERVEURS

| Serveur | URL | Usage |
|---------|-----|-------|
| Production | france.frappe.cloud | Serveur principal - EN PRODUCTION |
| Test | erp.anesys.fr | Tests et entraînement |

---

# 14. PROCHAINES ÉTAPES

## Court terme
- [✅] Import bénéficiaires
- [✅] Dashboard graphique distributions
- [ ] Créer premiers donateurs et articles
- [ ] Première réception de dons
- [ ] Première distribution

## Moyen terme
- [ ] Alertes stock bas
- [ ] Gestion dates expiration (DLC) + FIFO
- [ ] Rapports supplémentaires

## Long terme
- [ ] Département Pharmacie Solidaire
- [ ] Rapports personnalisés

---

# 16. HISTORIQUE DES SESSIONS

## Session 03/01/2026 - Mise en Production ⭐
**Durée** : 10h30-18h00

**Réalisations** :
1. ✅ Nettoyage données test
2. ✅ Restructuration Beneficiaire Epicerie (nom/prenom, naming BEN####)
3. ✅ Import 19 bénéficiaires réels
4. ✅ Dashboard Chart "Poids par Mois"
5. ✅ Raccourcis filtrés (Articles en Stock, Stock Faible)
6. ✅ Personnalisation couleurs compteurs

---

# 17. BEST PRACTICES DÉCOUVERTES

## 17.1 Naming des Bénéficiaires
✅ **Retenu** : `format:BEN{####}` (sans tiret)  
**Avantages** : ID stable, modification nom possible, standard ERPNext

❌ **Rejeté** : `field:full_name` (doublons, modification impossible)

## 17.2 Champs Séparés vs Champ Unique
✅ **Retenu** : nom + prenom séparés + full_name auto-calculé  
**Avantages** : Tri, recherche, import, personnalisation

## 17.3 Import en Masse
⚠️ **Leçon** : Client Scripts ne s'exécutent pas pendant Data Import  
✅ **Solution** : Pré-calculer champs dans Excel

## 17.4 Workspace - Ajout d'Éléments
**Méthode** :
1. Mode "Modifier"
2. Survoler à gauche → "+" apparaît
3. Ajouter élément (drag & drop)
4. Sauvegarder

## 17.5 Compteurs des Raccourcis
**Solution** : Éditer raccourci → Clear Filters → Sauvegarder

---

*Dernière mise à jour : 03/01/2026 18:00*  
*Session : Import bénéficiaires, Dashboard, Raccourcis filtrés, Mise en production*
