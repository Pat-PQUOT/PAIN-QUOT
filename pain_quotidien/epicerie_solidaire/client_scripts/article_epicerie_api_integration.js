/**
 * Client Script pour Article Epicerie - API Integration avec bouton scanner dans le formulaire (MOBILE UNIQUEMENT)
 * 
 * Fonctionnalités :
 * - Bouton scanner caméra 📷 sur mobile (après champ "famille")
 * - Désactivation autofocus clavier mobile
 * - Recherche Open Food Facts / Open Products Facts
 * - Recherche prix Open Price
 * - Détection doublons code-barre
 * - Mapping automatique catégories
 * 
 * Dernière mise à jour : 08/01/2026
 */

frappe.ui.form.on('Article Epicerie', {
    
    refresh: function(frm) {
        
        // Bouton refresh API pour articles existants
        if (!frm.is_new() && frm.doc.code_barre) {
            frm.add_custom_button(__('🔄 Mettre à jour depuis API'), function() {
                refresh_from_api(frm);
            });
        }
        
        // NOUVEAU : Bouton scanner directement dans le formulaire (UNIQUEMENT SUR MOBILE)
        if (frm.is_new() && is_mobile()) {
            add_scanner_button_in_form(frm);
            
            // Sur mobile : retirer le focus du champ code_barre pour éviter que le clavier masque le bouton
            setTimeout(function() {
                if (frm.fields_dict.code_barre && frm.fields_dict.code_barre.$input) {
                    frm.fields_dict.code_barre.$input.blur();
                }
            }, 100);
        }
        
        // ENTER sur code_barre → Lance recherche
        if (frm.fields_dict.code_barre && frm.fields_dict.code_barre.$input) {
            frm.fields_dict.code_barre.$input.on('keypress', function(e) {
                if (e.which === 13 || e.keyCode === 13) {
                    e.preventDefault();
                    let barcode = frm.doc.code_barre;
                    if (barcode) {
                        check_article_exists(frm, barcode);
                    }
                }
            });
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
 * Ajoute le bouton scanner directement dans le formulaire
 * Position : Après le champ "famille" et avant "statut"
 */
function add_scanner_button_in_form(frm) {
    // Vérifier si le bouton existe déjà
    if ($('#custom_scan_barcode_btn').length > 0) {
        return; // Déjà créé, ne rien faire
    }
    
    // Trouver le champ famille
    let famille_field = frm.fields_dict.famille;
    if (!famille_field || !famille_field.wrapper) {
        console.log('Champ famille non trouvé');
        return;
    }
    
    // Créer le bouton HTML
    let button_html = `
        <div class="form-group" id="custom_scan_barcode_btn" style="margin-top: 10px; margin-bottom: 10px;">
            <div class="clearfix">
                <label class="control-label" style="padding-right: 0px;"></label>
            </div>
            <button class="btn btn-primary btn-lg btn-block" type="button" style="padding: 15px; font-size: 18px;">
                📷 Scanner code-barre
            </button>
        </div>
    `;
    
    // Insérer après le champ famille
    $(famille_field.wrapper).after(button_html);
    
    // Attacher l'événement click
    $('#custom_scan_barcode_btn button').on('click', function() {
        scan_barcode_with_camera(frm);
    });
}


function check_article_exists(frm, barcode) {
    if (!frm.is_new()) return;
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Article Epicerie',
            filters: { code_barre: barcode },
            fields: ['name', 'nom_article', 'code_barre', 'stock_actuel']
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                let existing = r.message[0];
                frappe.msgprint({
                    title: __('Article existant'),
                    indicator: 'blue',
                    message: __(`<p><strong>Un article avec ce code-barre existe déjà !</strong></p><p>📦 <strong>${existing.nom_article}</strong></p><p>📊 Stock actuel: <strong>${existing.stock_actuel || 0}</strong></p><p><a href="/app/article-epicerie/${existing.name}">Ouvrir l'article</a></p>`)
                });
                frm.set_value('code_barre', '');
            } else {
                fetch_from_apis_clientside(frm, barcode);
            }
        }
    });
}


