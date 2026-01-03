@echo off
REM Script de commit GitHub pour Pain Quotidien
REM Date: 03/01/2026 - Mise en production v1.0.0

cd "C:\Users\PatrickBELLANTI(adig\OneDrive - PAIN QUOTIDIEN\Projets\ERP\Dev\GitHub\PAIN-QUOT"

echo ============================================
echo   PAIN QUOTIDIEN - Commit GitHub v1.0.0
echo ============================================
echo.

echo [1/4] Verification du statut Git...
git status
echo.

echo [2/4] Ajout des fichiers au staging...
git add docs/synthese_complete.md
git add README.md
git add CHANGELOG.md
git add .gitignore
git add pain_quotidien/epicerie_solidaire/client_scripts/beneficiaire_calcul_nom_complet.js
echo   + docs/synthese_complete.md
echo   + README.md
echo   + CHANGELOG.md
echo   + .gitignore
echo   + beneficiaire_calcul_nom_complet.js
echo.

echo [3/4] Commit des modifications...
git commit -m "feat: Mise en production v1.0.0 - 03/01/2026

PRODUCTION RELEASE
- 19 beneficiaires importes et actifs
- Dashboard operationnel avec graphiques
- Workspace personnalise complet
- Systeme de stock fonctionnel

Added:
- Client Script: beneficiaire_calcul_nom_complet.js (auto-calcul full_name)
- Documentation: /docs/synthese_complete.md (synthese technique complete)
- README.md enrichi avec documentation detaillee
- CHANGELOG.md pour suivi des versions
- .gitignore pour le projet
- Dashboard Chart: Poids Distribue par Mois (graphique lineaire)
- Raccourcis filtres Workspace:
  * Articles en Stock (Vert, stock > 0)
  * Stock Faible (Orange, 0 < stock < 3)

Changed:
- BREAKING CHANGE: Restructuration Beneficiaire Epicerie
  * Nouveau naming: BEN#### (sans tiret, ex: BEN0001)
  * Champs nom/prenom separes
  * full_name devient read-only auto-calcule
  * Format: NOM Prenom (ex: DUPONT Jean)
- Workspace: Correction compteur raccourci Beneficiaires
- Workspace: Personnalisation couleurs compteurs

Removed:
- Toutes les donnees de test (nettoyage complet)
- Raccourci doublon Stock Articles

Status: EN PRODUCTION sur france.frappe.cloud
Beneficiaires actifs: 19
Dashboard: Operationnel"
echo.

echo [4/4] Push vers GitHub...
git push origin main
echo.

echo ============================================
echo   Commit termine avec succes!
echo ============================================
echo.
echo Version: v1.0.0
echo Date: 03/01/2026
echo Statut: EN PRODUCTION
echo.
pause
