/**
 * Client Script: Reception Don - Scan Rapide v2
 * DocType: Reception Don
 * Description: Scan automatique optimisé + option quantité multiple
 * Date: 04/01/2026
 * 
 * WORKFLOW:
 * 1. Scan simple → Auto-ajout qté 1 (ou +1)
 * 2. Bouton "Scan avec Quantité" → Dialog pour volumes
 * 3. Article inexistant → Dialog création APIs
 */

frappe.ui.form.on('Reception Don', {
    
    refresh: function(frm) {
        calculate_totals(frm);
        remove_empty_rows(frm);
        setup_barcode_scanner(frm);
        
        // Bouton "Scan avec Quantité" si doc non validé
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(__('📦 Scan avec Quantité'), function() {
                open_quantity_scan_dialog(frm);
            });
        }
    },
    
    validate: function(frm) {
        calculate_totals(frm);
        remove_empty_rows(frm);
    }
});


// ========== SETUP SCANNER ==========

function setup_barcode_scanner(frm) {
    let $input = frm.fields_dict.scan_code_barre.$input;
    $input.off('keypress.barcode');
    
    $input.on('keypress.barcode', function(e) {
        if (e.which === 13) { // Touche Entrée
            e.preventDefault();
            let barcode = frm.doc.scan_code_barre;
            
            if (barcode && barcode.trim().length >= 8) {
                process_barcode_scan(frm, barcode.trim(), 1, false); // Qté 1, pas de dialog
            } else if (barcode && barcode.trim().length > 0) {
                frappe.show_alert({
                    message: __('Code-barre trop court (min 8 caractères)'),
                    indicator: 'red'
                }, 2);
            }
            
            // Vider et refocus
            frm.set_value('scan_code_barre', '');
            setTimeout(() => {
                $input.focus();
            }, 100);
        }
    });
}


// ========== DIALOG SCAN AVEC QUANTITÉ ==========

function open_quantity_scan_dialog(frm) {
    let d = new frappe.ui.Dialog({
        title: __('📦 Scan avec Quantité'),
        fields: [
            {
                fieldname: 'code_barre',
                fieldtype: 'Data',
                label: __('Code-barre'),
                reqd: 1
            },
            {
                fieldname: 'quantite',
                fieldtype: 'Int',
                label: __('Quantité'),
                reqd: 1,
                default: 1
            }
        ],
        primary_action_label: __('✅ Ajouter'),
        primary_action: function(values) {
            if (values.code_barre && values.quantite > 0) {
                process_barcode_scan(frm, values.code_barre.trim(), values.quantite, true);
                d.hide();
            }
        }
    });
    
    d.show();
    setTimeout(() => {
        d.get_field('code_barre').$input.focus();
    }, 500);
}


// ========== TRAITEMENT DU SCAN ==========

function process_barcode_scan(frm, barcode, quantity, from_dialog) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Article Epicerie',
            filters: { code_barre: barcode },
            fields: ['name', 'nom_article', 'poids_kg', 'prix_moyen_eur', 'statut']
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                // ✅ Article trouvé
                let article = r.message[0];
                
                // Vérifier statut
                if (article.statut === 'Inactif') {
                    frappe.msgprint({
                        title: __('Article inactif'),
                        indicator: 'orange',
                        message: __('L\'article "{0}" est marqué comme inactif.', [article.nom_article])
                    });
                }
                
                // Ajouter ou incrémenter DIRECTEMENT (sans dialog)
                add_or_increment_article(frm, article, quantity);
                
            } else {
                // ❌ Article non trouvé → Appeler APIs
                frappe.show_alert({
                    message: __('Article non trouvé. Recherche dans les APIs...'),
                    indicator: 'orange'
                }, 2);
                
                fetch_from_apis(frm, barcode, quantity);
            }
            
            // Refocus sur champ scan (si pas depuis dialog)
            if (!from_dialog) {
                setTimeout(() => {
                    frm.fields_dict.scan_code_barre.$input.focus();
                }, 100);
            }
        }
    });
}


// ========== AJOUT / INCRÉMENTATION ARTICLE ==========

function add_or_increment_article(frm, article, quantity) {
    // Chercher si l'article est déjà dans la liste
    let found_row = null;
    
    if (frm.doc.articles) {
        for (let row of frm.doc.articles) {
            if (row.article === article.name) {
                found_row = row;
                break;
            }
        }
    }
    
    if (found_row) {
        // ✅ Incrémenter quantité existante
        let old_qty = found_row.quantite || 0;
        found_row.quantite = old_qty + quantity;
        found_row.poids_ligne = (found_row.quantite || 0) * (found_row.poids_unitaire || 0);
        found_row.valeur_ligne = (found_row.quantite || 0) * (found_row.prix_unitaire || 0);
        
        frappe.show_alert({
            message: __('✅ {0} - Quantité: {1}', [article.nom_article, found_row.quantite]),
            indicator: 'green'
        }, 2);
        
    } else {
        // ✅ Ajouter nouvelle ligne
        let row = frm.add_child('articles');
        row.article = article.name;
        row.quantite = quantity;
        row.poids_unitaire = article.poids_kg || 0;
        row.prix_unitaire = article.prix_moyen_eur || 0;
        row.poids_ligne = (article.poids_kg || 0) * quantity;
        row.valeur_ligne = (article.prix_moyen_eur || 0) * quantity;
        
        frappe.show_alert({
            message: __('✅ Ajouté: {0} (x{1})', [article.nom_article, quantity]),
            indicator: 'green'
        }, 2);
    }
    
    frm.refresh_field('articles');
    calculate_totals(frm);
}


