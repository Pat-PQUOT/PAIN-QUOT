# Server Script: Distribution Don Stock Update
# DocType: Distribution Don
# Event: After Submit

# Mise a jour du stock lors de la validation d'une distribution (diminution)
for item in doc.articles:
    if item.article:
        article = frappe.get_doc('Article Epicerie', item.article)
        article.stock_actuel = (article.stock_actuel or 0) - (item.quantite or 0)
        if article.stock_actuel < 0:
            article.stock_actuel = 0
        article.save(ignore_permissions=True)

# Mise a jour historique beneficiaire
if doc.beneficiaire:
    beneficiaire = frappe.get_doc('Beneficiaire Epicerie', doc.beneficiaire)
    beneficiaire.derniere_distribution = doc.date_distribution
    beneficiaire.nombre_distributions = (beneficiaire.nombre_distributions or 0) + 1
    beneficiaire.save(ignore_permissions=True)

frappe.msgprint('Distribution enregistree, stock mis a jour!', indicator='green', alert=True)
