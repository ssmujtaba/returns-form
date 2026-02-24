window.onload = function() {
    addRow();
};

function addRow() {
    let tbody = document.getElementById("tableBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="SMUJ-XXXXXX" required></td>
        <td><input type="text" required></td>
        <td><input type="text" required></td>
        <td class="action-col"><button type="button" onclick="removeRow(this)" style="background:red; color:white; border:none; cursor:pointer; width: 100%;">✕</button></td>
    `;
}

function removeRow(btn) {
    let tbody = document.getElementById("tableBody");
    if (tbody.rows.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert("At least one product is required.");
    }
}

// Function for YOU to unlock the internal fields after submission
function unlockInternalFields() {
    const internalInputs = document.querySelectorAll('input[readonly]');
    internalInputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.backgroundColor = "white";
    });
}

// Pro-tip: You can trigger this by typing a shortcut or 
// just removing "readonly" in the browser inspect tool.
document.getElementById("returnForm").onsubmit = function(e) {
    let ok = confirm("I acknowledge that all info is correct. I will print this form and include it in the return box.");
    if (!ok) e.preventDefault();
};