// ========== UTILITAIRES ==========

function remove_empty_rows(frm) {
    let has_empty = false;
    (frm.doc.articles || []).forEach((row) => {
        if (!row.article) has_empty = true;
    });
    
    if (has_empty) {
        frm.doc.articles = (frm.doc.articles || []).filter(row => row.article);
        frm.refresh_field('articles');
    }
}


// ========== CALCULS AUTOMATIQUES ==========

frappe.ui.form.on('Ligne Reception Don', {
    article: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.article) {
            frappe.db.get_value('Article Epicerie', row.article, ['poids_kg', 'prix_moyen_eur'])
                .then(r => {
                    if (r && r.message) {
                        frappe.model.set_value(cdt, cdn, 'poids_unitaire', r.message.poids_kg || 0);
                        frappe.model.set_value(cdt, cdn, 'prix_unitaire', r.message.prix_moyen_eur || 0);
                        calculate_row(frm, cdt, cdn);
                    }
                });
        }
    },
    
    quantite: function(frm, cdt, cdn) {
        calculate_row(frm, cdt, cdn);
    },
    
    articles_remove: function(frm) {
        calculate_totals(frm);
    }
});

function calculate_row(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let poids_ligne = (row.quantite || 0) * (row.poids_unitaire || 0);
    let valeur_ligne = (row.quantite || 0) * (row.prix_unitaire || 0);
    frappe.model.set_value(cdt, cdn, 'poids_ligne', poids_ligne);
    frappe.model.set_value(cdt, cdn, 'valeur_ligne', valeur_ligne);
    calculate_totals(frm);
}

function calculate_totals(frm) {
    let total_articles = 0;
    let total_poids = 0;
    let total_valeur = 0;
    
    (frm.doc.articles || []).forEach(row => {
        if (row.article) {
            total_articles += (row.quantite || 0);
            total_poids += (row.poids_ligne || 0);
            total_valeur += (row.valeur_ligne || 0);
        }
    });
    
    frm.set_value('nombre_articles', total_articles);
    frm.set_value('poids_total', total_poids);
    frm.set_value('valeur_totale', total_valeur);
}


// ========== APIs (OpenFoodFacts, OpenProducts, OpenPrice) ==========

async function fetch_from_apis(frm, barcode, quantity) {
    let product_data = {
        code_barre: barcode,
        nom_article: '',
        brands: '',
        poids_kg: 0,
        prix_moyen_eur: 0,
        quantity_text: '',
        image_url: '',
        api_source: 'Manual'
    };
    
    // 1. Open Food Facts
    try {
        let off_response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
        let off_data = await off_response.json();
        
        if (off_data.status === 1 && off_data.product) {
            let p = off_data.product;
            product_data.nom_article = p.product_name_fr || p.product_name || '';
            product_data.brands = p.brands || '';
            product_data.quantity_text = p.quantity || '';
            product_data.image_url = p.image_url || '';
            product_data.api_source = 'OpenFoodFacts';
            
            if (p.product_quantity && p.product_quantity_unit) {
                product_data.poids_kg = normalize_weight(
                    parseFloat(p.product_quantity),
                    p.product_quantity_unit
                );
            }
        }
    } catch(e) {
        console.log('Open Food Facts Error:', e);
    }
    
    // 2. Open Products Facts (si rien trouvé)
    if (!product_data.nom_article) {
        try {
            let opf_response = await fetch(`https://world.openproductsfacts.org/api/v2/product/${barcode}.json`);
            let opf_data = await opf_response.json();
            
            if (opf_data.status === 1 && opf_data.product) {
                let p = opf_data.product;
                product_data.nom_article = p.product_name_fr || p.product_name || '';
                product_data.brands = p.brands || '';
                product_data.quantity_text = p.quantity || '';
                product_data.image_url = p.image_url || '';
                product_data.api_source = 'OpenProductsFacts';
                
                if (p.product_quantity && p.product_quantity_unit) {
                    product_data.poids_kg = normalize_weight(
                        parseFloat(p.product_quantity),
                        p.product_quantity_unit
                    );
                }
            }
        } catch(e) {
            console.log('Open Products Facts Error:', e);
        }
    }
    
    // 3. Open Price
    try {
        let price_response = await fetch(`https://prices.openfoodfacts.org/api/v1/prices?product_code=${barcode}&order_by=-date&size=20`);
        let price_data = await price_response.json();
        
        if (price_data.items && price_data.items.length > 0) {
            let eur_prices = price_data.items
                .filter(item => item.currency === 'EUR' && item.price)
                .map(item => parseFloat(item.price));
            
            if (eur_prices.length > 0) {
                let sum = eur_prices.reduce((a, b) => a + b, 0);
                product_data.prix_moyen_eur = (sum / eur_prices.length).toFixed(2);
            }
        }
    } catch(e) {
        console.log('Open Price Error:', e);
    }
    
    // Afficher dialog de création
    show_create_article_dialog(frm, product_data, quantity);
}

