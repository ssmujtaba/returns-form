window.onload = function() {
    addRow();
};

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="Patient_ID[]" placeholder="SMUJ-XXXXXX" required></td>
        <td><input type="text" name="Tissue_ID[]" required></td>
        <td><input type="text" name="Product_Size[]" required></td>
        <td class="action-col">
            <button type="button" onclick="removeRow(this)" style="background:#e84118; color:white; border:none; cursor:pointer; width: 100%; padding: 8px;">✕</button>
        </td>
    `;
}

function removeRow(btn) {
    let tbody = document.getElementById("tableBody");
    if (tbody.rows.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert("At least one product entry is required.");
    }
}

// UNLOCK INTERNAL FIELDS: Press Ctrl + Alt + U
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'u') {
        const internalInputs = document.querySelectorAll('input[readonly]');
        internalInputs.forEach(input => {
            input.removeAttribute('readonly');
            input.style.backgroundColor = "#fff";
            input.style.border = "2px solid #005b7f";
        });
        alert("Fergus Internal Fields Unlocked.");
    }
});

document.getElementById("returnForm").onsubmit = function(e) {
    let ok = confirm("I acknowledge that all info is correct. I will print this form and include it in the return box.");
    if (!ok) e.preventDefault();
};
