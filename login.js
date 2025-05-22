document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Make sure these IDs match your login form fields
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // Try to parse JSON response
    const data = await response.json();

    if (response.ok) {
      alert('Login successful!');
      // Save user ID for later use (e.g., for chat)
      localStorage.setItem('userId', data.user.id);
      // Redirect to profile page
      window.location.href = 'profile.html';
    } else {
      alert('Login failed: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed: ' + error.message);
  }
});

