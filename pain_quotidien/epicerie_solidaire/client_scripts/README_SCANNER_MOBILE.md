# 📱 SCANNER MOBILE - BOUTONS CAMÉRA

**Date de mise à jour** : 08/01/2026

---

## 🎯 OBJECTIF

Ajouter des gros boutons 📷 Scanner sur mobile pour faciliter la saisie des codes-barres sans que le clavier ne masque les boutons.

---

## ✅ SCRIPTS IMPLÉMENTÉS

### 1️⃣ **Article Epicerie - API Integration** ✅

**Fichier** : `article_epicerie_api_integration.js`  
**DocType** : Article Epicerie  
**Position bouton** : Après le champ "famille"

**Fonctionnalités** :
- ✅ Bouton scanner 📷 sur mobile uniquement
- ✅ Désactivation autofocus clavier
- ✅ Recherche Open Food Facts / Open Products Facts
- ✅ Recherche prix Open Price
- ✅ Détection doublons code-barre
- ✅ Mapping automatique catégories

**Workflow** :
1. Utilisateur crée un nouvel Article Epicerie sur mobile
2. Bouton 📷 Scanner apparaît après le champ "famille"
3. Clic → Scanner caméra s'ouvre
4. Scan → Recherche automatique dans les APIs
5. Dialog de prévisualisation → Utilisateur valide

---

### 2️⃣ **Reception Don - Scanner** ✅

**Fichier** : `reception_don_scanner.js`  
**DocType** : Reception Don  
**Position bouton** : Avant le champ "scan_code_barre"

**Fonctionnalités** :
- ✅ Bouton scanner 📷 sur mobile uniquement
- ✅ Désactivation autofocus clavier
- ✅ Simulation ENTER pour déclencher logique existante

**Workflow** :
1. Utilisateur crée une Reception Don sur mobile
2. Bouton 📷 Scanner apparaît avant le champ "scan_code_barre"
3. Clic → Scanner caméra s'ouvre
4. Scan → Champ "scan_code_barre" rempli automatiquement
5. ENTER simulé → Logique de recherche article s'exécute (ajout à la child table)

---

### 3️⃣ **Distribution Don - Scanner** ✅

**Fichier** : `distribution_don_scanner.js`  
**DocType** : Distribution Don  
**Position bouton** : Avant le champ "scan_code_barre"

**Fonctionnalités** :
- ✅ Bouton scanner 📷 sur mobile uniquement
- ✅ Désactivation autofocus clavier
- ✅ Simulation ENTER pour déclencher logique existante

**Workflow** :
1. Utilisateur crée une Distribution Don sur mobile
2. Bouton 📷 Scanner apparaît avant le champ "scan_code_barre"
3. Clic → Scanner caméra s'ouvre
4. Scan → Champ "scan_code_barre" rempli automatiquement
5. ENTER simulé → Logique de recherche article s'exécute (ajout à la child table)

---

## 🔧 DÉTAILS TECHNIQUES

### Détection Mobile

```javascript
function is_mobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

### Désactivation Autofocus Clavier

**Problème** : Le clavier mobile s'ouvre automatiquement et masque le bouton scanner.

**Solution** : Retirer le focus du champ après 100ms.

```javascript
if (is_mobile()) {
    setTimeout(function() {
        if (frm.fields_dict.code_barre && frm.fields_dict.code_barre.$input) {
            frm.fields_dict.code_barre.$input.blur();
        }
    }, 100);
}
```

### Style Bouton Mobile

**Design touch-friendly** :
- Pleine largeur (`btn-block`)
- Gros padding (15px)
- Grande police (18px)
- Classe `btn-lg` pour taille XL

```html
<button class="btn btn-primary btn-lg btn-block" type="button" style="padding: 15px; font-size: 18px;">
    📷 Scanner code-barre
</button>
```

### Scanner Frappe

Utilisation du scanner natif Frappe :

```javascript
new frappe.ui.Scanner({
    dialog: true,
    multiple: false,
    on_scan(data) {
        frm.set_value('code_barre', data.decodedText);
        // ... traitement
    }
});
```

---

## 📦 INSTALLATION DANS FRAPPE CLOUD

### 1. Article Epicerie (MISE À JOUR)

1. Allez sur : `france.frappe.cloud/app/client-script/Article Epicerie - API Integration`
2. Cliquez sur **"Edit"**
3. Remplacez TOUT le contenu du champ "Script"
4. **Save**

### 2. Reception Don (NOUVEAU)

1. Allez sur : `france.frappe.cloud/app/client-script/new`
2. **Name** : `Reception Don - Scanner Code-Barre`
3. **DocType** : `Reception Don`
4. **Enabled** : ✅
5. Collez le contenu de `reception_don_scanner.js`
6. **Save**

### 3. Distribution Don (NOUVEAU)

1. Allez sur : `france.frappe.cloud/app/client-script/new`
2. **Name** : `Distribution Don - Scanner Code-Barre`
3. **DocType** : `Distribution Don`
4. **Enabled** : ✅
5. Collez le contenu de `distribution_don_scanner.js`
6. **Save**

---

## ✅ TESTS RECOMMANDÉS

### Sur Mobile

- [ ] Article Epicerie : Bouton 📷 apparaît après "famille"
- [ ] Article Epicerie : Scanner fonctionne
- [ ] Article Epicerie : APIs fonctionnent (Open Food Facts, Open Price)
- [ ] Reception Don : Bouton 📷 apparaît avant "scan_code_barre"
- [ ] Reception Don : Scanner ajoute article à la liste
- [ ] Distribution Don : Bouton 📷 apparaît avant "scan_code_barre"
- [ ] Distribution Don : Scanner ajoute article à la liste

### Sur PC

- [ ] Aucun bouton 📷 ne doit apparaître
- [ ] Toutes les fonctionnalités existantes fonctionnent normalement

---

## 🐛 TROUBLESHOOTING

### Le bouton apparaît sur PC

**Problème** : La condition `is_mobile()` ne détecte pas correctement le device.

**Solution** : Vérifier que la condition `if (is_mobile())` est bien présente dans le refresh.

### Le clavier masque toujours le bouton

**Problème** : Le `blur()` ne fonctionne pas.

**Solution** : Augmenter le délai du `setTimeout` (ex: 200ms au lieu de 100ms).

### Le scanner ne s'ouvre pas

**Problème** : Erreur "frappe.ui.Scanner is not defined".

**Solution** : Scanner caméra nécessite HTTPS. Vérifier que vous êtes sur `france.frappe.cloud` (HTTPS).

---

## 📚 RÉFÉRENCES

- [Frappe Scanner Documentation](https://frappeframework.com/docs/user/en/desk/scanner)
- [Frappe Client Scripts](https://frappeframework.com/docs/user/en/desk/client-scripts)

---

**Auteur** : Claude AI  
**Validé par** : Patrick BELLANTI  
**Date** : 08/01/2026
