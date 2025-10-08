document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // Simple mock authentication
  if(email === 'admin@example.com' && password === 'password') {
    window.location.href = 'admin.html';
  } else {
    document.getElementById('error').textContent = 'Invalid credentials';
  }
});