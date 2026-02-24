window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    
    // IF THE URL HAS DATA (from your review link), PRE-FILL AND LOCK
    if (params.has('Company_Name')) {
        autoFillAndLock(params);
    } else {
        addRow(); // Standard customer view
    }
};

function autoFillAndLock(params) {
    // Fill text fields
    document.getElementsByName('Company_Name')[0].value = params.get('Company_Name');
    document.getElementsByName('Provider_Name')[0].value = params.get('Provider_Name');
    document.getElementsByName('Invoice_Number')[0].value = params.get('Invoice_Number');
    document.getElementsByName('Phone_Number')[0].value = params.get('Phone_Number');

    // Fill Product Rows
    const pIDs = params.getAll('Patient_ID[]');
    const tIDs = params.getAll('Tissue_ID[]');
    const sizes = params.getAll('Product_Size[]');
    
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = ''; // Clear empty row
    
    pIDs.forEach((id, i) => {
        let row = tbody.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${id}" readonly></td>
            <td><input type="text" value="${tIDs[i]}" readonly></td>
            <td><input type="text" value="${sizes[i]}" readonly></td>
            <td class="action-col"></td>
        `;
    });

    activateInternalMode(); // Lock customer fields, unlock Fergus fields
}

function activateInternalMode() {
    document.querySelectorAll('input').forEach(input => {
        if (!input.name.includes('Internal_')) {
            input.readOnly = true;
            input.style.backgroundColor = "#f9f9f9";
        } else {
            input.readOnly = false;
            input.style.backgroundColor = "#fff";
            input.style.border = "2px solid #005b7f";
        }
    });
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    document.querySelectorAll('.action-col').forEach(el => el.style.display = 'none');
}

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="Patient_ID[]" required></td>
        <td><input type="text" name="Tissue_ID[]" required></td>
        <td><input type="text" name="Product_Size[]" required></td>
        <td class="action-col"><button type="button" onclick="this.closest('tr').remove()" style="background:#e84118; color:white; border:none; padding: 8px;">✕</button></td>
    `;
}
