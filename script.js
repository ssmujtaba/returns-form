// Add the first row automatically on load
window.onload = function() {
    addRow();
};

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="patient_id[]" placeholder="e.g. SMUJ-022426" required></td>
        <td><input type="text" name="tissue_id[]" required></td>
        <td><input type="text" name="product_size[]" required></td>
        <td><button type="button" class="btn-remove" onclick="removeRow(this)">✕</button></td>
    `;
}

function removeRow(btn) {
    let row = btn.parentNode.parentNode;
    if (document.getElementById("tableBody").rows.length > 1) {
        row.parentNode.removeChild(row);
    } else {
        alert("You must include at least one product.");
    }
}

document.getElementById("returnForm").onsubmit = function(e) {
    let ok = confirm("CONFIRMATION: I acknowledge that all entered information is correct. This submission cannot be edited once sent.");
    if (!ok) {
        e.preventDefault();
    }
};
