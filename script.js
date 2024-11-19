// Define the API Key and Bin ID for JSONbin
const apiKey = "$2a$10$lMCbbBuOmkiE0CnjxKT2lORHcVZk2bHvhS3swv5vO2sz5NtClB2rK"; // Replace with your actual API key
const binId = "673c46cdacd3cb34a8aaf76c";           // Replace with your actual Bin ID

// Function to create a new user with an initial balance
function createUser(userId) {
  if (!userId) {
    alert("User ID is required.");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    method: "GET",
    headers: {
      "X-Master-Key": apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      const users = data.record || {};
      if (users[userId]) {
        alert("User already exists.");
      } else {
        users[userId] = { coins: 100, transactions: [] }; // Default starting coins
        updateBin(users, "User created successfully with 100 coins.");
      }
    })
    .catch(error => console.error("Error creating user:", error));
}

// Function to update a user's coin balance
function updateCoins(userId, coinAmount) {
  if (!userId || isNaN(coinAmount)) {
    alert("Valid user ID and coin amount are required.");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    method: "GET",
    headers: {
      "X-Master-Key": apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      const users = data.record || {};
      if (!users[userId]) {
        alert("User does not exist.");
      } else {
        users[userId].coins += coinAmount;
        updateBin(users, `User's coin balance updated by ${coinAmount}.`);
      }
    })
    .catch(error => console.error("Error updating coins:", error));
}

// Function to check the balance of a user
function checkBalance(userId) {
  if (!userId) {
    alert("User ID is required.");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    method: "GET",
    headers: {
      "X-Master-Key": apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      const users = data.record || {};
      if (!users[userId]) {
        alert("User does not exist.");
      } else {
        document.getElementById("balance").innerText = `Your Balance: ${users[userId].coins} coins`;
        displayTransactions(users[userId].transactions);
      }
    })
    .catch(error => console.error("Error checking balance:", error));
}

// Function to transfer coins between users
function transferCoins(senderId, receiverId, amount) {
  if (!senderId || !receiverId || isNaN(amount) || amount <= 0) {
    alert("Valid sender ID, receiver ID, and coin amount are required.");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    method: "GET",
    headers: {
      "X-Master-Key": apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      const users = data.record || {};

      // Check if both users exist
      if (!users[senderId] || !users[receiverId]) {
        alert("Both users must exist.");
        return;
      }

      // Check if sender has enough coins
      if (users[senderId].coins < amount) {
        alert("Sender doesn't have enough coins.");
        return;
      }

      // Perform the transfer
      users[senderId].coins -= amount;
      users[receiverId].coins += amount;

      // Add transaction history
      users[senderId].transactions.push({
        type: 'Sent',
        to: receiverId,
        amount: amount,
        date: new Date().toLocaleString()
      });
      users[receiverId].transactions.push({
        type: 'Received',
        from: senderId,
        amount: amount,
        date: new Date().toLocaleString()
      });

      // Update the bin
      updateBin(users, "Transfer successful.");
    })
    .catch(error => console.error("Error transferring coins:", error));
}

// Function to update the JSONbin data with the new state
function updateBin(users, message) {
  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
    },
    body: JSON.stringify(users),
  })
    .then(() => {
      alert(message || "Action completed.");
    })
    .catch(error => console.error("Error updating bin:", error));
}

// Function to display transactions on the UI
function displayTransactions(transactions) {
  const transactionHistory = document.getElementById("transactionHistory");
  transactionHistory.innerHTML = '';

  transactions.forEach(txn => {
    const txnElement = document.createElement('li');
    txnElement.innerText = `${txn.date} - ${txn.type} ${txn.amount} coins ${txn.to ? 'to ' + txn.to : ''} ${txn.from ? 'from ' + txn.from : ''}`;
    transactionHistory.appendChild(txnElement);
  });
}


