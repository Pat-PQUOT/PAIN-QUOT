/**
 * Client Script pour Distribution Don - Scanner Code-Barre (MOBILE UNIQUEMENT)
 * 
 * Fonctionnalités :
 * - Bouton scanner caméra 📷 sur mobile (avant champ scan_code_barre)
 * - Désactivation autofocus clavier mobile
 * - Simulation ENTER pour déclencher logique existante
 * - Gros bouton touch-friendly
 * 
 * Workflow :
 * 1. Utilisateur clique sur bouton 📷
 * 2. Scanner s'ouvre
 * 3. Code-barre rempli automatiquement
 * 4. ENTER simulé → Logique de recherche article s'exécute
 * 
 * Dernière mise à jour : 08/01/2026
 */

frappe.ui.form.on('Distribution Don', {
    refresh: function(frm) {
        // UNIQUEMENT SUR MOBILE
        if (is_mobile()) {
            // Ajouter le bouton scanner
            add_scanner_button_in_form(frm);
            
            // Retirer le focus du champ scan_code_barre
            setTimeout(function() {
                if (frm.fields_dict.scan_code_barre && frm.fields_dict.scan_code_barre.$input) {
                    frm.fields_dict.scan_code_barre.$input.blur();
                }
            }, 100);
        }
    }
});

/**
 * Détecte si on est sur mobile
 */
function is_mobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Ajoute le bouton scanner juste avant le champ scan_code_barre
 */
function add_scanner_button_in_form(frm) {
    // Vérifier si le bouton existe déjà
    if ($('#custom_scan_barcode_btn_distribution').length > 0) {
        return;
    }
    
    // Trouver le champ scan_code_barre
    let scan_field = frm.fields_dict.scan_code_barre;
    if (!scan_field || !scan_field.wrapper) {
        console.log('Champ scan_code_barre non trouvé');
        return;
    }
    
    // Créer le bouton HTML
    let button_html = `
        <div class="form-group" id="custom_scan_barcode_btn_distribution" style="margin-top: 10px; margin-bottom: 10px;">
            <div class="clearfix">
                <label class="control-label" style="padding-right: 0px;"></label>
            </div>
            <button class="btn btn-primary btn-lg btn-block" type="button" style="padding: 15px; font-size: 18px;">
                📷 Scanner code-barre
            </button>
        </div>
    `;
    
    // Insérer AVANT le champ scan_code_barre
    $(scan_field.wrapper).before(button_html);
    
    // Attacher l'événement click
    $('#custom_scan_barcode_btn_distribution button').on('click', function() {
        scan_barcode_with_camera(frm);
    });
}

/**
 * Lance le scanner caméra
 */
function scan_barcode_with_camera(frm) {
    try {
        new frappe.ui.Scanner({
            dialog: true,
            multiple: false,
            on_scan(data) {
                // Remplir le champ scan_code_barre
                frm.set_value('scan_code_barre', data.decodedText);
                
                // Simuler ENTER pour déclencher la logique existante
                setTimeout(function() {
                    if (frm.fields_dict.scan_code_barre && frm.fields_dict.scan_code_barre.$input) {
                        let event = $.Event('keypress');
                        event.which = 13;
                        event.keyCode = 13;
                        frm.fields_dict.scan_code_barre.$input.trigger(event);
                    }
                }, 100);
            }
        });
    } catch(e) {
        frappe.msgprint({
            title: 'Erreur Scanner',
            indicator: 'red',
            message: 'Erreur: ' + e.message
        });
    }
}
