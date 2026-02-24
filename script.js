window.onload = function() {
    addRow();
};

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="Patient_ID[]" required></td>
        <td><input type="text" name="Tissue_ID[]" required></td>
        <td><input type="text" name="Product_Size[]" required></td>
        <td class="action-col">
            <button type="button" onclick="removeRow(this)" style="background:#e84118; color:white; border:none; padding: 8px;">✕</button>
        </td>
    `;
}

function removeRow(btn) {
    let tbody = document.getElementById("tableBody");
    if (tbody.rows.length > 1) {
        btn.closest('tr').remove();
    }
}

// UNLOCK SHORTCUT
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'u') {
        // Lock EVERYTHING that was currently typed in
        document.querySelectorAll('input').forEach(input => {
            if (!input.name.includes('Internal_')) {
                input.readOnly = true;
                input.style.backgroundColor = "#f9f9f9";
            }
        });

        // Unlock only Fergus fields
        const internal = document.querySelectorAll('input[name^="Internal_"]');
        internal.forEach(input => {
            input.readOnly = false;
            input.style.backgroundColor = "#fff";
            input.style.border = "2px solid #005b7f";
        });

        // Hide UI
        document.getElementById('addBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'none';
        document.querySelectorAll('.action-col').forEach(el => el.style.display = 'none');
        
        alert("Locked for Internal Review. No data was cleared.");
    }
});
