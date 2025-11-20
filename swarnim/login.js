// Show/hide password
  document.getElementById('login-toggle').addEventListener('click', () => {
    const pw = document.getElementById('login-password');
    pw.type = pw.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('signup-toggle').addEventListener('click', () => {
    const pw = document.getElementById('signup-password');
    pw.type = pw.type === 'password' ? 'text' : 'password';
  });

  // Toggle forms
  function toggleForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
  }

  // Simple localStorage user simulation
  function signup() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorDiv = document.getElementById('signup-error');

    if(!username || !email || !password){
      errorDiv.textContent = "Please fill all fields!";
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if(users[email]){
      errorDiv.textContent = "Email already registered!";
      return;
    }

    users[email] = { username, password };
    localStorage.setItem('users', JSON.stringify(users));
    errorDiv.textContent = "Signup successful! You can login now.";
  }

  function login() {
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if(users[email] && users[email].password === password){
      errorDiv.style.color = 'green';
      errorDiv.textContent = "Login successful!";
      if(document.getElementById('remember-login').checked){
        localStorage.setItem('loggedInUser', email);
      }
    } else {
      errorDiv.style.color = 'red';
      errorDiv.textContent = "Invalid email or password!";
    }
  }

