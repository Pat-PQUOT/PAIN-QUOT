# Server Script: Reception Don Stock Update
# DocType: Reception Don
# Event: After Submit

# Mise a jour du stock lors de la validation d'une reception
for item in doc.articles:
    if item.article:
        article = frappe.get_doc('Article Epicerie', item.article)
        article.stock_actuel = (article.stock_actuel or 0) + (item.quantite or 0)
        article.save(ignore_permissions=True)

# Mise a jour historique donateur
if doc.donateur:
    donateur = frappe.get_doc('Donateur Epicerie', doc.donateur)
    donateur.dernier_don = doc.date_reception
    donateur.nombre_total_dons = (donateur.nombre_total_dons or 0) + 1
    donateur.poids_total_dons = (donateur.poids_total_dons or 0) + (doc.poids_total or 0)
    donateur.valeur_totale_dons = (donateur.valeur_totale_dons or 0) + (doc.valeur_totale or 0)
    donateur.save(ignore_permissions=True)

frappe.msgprint('Stock mis a jour!', indicator='green', alert=True)
