const password = "storepass";
let inventory = [];
let sales = [];
let logs = [];

function getToday() {
  return new Date().toLocaleDateString();
}

function getNow() {
  return new Date().toLocaleString();
}

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  if (input === password) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appContent").style.display = "block";
    document.getElementById("todayDate").innerText = `📅 ${getToday()}`;
    updateInventoryTable();
    updateProductOptions();
    updateLogs();
    showSection('inventory');
  } else {
    alert("Incorrect password.");
  }
}

function showSection(section) {
  const sections = ["inventorySection", "salesSection", "viewSection"];
  sections.forEach(id => {
    document.getElementById(id).style.display = id === section + "Section" ? "block" : "none";
  });
}

function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const qty = parseInt(document.getElementById("productQty").value);

  if (!name || isNaN(price) || isNaN(qty)) {
    alert("Fill all fields correctly.");
    return;
  }

  const existing = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.qty += qty;
    existing.price = price;
  } else {
    inventory.push({ name, price, qty });
  }

  logs.push({ type: "Stock Added", name, qty, price, timestamp: getNow() });

  updateInventoryTable();
  updateProductOptions();
  updateLogs();
  clearInputs();
}

function updateInventoryTable() {
  const tbody = document.querySelector("#inventoryTable tbody");
  tbody.innerHTML = "";
  inventory.forEach(item => {
    tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.price}</td><td>${item.qty}</td></tr>`;
  });
}

function updateProductOptions() {
  const select = document.getElementById("saleProduct");
  select.innerHTML = "";
  inventory.forEach(item => {
    select.innerHTML += `<option value="${item.name}">${item.name}</option>`;
  });
}

function recordSale() {
  const name = document.getElementById("saleProduct").value;
  const qty = parseInt(document.getElementById("saleQty").value);
  const item = inventory.find(p => p.name === name);

  if (!item || isNaN(qty) || qty > item.qty || qty < 1) {
    alert("Invalid sale quantity.");
    return;
  }

  item.qty -= qty;
  const total = qty * item.price;
  sales.push({ name, qty, total, date: getNow() });

  logs.push({ type: "Sale", name, qty, total, timestamp: getNow() });

  updateInventoryTable();
  updateSalesTable();
  updateLogs();
  document.getElementById("saleQty").value = "";
}

function updateSalesTable() {
  const tbody = document.querySelector("#salesTable tbody");
  tbody.innerHTML = "";
  sales.forEach(s => {
    tbody.innerHTML += `<tr><td>${s.name}</td><td>${s.qty}</td><td>₦${s.total}</td></tr>`;
  });
}

function exportSales() {
  const csvRows = [["Product", "Qty Sold", "Total", "Date"]];
  sales.forEach(s => {
    csvRows.push([s.name, s.qty, s.total, s.date]);
  });

  const blob = new Blob([csvRows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Sales_Report_${getToday().replace(/\//g, "-")}.csv`;
  link.click();
}

function updateLogs() {
  const logDiv = document.getElementById("logEntries");
  logDiv.innerHTML = "";
  logs.slice().reverse().forEach(log => {
    if (log.type === "Sale") {
      logDiv.innerHTML += `<div>🛒 ${log.qty} x ${log.name} sold for ₦${log.total} on ${log.timestamp}</div>`;
    } else {
      logDiv.innerHTML += `<div>📦 Added ${log.qty} x ${log.name} at ₦${log.price} each on ${log.timestamp}</div>`;
    }
  });
}

function clearInputs() {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productQty").value = "";
}
