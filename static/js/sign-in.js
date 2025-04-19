        // Form validation and handling
        document.addEventListener('DOMContentLoaded', function() {
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const strengthMeter = document.getElementById('strength-meter');
            const strengthText = document.getElementById('strength-text');
            const dobInput = document.getElementById('dob');
            const signupForm = document.getElementById('signup-form');
            const successMessage = document.querySelector('.success-message');
            const errorMessage = document.querySelector('.error-message');
            
            // Set max date for DOB (18 years ago from today)
            const today = new Date();
            const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            const maxDate = eighteenYearsAgo.toISOString().split('T')[0];
            dobInput.setAttribute('max', maxDate);
            
            // Password strength checker
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                if (password.length >= 8) {
                    strength += 1;
                }
                
                if (password.match(/[A-Z]/)) {
                    strength += 1;
                }
                
                if (password.match(/[0-9]/)) {
                    strength += 1;
                }
                
                if (password.match(/[^A-Za-z0-9]/)) {
                    strength += 1;
                }
                
                switch (strength) {
                    case 0:
                        strengthMeter.className = 'strength-meter-fill';
                        strengthMeter.style.width = '0';
                        strengthText.textContent = 'Not entered';
                        break;
                    case 1:
                        strengthMeter.className = 'strength-meter-fill weak';
                        strengthText.textContent = 'Weak';
                        break;
                    case 2:
                    case 3:
                        strengthMeter.className = 'strength-meter-fill medium';
                        strengthText.textContent = 'Medium';
                        break;
                    case 4:
                        strengthMeter.className = 'strength-meter-fill strong';
                        strengthText.textContent = 'Strong';
                        break;
                }
            });
            
<<<<<<< HEAD
          
=======
            // Form submission
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate required fields
                const requiredFields = signupForm.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = 'red';
                        isValid = false;
                    } else {
                        field.style.borderColor = '';
                    }
                });
>>>>>>> f51d4bcb1a821131ee632c145d119a1d52e02afc
                
                // Check DOB for age verification
                if (dobInput.value) {
                    const dobDate = new Date(dobInput.value);
                    const today = new Date();
                    let age = today.getFullYear() - dobDate.getFullYear();
                    const monthDiff = today.getMonth() - dobDate.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                        age--;
                    }
                    
                    if (age < 18) {
                        dobInput.style.borderColor = 'red';
                        alert("You must be at least 18 years old to register.");
                        isValid = false;
                    } else {
                        dobInput.style.borderColor = '';
                    }
                }
                
                // Validate password fields
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.style.borderColor = 'red';
                    errorMessage.textContent = "Passwords do not match. Please try again.";
                    errorMessage.style.display = 'block';
                    
                    setTimeout(function() {
                        errorMessage.style.display = 'none';
                    }, 3000);
                    
                    return;
                }
                
                // Password strength validation
                if (strengthText.textContent === 'Weak') {
                    passwordInput.style.borderColor = 'red';
                    errorMessage.textContent = "Please create a stronger password.";
                    errorMessage.style.display = 'block';
                    
                    setTimeout(function() {
                        errorMessage.style.display = 'none';
                    }, 3000);
                    
                    return;
                }
                
                if (isValid) {
                    // If everything is valid, show success message
                    successMessage.textContent = "Account created successfully! Redirecting to login...";
                    successMessage.style.display = 'block';
                    
                    // In a real app, you would submit the form data to a server here
                    // For demo purposes, we'll just simulate a redirect after 3 seconds
                    setTimeout(function() {
                        alert("Form submitted successfully! In a real application, you would be redirected to login page.");
                        // window.location.href = 'login.html'; // Uncomment in real implementation
                    }, 3000);
                } else {
                    errorMessage.textContent = "Please fill in all required fields correctly.";
                    errorMessage.style.display = 'block';
                    
                    // Hide error message after 3 seconds
                    setTimeout(function() {
                        errorMessage.style.display = 'none';
                    }, 3000);
                }
<<<<<<< HEAD
            
        });


        async function speakText() {
            const text = document.getElementById('content').innerText;
            const lang = document.getElementById('language').value;
          
            const response = await fetch('/tts/speak', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, lang })
            });
          
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
          
            const audio = new Audio(audioUrl);
            audio.play();
          }
=======
            });
        });
>>>>>>> f51d4bcb1a821131ee632c145d119a1d52e02afc
