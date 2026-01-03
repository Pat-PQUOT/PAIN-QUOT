# Server Script: Distribution Don Stock Cancel
# DocType: Distribution Don
# Event: After Cancel

# Annulation: on remet en stock ce qui avait ete distribue
for item in doc.articles:
    if item.article:
        article = frappe.get_doc('Article Epicerie', item.article)
        article.stock_actuel = (article.stock_actuel or 0) + (item.quantite or 0)
        article.save(ignore_permissions=True)

# Annulation historique beneficiaire
if doc.beneficiaire:
    beneficiaire = frappe.get_doc('Beneficiaire Epicerie', doc.beneficiaire)
    beneficiaire.nombre_distributions = (beneficiaire.nombre_distributions or 1) - 1
    if beneficiaire.nombre_distributions < 0:
        beneficiaire.nombre_distributions = 0
    beneficiaire.save(ignore_permissions=True)

frappe.msgprint('Distribution annulee, stock restaure!', indicator='orange', alert=True)
