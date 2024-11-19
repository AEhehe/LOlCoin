<script src="https://www.gstatic.com/firebasejs/9.x/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x/firebase-database.js"></script>

// Firebase configuration (replace with your config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAenFp_Ryes3-0kLfb_vNR_PHLlsA08OK4",
  authDomain: "lol-coin-9c308.firebaseapp.com",
  projectId: "lol-coin-9c308",
  storageBucket: "lol-coin-9c308.firebasestorage.app",
  messagingSenderId: "143807595945",
  appId: "1:143807595945:web:4234c550db627e4c0870b8",
  measurementId: "G-CQGZ15FFJT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Authentication
firebase.auth().signInAnonymously().catch((error) => {
  console.error("Error during authentication:", error);
});

// User-specific data
let userId;

// DOM elements
const balanceElement = document.getElementById('balance');
const form = document.getElementById('transfer-form');
const logElement = document.getElementById('log');

// Update balance display
function updateBalance(balance) {
  balanceElement.textContent = balance;
}

// Update transaction log display
function updateTransactionLog(log) {
  logElement.innerHTML = ''; // Clear log
  log.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    logElement.appendChild(li);
  });
}

// Handle form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const recipient = document.getElementById('recipient').value;
  const amount = parseInt(document.getElementById('amount').value, 10);

  const userRef = db.ref(`users/${userId}`);
  userRef.once('value').then((snapshot) => {
    const data = snapshot.val();
    if (amount > data.balance) {
      alert('Insufficient balance!');
      return;
    }

    // Update balance
    const newBalance = data.balance - amount;
    userRef.update({ balance: newBalance });

    // Add transaction
    const newLog = [...(data.transactions || []), `Sent ${amount} coins to ${recipient}`];
    userRef.update({ transactions: newLog });

    // Clear form
    form.reset();
  });
});

// Firebase authentication listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userId = user.uid;
    const userRef = db.ref(`users/${userId}`);
    
    // Initialize user data if not already set
    userRef.once('value').then((snapshot) => {
      if (!snapshot.exists()) {
        userRef.set({ balance: 100, transactions: [] });
      } else {
        const data = snapshot.val();
        updateBalance(data.balance);
        updateTransactionLog(data.transactions);
      }
    });

    // Listen for balance changes
    userRef.child('balance').on('value', (snapshot) => {
      updateBalance(snapshot.val());
    });

    // Listen for transaction log updates
    userRef.child('transactions').on('value', (snapshot) => {
      updateTransactionLog(snapshot.val() || []);
    });
  }
});

