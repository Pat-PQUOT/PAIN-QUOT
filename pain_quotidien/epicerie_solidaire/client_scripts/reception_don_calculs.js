// Client Script: Reception Don Calculs
// DocType: Reception Don
// View: Form

frappe.ui.form.on('Reception Don', {
    refresh: function(frm) {
        calculate_totals(frm);
        // Supprimer les lignes vides au chargement
        remove_empty_rows(frm);
        // Configurer l'événement Entrée sur le champ scan
        setup_barcode_scanner(frm);
    },
    validate: function(frm) {
        calculate_totals(frm);
        // Supprimer les lignes vides avant sauvegarde
        remove_empty_rows(frm);
    }
});

function setup_barcode_scanner(frm) {
    // Détacher les anciens événements pour éviter les doublons
    let $input = frm.fields_dict.scan_code_barre.$input;
    $input.off('keypress.barcode');
    
    // Attacher l'événement sur Entrée uniquement
    $input.on('keypress.barcode', function(e) {
        if (e.which === 13) { // Touche Entrée
            e.preventDefault();
            let barcode = frm.doc.scan_code_barre;
            if (barcode && barcode.length >= 3) {
                process_barcode(frm, barcode);
            }
        }
    });
}

function process_barcode(frm, barcode) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Article Epicerie',
            filters: { code_barre: barcode },
            fields: ['name', 'nom_article', 'poids_kg', 'prix_moyen_eur']
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                // Article trouvé ! Demander la quantité
                let article = r.message[0];
                show_quantity_dialog(frm, article);
            } else {
                // Article non trouvé -> Appeler les APIs
                frappe.show_alert({message: 'Article non trouvé, recherche dans les APIs...', indicator: 'orange'}, 3);
                fetch_from_apis(frm, barcode);
            }
            frm.set_value('scan_code_barre', '');
        }
    });
}

function remove_empty_rows(frm) {
    // Supprimer les lignes sans article
    let dominated = false;
    (frm.doc.articles || []).forEach((row, idx) => {
        if (!row.article) {
            dominated = true;
        }
    });
    if (dominated) {
        frm.doc.articles = (frm.doc.articles || []).filter(row => row.article);
        frm.refresh_field('articles');
    }
}

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

// ========== DIALOG QUANTITÉ (Article existant) ==========

function show_quantity_dialog(frm, article) {
    let d = new frappe.ui.Dialog({
        title: '📦 Ajouter à la réception',
        fields: [
            {
                fieldtype: 'HTML',
                fieldname: 'article_info',
                options: `<div style="background:#d4edda;padding:15px;border-radius:8px;margin-bottom:15px;">
                    <h4 style="margin:0 0 10px 0;">✅ ${article.nom_article}</h4>
                    <p style="margin:0;color:#666;">Poids: ${article.poids_kg || 0} Kg | Prix: ${article.prix_moyen_eur || 0} EUR</p>
                </div>`
            },
            {
                fieldtype: 'Int',
                fieldname: 'quantite',
                label: 'Quantité',
                default: 1,
                reqd: 1,
                description: 'Nombre d\'unités reçues'
            }
        ],
        primary_action_label: '✅ Ajouter',
        primary_action: function(values) {
            add_article_to_table(frm, article.name, article.poids_kg, article.prix_moyen_eur, values.quantite);
            frappe.show_alert({message: `${values.quantite}x "${article.nom_article}" ajouté !`, indicator: 'green'}, 3);
            d.hide();
            setTimeout(() => {
                frm.fields_dict.scan_code_barre.$input.focus();
            }, 100);
        },
        secondary_action_label: '❌ Annuler',
        secondary_action: function() {
            d.hide();
        }
    });
    d.show();
    setTimeout(() => {
        d.fields_dict.quantite.$input.focus().select();
    }, 100);
}

function add_article_to_table(frm, article_name, poids, prix, quantite) {
    quantite = quantite || 1;
    let row = frm.add_child('articles');
    row.article = article_name;
    row.quantite = quantite;
    row.poids_unitaire = poids || 0;
    row.prix_unitaire = prix || 0;
    row.poids_ligne = (poids || 0) * quantite;
    row.valeur_ligne = (prix || 0) * quantite;
    frm.refresh_field('articles');
    calculate_totals(frm);
}

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

