// Client Script: Beneficiaire Historique Distributions
// DocType: Beneficiaire Epicerie
// View: Form

frappe.ui.form.on('Beneficiaire Epicerie', {
    refresh: function(frm) {
        if (!frm.is_new()) {
            load_distributions_history(frm);
        }
    }
});

function load_distributions_history(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Distribution Don',
            filters: {
                beneficiaire: frm.doc.name,
                docstatus: 1
            },
            fields: ['name', 'date_distribution', 'nombre_articles', 'poids_total', 'valeur_totale'],
            order_by: 'date_distribution desc',
            limit_page_length: 5
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                render_distributions_table(frm, r.message);
            } else {
                frm.fields_dict.historique_distributions_html.$wrapper.html(
                    '<div style="padding:15px;color:#888;text-align:center;"><em>Aucune distribution pour ce bénéficiaire</em></div>'
                );
            }
        }
    });
}

function render_distributions_table(frm, distributions) {
    let html = `
        <table class="table table-bordered table-sm" style="margin-top:10px;">
            <thead style="background:#f5f5f5;">
                <tr>
                    <th>Date</th>
                    <th>Référence</th>
                    <th style="text-align:right;">Articles</th>
                    <th style="text-align:right;">Poids (Kg)</th>
                    <th style="text-align:right;">Valeur (EUR)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    distributions.forEach(d => {
        let date_formatted = frappe.datetime.str_to_user(d.date_distribution);
        html += `
            <tr>
                <td>${date_formatted}</td>
                <td><a href="/app/distribution-don/${d.name}">${d.name}</a></td>
                <td style="text-align:right;">${d.nombre_articles || 0}</td>
                <td style="text-align:right;">${(d.poids_total || 0).toFixed(2)}</td>
                <td style="text-align:right;">${(d.valeur_totale || 0).toFixed(2)} €</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    frm.fields_dict.historique_distributions_html.$wrapper.html(html);
}
