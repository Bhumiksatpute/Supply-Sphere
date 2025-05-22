// Check if the user is logged in
const userId = localStorage.getItem('userId');
if (!userId) {
  window.location.href = 'login.html';
}

// Optionally fetch and display the user's name (if your backend supports it)
async function fetchUserName() {
  // Example: adjust endpoint as per your backend
  const response = await fetch(`/user/${userId}`);
  if (response.ok) {
    const data = await response.json();
    document.getElementById('welcome-message').textContent = `Welcome, ${data.name}!`;
  } else {
    document.getElementById('welcome-message').textContent = 'Welcome!';
  }
}
fetchUserName();

// Fetch and display chat messages
async function loadMessages() {
  const response = await fetch('/messages');
  const messages = await response.json();
  const chatBox = document.getElementById('chat-messages');
  chatBox.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.textContent = `${msg.username}: ${msg.text}`;
    chatBox.appendChild(div);
  });
  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send a new message
document.getElementById('chat-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, text })
  });
  input.value = '';
  loadMessages();
});

// Load messages initially and every 2 seconds
loadMessages();
setInterval(loadMessages, 2000);
