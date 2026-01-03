// Client Script: Distribution Don Calculs
// DocType: Distribution Don
// View: Form

frappe.ui.form.on('Distribution Don', {
    refresh: function(frm) {
        calculate_totals(frm);
        remove_empty_rows(frm);
        setup_barcode_scanner(frm);
    },
    validate: function(frm) {
        calculate_totals(frm);
        remove_empty_rows(frm);
    }
});

function setup_barcode_scanner(frm) {
    let $input = frm.fields_dict.scan_code_barre.$input;
    $input.off('keypress.barcode');
    
    $input.on('keypress.barcode', function(e) {
        if (e.which === 13) {
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
            fields: ['name', 'nom_article', 'poids_kg', 'prix_moyen_eur', 'stock_actuel']
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                let article = r.message[0];
                show_quantity_dialog(frm, article);
            } else {
                frappe.msgprint({
                    title: 'Article non trouvé',
                    indicator: 'red',
                    message: `Aucun article avec le code-barre "${barcode}" n'existe.<br><br>Créez d'abord l'article via une Réception Don.`
                });
            }
            frm.set_value('scan_code_barre', '');
        }
    });
}

function remove_empty_rows(frm) {
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

frappe.ui.form.on('Ligne Distribution Don', {
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

function show_quantity_dialog(frm, article) {
    let stock_info = article.stock_actuel > 0 
        ? `<span style="color:green;">Stock: ${article.stock_actuel}</span>`
        : `<span style="color:red;">Stock: ${article.stock_actuel} (rupture!)</span>`;
    
    let d = new frappe.ui.Dialog({
        title: '📦 Distribuer',
        fields: [
            {
                fieldtype: 'HTML',
                fieldname: 'article_info',
                options: `<div style="background:#d4edda;padding:15px;border-radius:8px;margin-bottom:15px;">
                    <h4 style="margin:0 0 10px 0;">✅ ${article.nom_article}</h4>
                    <p style="margin:0;color:#666;">Poids: ${article.poids_kg || 0} Kg | Prix: ${article.prix_moyen_eur || 0} EUR</p>
                    <p style="margin:5px 0 0 0;">${stock_info}</p>
                </div>`
            },
            {
                fieldtype: 'Int',
                fieldname: 'quantite',
                label: 'Quantité à distribuer',
                default: 1,
                reqd: 1,
                description: 'Nombre d\'unités à distribuer'
            }
        ],
        primary_action_label: '✅ Distribuer',
        primary_action: function(values) {
            if (values.quantite > article.stock_actuel) {
                frappe.msgprint({
                    title: 'Stock insuffisant',
                    indicator: 'orange',
                    message: `Stock disponible: ${article.stock_actuel}. Vous demandez: ${values.quantite}.`
                });
                return;
            }
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
