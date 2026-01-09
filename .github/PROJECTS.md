# 📊 PROJECT BOARD - Guide de mise en place

Ce fichier explique comment créer et configurer les Project Boards sur GitHub.

---

## 🎯 PROJECTS RECOMMANDÉS

### 1️⃣ Pharmacie Paris - Phase 1 (PRIORITAIRE)

**Colonnes :**
```
📥 Backlog → 📋 To Do → 🔨 In Progress → 👀 Review → ✅ Done
```

**Scope :** Toutes les issues pour Pharmacie Paris Phase 1.1 à 1.5

### 2️⃣ Épicerie Solidaire - Maintenance

**Colonnes :**
```
📥 Backlog → 📋 To Do → 🔨 In Progress → ✅ Done
```

**Scope :** Bugs, améliorations, maintenance Épicerie

### 3️⃣ Roadmap Globale (optionnel)

**Vue timeline des milestones :**
- v1.2.0 - Pharmacie Phase 1.1
- v1.3.0 - Pharmacie Phase 1.2
- v2.0.0 - Pôle Soutien
- etc.

---

## 🔧 CRÉER UN PROJECT BOARD

### Sur GitHub.com

1. **Aller sur le repo** `PAIN-QUOT`
2. **Cliquer sur "Projects"** (onglet en haut)
3. **Cliquer sur "New project"**
4. **Choisir un template** :
   - **"Board"** (recommandé) → Vue Kanban avec colonnes
   - **"Table"** → Vue tableau type spreadsheet
   - **"Roadmap"** → Vue timeline
5. **Nommer le projet** : "Pharmacie Paris - Phase 1"
6. **Créer**

### Configurer les colonnes (Board)

**Par défaut, GitHub crée :**
- Todo
- In Progress
- Done

**Pour ajouter des colonnes :**
1. Cliquer sur **"+ New column"**
2. Nommer : `Backlog`, `Review`, etc.
3. **Ordre recommandé (de gauche à droite) :**
   - 📥 Backlog
   - 📋 To Do
   - 🔨 In Progress
   - 👀 Review
   - ✅ Done

**Pour renommer une colonne :**
1. Cliquer sur **"..."** sur la colonne
2. **"Rename"**
3. Ajouter un emoji au début : `📥 Backlog`

### Ajouter des issues au board

**Méthode 1 : Depuis le board**
1. Cliquer sur **"+ Add item"** dans une colonne
2. Taper `#` → Liste des issues apparaît
3. Sélectionner l'issue

**Méthode 2 : Depuis l'issue**
1. Ouvrir l'issue
2. Section **"Projects"** à droite
3. Sélectionner le project
4. Choisir la colonne (statut)

---

## 🎨 PERSONNALISATION (OPTIONNEL)

### Filtres

**Exemples de vues filtrées :**
- Vue "Mes issues" : Assigné à moi
- Vue "Bugs critiques" : Label `bug` + `priority:critical`
- Vue "Pharmacie" : Label `module:pharmacie`

**Pour créer une vue filtrée :**
1. Dans le project board → **"..."** en haut
2. **"New view"**
3. Configurer les filtres
4. Sauvegarder

### Automatisations (GitHub Actions - avancé)

GitHub peut automatiquement :
- Déplacer issue en "In Progress" quand branche créée
- Déplacer en "Review" quand PR créée
- Déplacer en "Done" quand PR mergée

**Configuration :** Settings du project → Workflows

---

## 📋 WORKFLOW TYPIQUE

### Issue créée (#45)

```
1. Issue apparaît dans "Backlog" automatiquement
   (ou ajouter manuellement)

2. Pendant planification → Drag & drop vers "To Do"

3. Quand on commence → Drag & drop vers "In Progress"
   + S'assigner l'issue

4. Quand PR créée → Drag & drop vers "Review"

5. Quand PR mergée → GitHub déplace automatiquement vers "Done"
   (si "Closes #45" dans la PR)
```

---

## 📊 VUES RECOMMANDÉES

### Board (Kanban) - VUE PRINCIPALE

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ 📥 Backlog  │ 📋 To Do    │ 🔨 In Prog  │ 👀 Review   │ ✅ Done     │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Issue #50   │ Issue #45   │ Issue #42   │ Issue #40   │ Issue #38   │
│ Issue #51   │ Issue #46   │ (assignée)  │ (PR #41)    │ Issue #37   │
│ Issue #52   │             │             │             │ Issue #36   │
│             │             │             │             │ ...         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Table - VUE DÉTAILS

Colonnes utiles :
- Title
- Status (colonne)
- Assignee
- Priority (label)
- Module (label)
- Milestone

### Roadmap - VUE TIMELINE

Utile pour voir les milestones sur un calendrier.

---

## 🎯 EXEMPLES DE PROJECTS

### Exemple 1 : Pharmacie Paris - Phase 1

**Description :** Développement complet Pharmacie Paris (Phases 1.1 à 1.5)

**Milestones inclus :**
- v1.2.0 - Phase 1.1 (Référentiel)
- v1.3.0 - Phase 1.2 (Réceptions)
- v1.4.0 - Phase 1.3 (Envois)
- v1.5.0 - Phase 1.4 (Alertes)
- v1.6.0 - Phase 1.5 (Production)

**Colonnes :**
- 📥 Backlog (tout ce qui est identifié mais pas encore planifié)
- 📋 To Do (planifié pour le cycle actuel)
- 🔨 In Progress (en cours)
- 👀 Review (PR créée)
- ✅ Done (terminé)

### Exemple 2 : Épicerie Solidaire - Maintenance

**Description :** Bugs, améliorations, maintenance Épicerie (v1.x.x)

**Colonnes simplifiées :**
- 📋 To Do
- 🔨 In Progress
- ✅ Done

---

## 📝 NOTES

- **Un project peut contenir des issues de plusieurs milestones**
- **Une issue peut être dans plusieurs projects** (rare, mais possible)
- **Les colonnes sont flexibles** - adapter selon vos besoins
- **Commencer simple** (3-4 colonnes) et ajouter si besoin

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Créer le project "Pharmacie Paris - Phase 1"
2. ✅ Configurer les colonnes
3. ✅ Créer les premières issues (voir `FIRST_ISSUES.md`)
4. ✅ Ajouter les issues au project board
5. ✅ Commencer à coder ! 🎉

---

**Happy Project Management ! 📊✨**
