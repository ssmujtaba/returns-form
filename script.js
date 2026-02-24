window.onload = function() {
    addRow(); // Start with one row automatically
};

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="patient_id[]" placeholder="SMUJ-XXXXXX" required></td>
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
        alert("At least one product entry is required.");
    }
}

document.getElementById("returnForm").onsubmit = function(e) {
    let ok = confirm("I acknowledge that all entered information is correct. This form must be printed and included in the return package.");
    if (!ok) {
        e.preventDefault();
    }
};
