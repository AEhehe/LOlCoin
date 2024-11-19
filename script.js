// Define the API Key and Bin ID for JSONbin
const apiKey = "$2a$10$Eti1haWYiEHfN8NWMSZ.zeFpqBDokVahGAvEWfuNSsXXDMbnZYfiq"; // Replace with your actual API key
const binId = "673c46cdacd3cb34a8aaf76c";           // Replace with your actual Bin ID

// Function to create a new user in the database
function createUser() {
  const userId = document.getElementById("newUserId").value;
  if (!userId) {
    document.getElementById("createUserMessage").innerText = "User ID is required!";
    return;
  }

  // Fetch the current data from JSONbin
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
        document.getElementById("createUserMessage").innerText = "User already exists!";
      } else {
        // Add the new user with starting coins (e.g., 100)
        users[userId] = { coins: 100 };
        updateBin(users, "User created successfully with 100 coins.");
      }
    })
    .catch(error => console.error("Error fetching users:", error));
}

// Function to update the user's coin balance
function updateCoins() {
  const userId = document.getElementById("manageUserId").value;
  const coinAmount = parseInt(document.getElementById("coinAmount").value, 10);

  if (!userId || isNaN(coinAmount)) {
    document.getElementById("updateCoinMessage").innerText = "User ID and valid coin amount are required!";
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
        document.getElementById("updateCoinMessage").innerText = "User does not exist!";
      } else {
        users[userId].coins += coinAmount; // Update the coin balance
        updateBin(users, `User's coin balance updated by ${coinAmount}.`);
      }
    })
    .catch(error => console.error("Error updating coins:", error));
}

// Function to check the user's coin balance
function checkBalance() {
  const userId = document.getElementById("checkUserId").value;
  if (!userId) {
    document.getElementById("balanceMessage").innerText = "User ID is required!";
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
        document.getElementById("balanceMessage").innerText = "User does not exist!";
      } else {
        document.getElementById("balanceMessage").innerText = `User's balance: ${users[userId].coins} coins.`;
      }
    })
    .catch(error => console.error("Error checking balance:", error));
}

// Function to update the JSONbin with new data
function updateBin(data, successMessage) {
  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
    },
    body: JSON.stringify(data),
  })
    .then(() => {
      document.getElementById("createUserMessage").innerText = successMessage || "";
      document.getElementById("updateCoinMessage").innerText = successMessage || "";
    })
    .catch(error => console.error("Error updating JSONbin:", error));
}

