// 1. INITIALIZE FORM
window.onload = function() {
    // Automatically add the first row so the table isn't empty on load
    addRow();
};

// 2. DYNAMIC ROW LOGIC
function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    
    // We use 'name' attributes so the data can actually be sent to you via email later
    row.innerHTML = `
        <td><input type="text" name="patient_id[]" placeholder="SMUJ-XXXXXX" required></td>
        <td><input type="text" name="tissue_id[]" required></td>
        <td><input type="text" name="product_size[]" required></td>
        <td class="action-col">
            <button type="button" onclick="removeRow(this)" style="background:#e84118; color:white; border:none; cursor:pointer; width: 100%; padding: 8px;">✕</button>
        </td>
    `;
}

function removeRow(btn) {
    let tbody = document.getElementById("tableBody");
    // Safety check: Don't let them delete the very last row
    if (tbody.rows.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert("At least one product entry is required for a return.");
    }
}

// 3. FERGUS INTERNAL UNLOCK (Ctrl + Alt + U)
// This allows YOU to unlock the "Read Only" fields when you receive the form back
document.addEventListener('keydown', function(e) {
    // Check if Ctrl, Alt, and 'U' are pressed at the same time
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'u') {
        const internalInputs = document.querySelectorAll('input[readonly]');
        
        if(internalInputs.length > 0) {
            internalInputs.forEach(input => {
                input.removeAttribute('readonly');
                input.style.backgroundColor = "#fff";
                input.style.border = "2px solid #005b7f";
                input.placeholder = "Enter internal data...";
            });
            alert("FERGUS INTERNAL USE ONLY: Fields have been unlocked for editing.");
        }
    }
});

// 4. SUBMISSION VALIDATION & WARNING
document.getElementById("returnForm").onsubmit = function(e) {
    // Final check for the user
    let ok = confirm("CONFIRMATION: I acknowledge that all entered information is correct. I understand this form must be printed and included in the return box.");
    
    if (!ok) {
        // Stops the form from sending if they click 'Cancel'
        e.preventDefault();
    }
};
