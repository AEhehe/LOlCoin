// Initial balance
let balance = 100;

// Transaction log
const log = [];

// DOM elements
const balanceElement = document.getElementById('balance');
const form = document.getElementById('transfer-form');
const logElement = document.getElementById('log');

// Update balance display
function updateBalance() {
  balanceElement.textContent = balance;
}

// Add transaction to log
function addTransactionLog(recipient, amount) {
  const logEntry = `Sent ${amount} coins to ${recipient}`;
  log.push(logEntry);
  const li = document.createElement('li');
  li.textContent = logEntry;
  logElement.appendChild(li);
}

// Handle form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const recipient = document.getElementById('recipient').value;
  const amount = parseInt(document.getElementById('amount').value, 10);

  if (amount > balance) {
    alert('Insufficient balance!');
    return;
  }

  balance -= amount;
  updateBalance();
  addTransactionLog(recipient, amount);

  // Clear form
  form.reset();
});

// Initial display
updateBalance();
