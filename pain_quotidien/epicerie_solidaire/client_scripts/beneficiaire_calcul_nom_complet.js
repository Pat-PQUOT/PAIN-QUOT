/**
 * Client Script: Beneficiaire Calcul Nom Complet
 * DocType: Beneficiaire Epicerie
 * Description: Calcule automatiquement le champ full_name à partir de nom et prenom
 * Date: 03/01/2026
 */

frappe.ui.form.on('Beneficiaire Epicerie', {
    nom: function(frm) {
        update_full_name(frm);
    },
    
    prenom: function(frm) {
        update_full_name(frm);
    },
    
    onload: function(frm) {
        update_full_name(frm);
    }
});

/**
 * Met à jour le champ full_name en combinant nom (en majuscules) et prénom
 * Format: "NOM Prénom" (ex: "DUPONT Jean")
 */
function update_full_name(frm) {
    if (frm.doc.nom && frm.doc.prenom) {
        let full_name = frm.doc.nom.toUpperCase() + ' ' + frm.doc.prenom;
        frm.set_value('full_name', full_name);
    } else if (frm.doc.nom) {
        frm.set_value('full_name', frm.doc.nom.toUpperCase());
    } else if (frm.doc.prenom) {
        frm.set_value('full_name', frm.doc.prenom);
    }
}
