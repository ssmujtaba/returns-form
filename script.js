function addRow() {
  let table = document.getElementById("itemsTable");
  let row = table.insertRow();
  row.innerHTML = `
    <td><input required></td>
    <td><input required></td>
    <td><input required></td>
  `;
}

// Confirmation popup before submit
document.getElementById("returnForm").onsubmit = function(e) {
  let ok = confirm("⚠️ Please confirm all information is correct. Submissions cannot be edited.");
  if (!ok) {
    e.preventDefault();
  }
};
