window.onload = function() {
    addRow(); // Start with one row
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

// THE INTERNAL UNLOCK (Press Ctrl + Alt + U)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'u') {
        activateInternalMode();
    }
});

function activateInternalMode() {
    // 1. Lock all Customer Fields
    const customerInputs = document.querySelectorAll('.header-fields input, #tableBody input');
    customerInputs.forEach(input => {
        input.readOnly = true;
        input.style.backgroundColor = "#f0f0f0"; // Visual cue it's locked
    });

    // 2. Unlock all Fergus Fields
    const internalInputs = document.querySelectorAll('.internal-section input, .tracking-standalone input');
    internalInputs.forEach(input => {
        input.readOnly = false;
        input.style.backgroundColor = "#fff";
        input.style.border = "2px solid #005b7f";
    });

    // 3. Hide UI Buttons for the PDF
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    document.querySelectorAll('.action-col').forEach(col => col.style.display = 'none');
    
    // 4. Update Header
    document.getElementById('form-title').innerText = "OFFICIAL RETURN AUTHORIZATION";
    document.getElementById('instructions').innerHTML = "<b style='color:red;'>INTERNAL FERGUS REVIEW MODE - PRINT TO PDF</b>";
    
    alert("Internal Review Mode Active. Customer fields locked. Fergus fields unlocked.");
}
