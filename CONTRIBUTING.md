# 🤝 CONTRIBUTING - Guide de contribution

Bienvenue ! Ce document explique comment contribuer au projet **Le Pain Quotidien - ERPNext**.

---

## 📋 TABLE DES MATIÈRES

1. [Workflow général](#workflow-général)
2. [Créer une issue](#créer-une-issue)
3. [Travailler sur une issue](#travailler-sur-une-issue)
4. [Commits et messages](#commits-et-messages)
5. [Pull Requests](#pull-requests)
6. [Project Board](#project-board)
7. [Conventions de code](#conventions-de-code)

---

## 🔄 WORKFLOW GÉNÉRAL

```
1. DÉCOUVERTE BUG/IDÉE
   ↓
2. CRÉER ISSUE sur GitHub
   ↓
3. DISCUSSION dans l'issue
   ↓
4. ASSIGNATION + Ajout au Project Board
   ↓
5. CRÉER BRANCHE (fix/issue-XX ou feature/nom)
   ↓
6. CODER + COMMITS (référencer #XX)
   ↓
7. PUSH + CRÉER PULL REQUEST
   ↓
8. REVIEW + MERGE
   ↓
9. ISSUE SE FERME AUTOMATIQUEMENT (si "Closes #XX")
```

---

## 📝 CRÉER UNE ISSUE

### Quand créer une issue ?

**✅ CRÉER UNE ISSUE pour :**
- 🐛 Bug ou comportement inattendu
- 💡 Nouvelle fonctionnalité souhaitée
- 📚 Documentation manquante ou incorrecte
- ❓ Question sur le fonctionnement
- 🔧 Refactoring ou amélioration technique

**❌ PAS D'ISSUE pour :**
- Typo mineure (correction directe OK)
- Commit oublié (push direct OK)

### Comment créer une issue ?

1. **Aller sur GitHub.com** → Repo `PAIN-QUOT`
2. **Cliquer sur "Issues"** → **"New issue"**
3. **Choisir le template approprié** :
   - 🐛 Bug Report
   - 💡 Feature Request
   - 📚 Documentation
   - ❓ Question
4. **Remplir le template** (ne pas supprimer les sections)
5. **Ajouter des labels** :
   - Type : `bug`, `enhancement`, etc.
   - Priorité : `priority:high`, etc.
   - Module : `module:epicerie`, `module:pharmacie`, etc.
6. **Assigner à un Milestone** (si connu) : ex. `v1.2.0 - Pharmacie Phase 1.1`
7. **Créer l'issue**

---

## 💻 TRAVAILLER SUR UNE ISSUE

### 1. Vérifier l'issue

- ✅ Issue validée/approuvée ?
- ✅ Specs claires ?
- ✅ Personne d'autre ne travaille dessus ?

**Si OK → Assigner l'issue à toi-même**

### 2. Créer une branche

**Conventions de nommage :**

```bash
# Pour un bug (issue #45)
git checkout -b fix/issue-45
git checkout -b fix/scanner-peremption

# Pour une feature (issue #67)
git checkout -b feature/issue-67
git checkout -b feature/bdpm-enrichissement

# Pour de la doc (issue #89)
git checkout -b docs/issue-89
git checkout -b docs/workflow-pharmacie
```

**Depuis GitHub Desktop :**
1. Menu "Branch" → "New branch"
2. Nom : `fix/issue-45` ou `feature/nom-descriptif`

### 3. Coder

- 📝 Suivre les [conventions de code](#conventions-de-code)
- ✅ Tester localement
- 📸 Faire des captures d'écran si UI

---

## 📤 COMMITS ET MESSAGES

### Format des messages de commit

**Convention : [Conventional Commits](https://www.conventionalcommits.org/)**

```
<type>: <description courte> #<issue-number>

<description détaillée optionnelle>
```

**Types :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage code (pas de changement fonctionnel)
- `refactor`: Refactoring
- `test`: Ajout de tests
- `chore`: Tâches diverses (build, dépendances)

**Exemples :**

```bash
# Bug fix
git commit -m "fix: Scanner péremption ne détecte pas les dates invalides #45"

# Feature
git commit -m "feat: Enrichissement GTIN via API BDPM France #67"

# Documentation
git commit -m "docs: Guide utilisateur scanner mobile Épicerie #89"

# Refactoring
git commit -m "refactor: Optimisation requêtes SQL liste médicaments #102"
```

**❗ IMPORTANT : Toujours référencer le numéro d'issue avec `#XX`**

---

## 🔀 PULL REQUESTS

### Quand créer une Pull Request ?

- ✅ Branche poussée sur GitHub
- ✅ Code testé localement
- ✅ Commits propres et bien nommés

### Comment créer une PR ?

1. **Push ta branche** :
   ```bash
   git push origin fix/issue-45
   ```

2. **Sur GitHub.com** → Repo `PAIN-QUOT`
   - Un bandeau apparaît : **"Compare & pull request"** → Cliquer

3. **Remplir la PR** :
   - **Titre** : Reprise du titre de l'issue ou description courte
   - **Description** : Expliquer ce qui a été fait
   - **Lier à l'issue** : Écrire `Closes #45` dans la description
     - ✨ Magic : L'issue se fermera automatiquement au merge !

4. **Ajouter reviewers** (si pertinent)

5. **Créer la Pull Request**

### Template de description PR

```markdown
## 🎯 Objectif

Correction du bug de détection de péremption dans le scanner Pharmacie.

## 🔗 Issue liée

Closes #45

## 📋 Changements effectués

- Ajout validation format date (YYYY-MM-DD, DD/MM/YYYY)
- Ajout alerte visuelle si date < aujourd'hui
- Correction calcul jours avant péremption

## ✅ Tests effectués

- [x] Test avec date valide
- [x] Test avec date invalide
- [x] Test avec date périmée
- [x] Test sur mobile (Android)

## 📸 Captures d'écran

(Si applicable)
```

---

## 📊 PROJECT BOARD

### Structure du Board

```
📥 Backlog → 📋 To Do → 🔨 In Progress → 👀 Review → ✅ Done
```

### Comment déplacer une issue ?

**Sur GitHub.com** → **Projects** → **Pharmacie Phase 1** (par exemple)

- **Drag & drop** l'issue entre les colonnes
- Ou **via l'issue** : Section "Projects" → Changer le statut

### Colonnes expliquées

| Colonne | Description |
|---------|-------------|
| **📥 Backlog** | Issues validées mais pas encore planifiées |
| **📋 To Do** | Planifiées pour le prochain sprint/cycle |
| **🔨 In Progress** | En cours de développement (assignées) |
| **👀 Review** | PR créée, en attente de review |
| **✅ Done** | Terminé et mergé |

---

## 💻 CONVENTIONS DE CODE

### Python (Server Scripts)

```python
# Suivre PEP 8
# snake_case pour variables et fonctions
# CamelCase pour classes

def update_stock_pharmacie(doc, method):
    """
    Met à jour le stock lors de la validation d'une réception.
    
    Args:
        doc: Document Reception Pharmacie Paris
        method: Méthode appelée (on_submit)
    """
    for ligne in doc.articles:
        if ligne.medicament and ligne.quantite:
            # Code ici
            pass
```

### JavaScript (Client Scripts)

```javascript
// Utiliser const/let (pas var)
// camelCase pour variables et fonctions
// PascalCase pour classes

frappe.ui.form.on('Medicament', {
    refresh: function(frm) {
        // Code ici
    },
    
    gtin: function(frm) {
        // Code ici
    }
});
```

### Fichiers

```
# Nommage fichiers Python
reception_pharmacie_stock_update.py

# Nommage fichiers JavaScript
medicament_enrichissement_gtin.js

# Nommage DocTypes
Medicament (PascalCase, sans espaces internes si possible)
Reception Pharmacie Paris (espaces OK pour lisibilité)
```

### Commentaires

```python
# Commentaires en FRANÇAIS
# Expliquer le POURQUOI, pas le QUOI

# ❌ MAL
x = x + 1  # Incrémente x

# ✅ BIEN
x = x + 1  # Passe à la ligne suivante du lot FIFO
```

---

## 🎯 CHECKLIST AVANT DE MERGER

- [ ] Code testé localement
- [ ] Pas de console.log/print() oubliés
- [ ] Documentation mise à jour (si nouveau feature)
- [ ] CHANGELOG.md mis à jour (si changement user-facing)
- [ ] Issue liée avec `Closes #XX` dans la PR
- [ ] Branche à jour avec `main`

---

## 📚 RESSOURCES

- [Documentation Frappe](https://docs.frappe.io/)
- [Documentation ERPNext](https://docs.erpnext.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Synthèse projet](SYNTHESE_V2_POLE_CH_PHARMACIE.md)

---

## ❓ QUESTIONS ?

Créer une issue avec le template **❓ Question** !

---

**Merci de contribuer au projet Le Pain Quotidien ! 🙏**
