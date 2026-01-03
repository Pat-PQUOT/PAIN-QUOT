# Server Script: Reception Don Stock Cancel
# DocType: Reception Don
# Event: After Cancel

# Annulation: on retire du stock ce qui avait ete ajoute
for item in doc.articles:
    if item.article:
        article = frappe.get_doc('Article Epicerie', item.article)
        article.stock_actuel = (article.stock_actuel or 0) - (item.quantite or 0)
        if article.stock_actuel < 0:
            article.stock_actuel = 0
        article.save(ignore_permissions=True)

# Annulation historique donateur
if doc.donateur:
    donateur = frappe.get_doc('Donateur Epicerie', doc.donateur)
    donateur.nombre_total_dons = (donateur.nombre_total_dons or 1) - 1
    donateur.poids_total_dons = (donateur.poids_total_dons or 0) - (doc.poids_total or 0)
    donateur.valeur_totale_dons = (donateur.valeur_totale_dons or 0) - (doc.valeur_totale or 0)
    if donateur.poids_total_dons < 0:
        donateur.poids_total_dons = 0
    if donateur.valeur_totale_dons < 0:
        donateur.valeur_totale_dons = 0
    donateur.save(ignore_permissions=True)

frappe.msgprint('Stock annule!', indicator='orange', alert=True)
