// Auth UI - Update login link based on authentication state
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
});

function updateAuthUI() {
  const loginLink = document.getElementById('login-link');
  const userNameDisplay = document.getElementById('user-name-display');
  
  if (!loginLink) return;
  
  // Check if user is logged in (using localStorage token)
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (token && user.name) {
    // User is logged in
    loginLink.textContent = 'MI CUENTA';
    loginLink.href = 'account.html';
    
    // Optionally display user name
    if (userNameDisplay) {
      userNameDisplay.textContent = user.name;
      userNameDisplay.style.display = 'inline';
    }
  } else {
    // User is not logged in
    loginLink.textContent = 'Login';
    loginLink.href = 'account.html';
    
    // Hide user name display
    if (userNameDisplay) {
      userNameDisplay.style.display = 'none';
    }
  }
}

// Also update UI when authentication state changes
window.addEventListener('storage', function(e) {
  if (e.key === 'token' || e.key === 'user') {
    updateAuthUI();
  }
});

// Custom event for auth state changes
window.addEventListener('authStateChanged', updateAuthUI);
