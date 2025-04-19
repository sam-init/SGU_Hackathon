// Functions for handling login and signup
function login(event) {
    event.preventDefault();
    const userInput = document.getElementById('user-input').value;
    const password = document.getElementById('password').value;
    
    if (!userInput || !password) {
      alert("Please enter both email/phone and password");
      return;
    }
    
    // Here you would typically send the login data to a server
    console.log("Login attempt with:", userInput);
    alert("Login successful! Redirecting to your dashboard...");
    // Redirect logic would go here
  }
  
  function signUp() {
    // Redirect to signup page
    console.log("Redirecting to signup page");
    alert("Redirecting to sign up page...");
    // Redirect logic would go here
  }
  