function scan_barcode_with_camera(frm) {
    try {
        new frappe.ui.Scanner({
            dialog: true,
            multiple: false,
            on_scan(data) {
                frm.set_value('code_barre', data.decodedText);
                check_article_exists(frm, data.decodedText);
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


function refresh_from_api(frm) {
    if (!frm.doc.code_barre) {
        frappe.msgprint(__('Pas de code-barre sur cet article'));
        return;
    }
    frappe.confirm(
        __('Voulez-vous mettre à jour les données depuis les APIs ?<br>Les données actuelles seront remplacées.'),
        function() { fetch_from_apis_clientside(frm, frm.doc.code_barre); }
    );
}


async function fetch_from_apis_clientside(frm, barcode) {
    frappe.show_alert({ message: __('🔍 Recherche dans Open Food Facts...'), indicator: 'blue' }, 3);
    let result = { found: false, source: null, barcode: barcode, product_name_api: null, brands: null, quantity_text: null, product_quantity: null, product_quantity_unit: null, poids_kg: null, image_url: null, categories_api: null, suggested_rayon: null, suggested_famille: null, prix_moyen_eur: null, prix_last_update: null };
    try {
        let food_data = await fetch_openfoodfacts(barcode);
        if (food_data.found) {
            Object.assign(result, food_data);
            result.source = 'OpenFoodFacts';
            let category_mapping = map_category(food_data.categories_api, 'food');
            result.suggested_rayon = category_mapping.rayon;
            result.suggested_famille = category_mapping.famille;
        } else {
            frappe.show_alert({ message: __('🔍 Recherche dans Open Products Facts...'), indicator: 'blue' }, 3);
            let products_data = await fetch_openproducts(barcode);
            if (products_data.found) {
                Object.assign(result, products_data);
                result.source = 'OpenProducts';
                let category_mapping = map_category(products_data.categories_api, 'products');
                result.suggested_rayon = category_mapping.rayon;
                result.suggested_famille = category_mapping.famille;
            }
        }
        frappe.show_alert({ message: __('💰 Recherche prix...'), indicator: 'blue' }, 2);
        let price_data = await fetch_openprice(barcode);
        if (price_data.found) {
            result.prix_moyen_eur = price_data.prix_moyen_eur;
            result.prix_last_update = price_data.prix_last_update;
        }
        show_api_preview_dialog(frm, result);
    } catch (error) {
        console.error('Erreur APIs:', error);
        frappe.msgprint({ title: __('Erreur'), indicator: 'red', message: __('Erreur lors des appels APIs: ' + error.message) });
    }
}


async function fetch_openfoodfacts(barcode) {
    let result = { found: false, product_name_api: null, brands: null, quantity_text: null, product_quantity: null, product_quantity_unit: null, poids_kg: null, image_url: null, categories_api: null };
    try {
        const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
        const response = await fetch(url);
        if (!response.ok) return result;
        const data = await response.json();
        if (data.status !== 1 || !data.product) return result;
        const product = data.product;
        result.found = true;
        result.product_name_api = product.product_name || product.product_name_fr;
        result.brands = product.brands;
        result.quantity_text = product.quantity;
        result.image_url = product.image_url || product.image_front_url;
        if (product.categories_tags) result.categories_api = product.categories_tags.slice(0, 5).join(', ');
        if (product.product_quantity && product.product_quantity_unit) {
            result.product_quantity = parseFloat(product.product_quantity);
            result.product_quantity_unit = product.product_quantity_unit;
            result.poids_kg = normalize_weight(result.product_quantity, result.product_quantity_unit);
        }
        return result;
    } catch (error) {
        console.error('Erreur Open Food Facts:', error);
        return result;
    }
}


async function fetch_openproducts(barcode) {
    let result = { found: false, product_name_api: null, brands: null, quantity_text: null, product_quantity: null, product_quantity_unit: null, poids_kg: null, image_url: null, categories_api: null };
    try {
        const url = `https://world.openproductsfacts.org/api/v2/product/${barcode}.json`;
        const response = await fetch(url);
        if (!response.ok) return result;
        const data = await response.json();
        if (data.status !== 1 || !data.product) return result;
        const product = data.product;
        result.found = true;
        result.product_name_api = product.product_name || product.product_name_fr;
        result.brands = product.brands;
        result.quantity_text = product.quantity;
        result.image_url = product.image_url || product.image_front_url;
        if (product.categories_tags) result.categories_api = product.categories_tags.slice(0, 5).join(', ');
        if (product.product_quantity && product.product_quantity_unit) {
            result.product_quantity = parseFloat(product.product_quantity);
            result.product_quantity_unit = product.product_quantity_unit;
            result.poids_kg = normalize_weight(result.product_quantity, result.product_quantity_unit);
        }
        return result;
    } catch (error) {
        console.error('Erreur Open Products Facts:', error);
        return result;
    }
}


async function fetch_openprice(barcode) {
    let result = { found: false, prix_moyen_eur: null, prix_last_update: null };
    try {
        const url = `https://prices.openfoodfacts.org/api/v1/prices?product_code=${barcode}&order_by=-date&size=20`;
        const response = await fetch(url);
        if (!response.ok) return result;
        const data = await response.json();
        if (!data.items || data.items.length === 0) return result;
        result.found = true;
        const eur_prices = data.items.filter(item => item.currency === 'EUR' && item.price).map(item => parseFloat(item.price));
        if (eur_prices.length > 0) {
            const sum = eur_prices.reduce((a, b) => a + b, 0);
            result.prix_moyen_eur = (sum / eur_prices.length).toFixed(2);
            if (data.items[0].date) result.prix_last_update = data.items[0].date;
        }
        return result;
    } catch (error) {
        console.error('Erreur Open Price:', error);
        return result;
    }
}


function normalize_weight(quantity, unit) {
    if (!quantity || !unit) return null;
    const conversions = { 'g': 1000, 'kg': 1, 'mg': 1000000, 'l': 1, 'ml': 1000, 'cl': 100, 'dl': 10 };
    const u = unit.toLowerCase();
    if (conversions[u]) return (quantity / conversions[u]).toFixed(3);
    return null;
}


function map_category(categories_str, type) {
    if (!categories_str) return type === 'food' ? {rayon: 'Alimentaire', famille: 'Autre Alimentaire'} : {rayon: 'Non Alimentaire', famille: 'Autre Non Alimentaire'};
    const tags = categories_str.toLowerCase().split(',').map(t => t.trim());
    if (type === 'food') {
        const mappings = { 'Fruits et Légumes': ['fruit', 'vegetable', 'légume', 'legume'], 'Produits Laitiers': ['dairy', 'cheese', 'yogurt', 'milk', 'lait', 'fromage'], 'Viandes et Poissons': ['meat', 'fish', 'viande', 'poisson'], 'Boulangerie': ['bread', 'bakery', 'pain', 'boulangerie'], 'Épicerie Sèche': ['pasta', 'rice', 'pâtes', 'riz', 'noodles', 'flour', 'farine'], 'Conserves': ['canned', 'preserved', 'conserve', 'tinned'], 'Surgelés': ['frozen', 'surgelé', 'ice-cream', 'glace'], 'Boissons': ['beverage', 'drink', 'water', 'juice', 'soda', 'boisson', 'coffee', 'tea'], 'Petit Déjeuner': ['breakfast', 'cereals', 'jam', 'honey', 'confiture', 'miel'], 'Condiments': ['sauce', 'condiment', 'ketchup', 'mayonnaise', 'mustard', 'vinegar'], 'Snacks': ['snack', 'chips', 'crisp', 'biscuit', 'cookie'], 'Plats Préparés': ['prepared', 'ready', 'meal', 'plat', 'pizza'] };
        for (let [famille, keywords] of Object.entries(mappings)) {
            for (let tag of tags) {
                for (let keyword of keywords) {
                    if (tag.includes(keyword)) return {rayon: 'Alimentaire', famille: famille};
                }
            }
        }
        return {rayon: 'Alimentaire', famille: 'Autre Alimentaire'};
    } else {
        const mappings = { 'Hygiène': ['hygiene', 'soap', 'shampoo', 'toothpaste', 'hygiène', 'gel', 'deodorant'], 'Entretien': ['cleaning', 'detergent', 'household', 'entretien', 'bleach', 'javel'], 'Bébé': ['baby', 'diaper', 'bébé', 'couche', 'infant'] };
        for (let [famille, keywords] of Object.entries(mappings)) {
            for (let tag of tags) {
                for (let keyword of keywords) {
                    if (tag.includes(keyword)) return {rayon: 'Non Alimentaire', famille: famille};
                }
            }
        }
        return {rayon: 'Non Alimentaire', famille: 'Autre Non Alimentaire'};
    }
}


function show_api_preview_dialog(frm, api_data) {
    let source_label = api_data.source || 'Manuel';
    let source_color = api_data.found ? 'green' : 'orange';
    let preview_html = `<div style="padding: 10px;"><div style="margin-bottom: 20px;"><span class="indicator ${source_color}">Source: <strong>${source_label}</strong></span></div><table class="table table-bordered" style="margin-top: 15px;"><tr><th style="width: 40%;">Champ</th><th>Valeur</th></tr><tr><td><strong>Code-barre</strong></td><td>${api_data.barcode}</td></tr><tr><td><strong>Nom produit</strong></td><td>${api_data.product_name_api || '<em>Non trouvé</em>'}</td></tr><tr><td><strong>Marque</strong></td><td>${api_data.brands || '<em>Non trouvé</em>'}</td></tr><tr><td><strong>Quantité</strong></td><td>${api_data.quantity_text || '<em>Non trouvé</em>'}</td></tr><tr><td><strong>Poids normalisé</strong></td><td>${api_data.poids_kg ? api_data.poids_kg + ' Kg' : '<em>Non calculé</em>'}</td></tr><tr><td><strong>Rayon suggéré</strong></td><td>${api_data.suggested_rayon || '<em>Aucun</em>'}</td></tr><tr><td><strong>Famille suggérée</strong></td><td>${api_data.suggested_famille || '<em>Aucune</em>'}</td></tr><tr style="background-color: #f9f9f9;"><td><strong>💰 Prix moyen</strong></td><td>${api_data.prix_moyen_eur ? api_data.prix_moyen_eur + ' EUR' : '<em>Non trouvé</em>'}</td></tr></table>${api_data.image_url ? `<div style="margin-top: 15px; text-align: center;"><img src="${api_data.image_url}" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; padding: 5px;"></div>` : ''}${!api_data.found ? `<div class="alert alert-warning" style="margin-top: 15px;">⚠️ <strong>Produit non trouvé dans les bases</strong><br>Vous devrez saisir les informations manuellement.</div>` : ''}</div>`;
    let d = new frappe.ui.Dialog({ title: __('📦 Données récupérées'), fields: [{ fieldtype: 'HTML', fieldname: 'preview', options: preview_html }], size: 'large', primary_action_label: api_data.found ? __('✅ Utiliser ces données') : __('✏️ Saisir manuellement'), primary_action: function() { apply_api_data(frm, api_data); d.hide(); }, secondary_action_label: __('❌ Annuler'), secondary_action: function() { frm.set_value('code_barre', ''); d.hide(); } });
    d.show();
}


function apply_api_data(frm, api_data) {
    if (api_data.product_name_api) frm.set_value('nom_article', api_data.product_name_api);
    if (api_data.brands) frm.set_value('brands', api_data.brands);
    if (api_data.quantity_text) frm.set_value('quantity_text', api_data.quantity_text);
    if (api_data.poids_kg) frm.set_value('poids_kg', parseFloat(api_data.poids_kg));
    if (api_data.image_url) frm.set_value('image_url', api_data.image_url);
    if (api_data.suggested_rayon) frm.set_value('rayon', api_data.suggested_rayon);
    if (api_data.suggested_famille) setTimeout(function() { frm.set_value('famille', api_data.suggested_famille); }, 200);
    if (api_data.prix_moyen_eur) frm.set_value('prix_moyen_eur', parseFloat(api_data.prix_moyen_eur));
    if (api_data.source) frm.set_value('api_source', api_data.source);
    frappe.show_alert({ message: __('✅ Données appliquées !'), indicator: 'green' }, 3);
}