// ========== FONCTIONS API ==========

async function fetch_from_apis(frm, barcode) {
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
            if (p.product_quantity) {
                product_data.poids_kg = parseFloat(p.product_quantity) / 1000;
            }
        }
    } catch(e) { console.log('OFF Error:', e); }
    
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
            }
        } catch(e) { console.log('OPF Error:', e); }
    }
    
    // 3. Open Price
    try {
        let price_response = await fetch(`https://prices.openfoodfacts.org/api/v1/prices?product_code=${barcode}`);
        let price_data = await price_response.json();
        if (price_data.items && price_data.items.length > 0) {
            let prices = price_data.items.map(i => i.price).filter(p => p > 0);
            if (prices.length > 0) {
                product_data.prix_moyen_eur = prices.reduce((a,b) => a+b, 0) / prices.length;
            }
        }
    } catch(e) { console.log('Price Error:', e); }
    
    show_preview_dialog(frm, product_data);
}

function show_preview_dialog(frm, data) {
    let has_data = data.nom_article ? true : false;
    
    let d = new frappe.ui.Dialog({
        title: has_data ? '📦 Article trouvé - Confirmer' : '📝 Créer nouvel article',
        fields: [
            {
                fieldtype: 'HTML',
                fieldname: 'preview_html',
                options: has_data ? 
                    `<div style="background:#d4edda;padding:15px;border-radius:8px;margin-bottom:15px;">
                        <p><strong>Source:</strong> ${data.api_source}</p>
                        ${data.image_url ? `<img src="${data.image_url}" style="max-width:100px;max-height:100px;border-radius:4px;">` : ''}
                    </div>` : 
                    `<div style="background:#fff3cd;padding:15px;border-radius:8px;margin-bottom:15px;">
                        <p>⚠️ Produit non trouvé dans les APIs. Saisie manuelle requise.</p>
                    </div>`
            },
            {fieldtype: 'Section Break', label: 'Informations Article'},
            {fieldtype: 'Data', fieldname: 'code_barre', label: 'Code-Barre', default: data.code_barre, read_only: 1},
            {fieldtype: 'Data', fieldname: 'nom_article', label: 'Nom Article', default: data.nom_article, reqd: 1},
            {fieldtype: 'Column Break'},
            {fieldtype: 'Data', fieldname: 'brands', label: 'Marque', default: data.brands},
            {fieldtype: 'Data', fieldname: 'quantity_text', label: 'Contenance', default: data.quantity_text},
            {fieldtype: 'Section Break', label: 'Poids et Prix'},
            {fieldtype: 'Float', fieldname: 'poids_kg', label: 'Poids (Kg)', default: data.poids_kg},
            {fieldtype: 'Column Break'},
            {fieldtype: 'Currency', fieldname: 'prix_moyen_eur', label: 'Prix Moyen (EUR)', default: data.prix_moyen_eur},
            {fieldtype: 'Section Break', label: 'Quantité à recevoir'},
            {fieldtype: 'Int', fieldname: 'quantite', label: 'Quantité', default: 1, reqd: 1, description: 'Nombre d\'unités reçues'}
        ],
        primary_action_label: '✅ Créer et Ajouter',
        primary_action: function(values) {
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
                        add_article_to_table(frm, r.message.name, values.poids_kg, values.prix_moyen_eur, values.quantite);
                        frappe.show_alert({message: `${values.quantite}x "${values.nom_article}" créé et ajouté !`, indicator: 'green'}, 5);
                        d.hide();
                        setTimeout(() => {
                            frm.fields_dict.scan_code_barre.$input.focus();
                        }, 100);
                    }
                },
                error: function(r) {
                    frappe.msgprint({
                        title: 'Erreur',
                        indicator: 'red',
                        message: 'Impossible de créer l\'article. Vérifiez les données.'
                    });
                }
            });
        },
        secondary_action_label: '❌ Annuler',
        secondary_action: function() {
            d.hide();
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
