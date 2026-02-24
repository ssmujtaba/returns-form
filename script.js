window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if this is a "Review Link" from an email
    if (urlParams.has('Company_Name')) {
        fillAndLockForm(urlParams);
    } else {
        addRow(); // Standard view for customers
    }
};

function fillAndLockForm(params) {
    // 1. Fill Header Fields
    document.getElementsByName('Company_Name')[0].value = params.get('Company_Name');
    document.getElementsByName('Provider_Name')[0].value = params.get('Provider_Name');
    document.getElementsByName('Invoice_Number')[0].value = params.get('Invoice_Number');
    document.getElementsByName('Phone_Number')[0].value = params.get('Phone_Number');

    // 2. Lock Header Fields
    document.querySelectorAll('.header-fields input').forEach(el => el.readOnly = true);

    // 3. Fill and Lock Product Rows
    const patientIDs = params.getAll('Patient_ID[]');
    const tissueIDs = params.getAll('Tissue_ID[]');
    const sizes = params.getAll('Product_Size[]');

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = ''; // Clear defaults
    
    patientIDs.forEach((id, index) => {
        let row = tbody.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${id}" readonly></td>
            <td><input type="text" value="${tissueIDs[index]}" readonly></td>
            <td><input type="text" value="${sizes[index]}" readonly></td>
            <td class="action-col"></td>
        `;
    });

    // 4. Unlock Fergus Fields
    document.querySelectorAll('.internal-section input, .tracking-standalone input').forEach(el => {
        el.readOnly = false;
        el.style.backgroundColor = "#fff";
        el.style.border = "2px solid #005b7f";
    });

    // 5. Hide Customer UI
    document.querySelector('.btn-add').style.display = 'none';
    document.querySelector('.btn-submit').style.display = 'none';
    document.querySelector('.intro-text').innerHTML = "<strong style='color:red;'>INTERNAL REVIEW MODE</strong>";
}

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="Patient_ID[]" placeholder="SMUJ-XXXXXX" required></td>
        <td><input type="text" name="Tissue_ID[]" required></td>
        <td><input type="text" name="Product_Size[]" required></td>
        <td class="action-col">
            <button type="button" onclick="removeRow(this)" class="btn-remove">✕</button>
        </td>
    `;
}
// Keep your existing removeRow function...
