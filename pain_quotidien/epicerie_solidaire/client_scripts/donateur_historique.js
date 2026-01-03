// Client Script: Donateur Historique Receptions
// DocType: Donateur Epicerie
// View: Form

frappe.ui.form.on('Donateur Epicerie', {
    refresh: function(frm) {
        if (!frm.is_new()) {
            load_receptions_history(frm);
        }
    }
});

function load_receptions_history(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Reception Don',
            filters: {
                donateur: frm.doc.name,
                docstatus: 1
            },
            fields: ['name', 'date_reception', 'nombre_articles', 'poids_total', 'valeur_totale'],
            order_by: 'date_reception desc',
            limit_page_length: 5
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                render_receptions_table(frm, r.message);
            } else {
                frm.fields_dict.historique_receptions_html.$wrapper.html(
                    '<div style="padding:15px;color:#888;text-align:center;"><em>Aucune réception de ce donateur</em></div>'
                );
            }
        }
    });
}

function render_receptions_table(frm, receptions) {
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
    
    receptions.forEach(r => {
        let date_formatted = frappe.datetime.str_to_user(r.date_reception);
        html += `
            <tr>
                <td>${date_formatted}</td>
                <td><a href="/app/reception-don/${r.name}">${r.name}</a></td>
                <td style="text-align:right;">${r.nombre_articles || 0}</td>
                <td style="text-align:right;">${(r.poids_total || 0).toFixed(2)}</td>
                <td style="text-align:right;">${(r.valeur_totale || 0).toFixed(2)} €</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    frm.fields_dict.historique_receptions_html.$wrapper.html(html);
}
