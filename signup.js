document.getElementById('signup-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password')
    ? document.getElementById('signup-confirm-password').value
    : password; // fallback if no confirm field

  // Optional: Check password confirmation
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Signup successful! Please log in.');
      // Option 1: Redirect to login page
      window.location.href = 'login.html';
      // Option 2: If using a single page for login/signup, call showLogin();
      // showLogin();
    } else {
      alert('Signup failed: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Signup failed: ' + error.message);
  }
});