function normalize_weight(quantity, unit) {
    if (!quantity || !unit) return null;
    
    const conversions = {
        'g': 1000, 'kg': 1, 'mg': 1000000,
        'l': 1, 'ml': 1000, 'cl': 100, 'dl': 10
    };
    
    const u = unit.toLowerCase();
    
    if (conversions[u]) {
        return (quantity / conversions[u]).toFixed(3);
    }
    
    return null;
}


// ========== DIALOG CRÉATION ARTICLE ==========

function show_create_article_dialog(frm, data, quantity) {
    let has_data = data.nom_article ? true : false;
    
    let preview_html = has_data ? 
        `<div style="background:#d4edda;padding:15px;border-radius:8px;margin-bottom:15px;">
            <p><strong>Source:</strong> ${data.api_source}</p>
            ${data.image_url ? `<img src="${data.image_url}" style="max-width:100px;max-height:100px;border-radius:4px;">` : ''}
        </div>` : 
        `<div style="background:#fff3cd;padding:15px;border-radius:8px;margin-bottom:15px;">
            <p>⚠️ Produit non trouvé dans les APIs. Saisie manuelle requise.</p>
        </div>`;
    
    let d = new frappe.ui.Dialog({
        title: has_data ? __('📦 Article trouvé - Confirmer') : __('📝 Créer nouvel article'),
        fields: [
            {
                fieldtype: 'HTML',
                options: preview_html
            },
            {
                fieldtype: 'Section Break',
                label: __('Informations Article')
            },
            {
                fieldtype: 'Data',
                fieldname: 'code_barre',
                label: __('Code-Barre'),
                default: data.code_barre,
                read_only: 1
            },
            {
                fieldtype: 'Data',
                fieldname: 'nom_article',
                label: __('Nom Article'),
                default: data.nom_article,
                reqd: 1
            },
            {
                fieldtype: 'Column Break'
            },
            {
                fieldtype: 'Data',
                fieldname: 'brands',
                label: __('Marque'),
                default: data.brands
            },
            {
                fieldtype: 'Data',
                fieldname: 'quantity_text',
                label: __('Contenance'),
                default: data.quantity_text
            },
            {
                fieldtype: 'Section Break',
                label: __('Poids et Prix')
            },
            {
                fieldtype: 'Float',
                fieldname: 'poids_kg',
                label: __('Poids (Kg)'),
                default: data.poids_kg
            },
            {
                fieldtype: 'Column Break'
            },
            {
                fieldtype: 'Currency',
                fieldname: 'prix_moyen_eur',
                label: __('Prix Moyen (EUR)'),
                default: data.prix_moyen_eur
            },
            {
                fieldtype: 'Section Break',
                label: __('Quantité')
            },
            {
                fieldtype: 'Int',
                fieldname: 'quantite',
                label: __('Quantité à recevoir'),
                default: quantity,
                reqd: 1
            }
        ],
        primary_action_label: __('✅ Créer et Ajouter'),
        primary_action: function(values) {
            // Créer l'article
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Article Epicerie',
                        code_barre: values.code_barre,
                        nom_article: values.nom_article,
                        brands: values.brands,
                        quantity_text: values.quantity_text,
                        poids_kg: values.poids_kg,
                        prix_moyen_eur: values.prix_moyen_eur,
                        api_source: data.api_source,
                        image_url: data.image_url,
                        statut: 'Actif'
                    }
                },
                callback: function(r) {
                    if (r.message) {
                        let article_data = {
                            name: r.message.name,
                            nom_article: values.nom_article,
                            poids_kg: values.poids_kg,
                            prix_moyen_eur: values.prix_moyen_eur,
                            statut: 'Actif'
                        };
                        
                        add_or_increment_article(frm, article_data, values.quantite);
                        
                        frappe.show_alert({
                            message: __('✅ Article créé et ajouté: {0}', [values.nom_article]),
                            indicator: 'green'
                        }, 3);
                        
                        d.hide();
                        
                        // Refocus sur champ scan
                        setTimeout(() => {
                            frm.fields_dict.scan_code_barre.$input.focus();
                        }, 100);
                    }
                },
                error: function(r) {
                    frappe.msgprint({
                        title: __('Erreur'),
                        indicator: 'red',
                        message: __('Impossible de créer l\'article. Vérifiez les données.')
                    });
                }
            });
        },
        secondary_action_label: __('❌ Annuler'),
        secondary_action: function() {
            d.hide();
            // Refocus sur champ scan
            setTimeout(() => {
                frm.fields_dict.scan_code_barre.$input.focus();
            }, 100);
        }
    });
    
    d.show();
    
    setTimeout(() => {
        if (has_data) {
            d.fields_dict.quantite.$input.focus().select();
        } else {
            d.fields_dict.nom_article.$input.focus();
        }
    }, 100);
}
