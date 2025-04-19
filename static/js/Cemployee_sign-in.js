        const countrySelect = document.getElementById('country');
        const stateSelect = document.getElementById('state');
        const districtSelect = document.getElementById('district');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordStrength = document.getElementById('passwordStrength');
        const passwordMatch = document.getElementById('passwordMatch');
        const signInForm = document.getElementById('signInForm');
        const createAccountBtn = document.querySelector('.create-account-btn');

        if (!countrySelect || !stateSelect || !districtSelect || !passwordInput || !confirmPasswordInput || !passwordStrength || !passwordMatch || !signInForm || !createAccountBtn) {
            console.error('One or more required DOM elements are missing.');
            return;
        }

        // States data
        const states = {
            india: ["Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Karnataka", "Kerala", "Maharashtra", "Tamil Nadu", "Uttar Pradesh"],
            usa: ["California", "Florida", "New York", "Texas", "Washington"],
            uk: ["England", "Northern Ireland", "Scotland", "Wales"],
            canada: ["Alberta", "British Columbia", "Ontario", "Quebec"],
            australia: ["New South Wales", "Queensland", "Victoria", "Western Australia"]
        };

        // Districts data
        const districts = {
            "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
            "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
            "California": ["Los Angeles", "San Francisco", "San Diego"],
            "New York": ["New York City", "Buffalo", "Albany"],
            "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati"],
            "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
            "Texas": ["Houston", "Dallas", "Austin"],
            "England": ["London", "Manchester", "Birmingham"]
        };

        // Country change handler
        countrySelect.addEventListener('change', function () {
            stateSelect.innerHTML = '<option value="">Select State</option>';
            districtSelect.innerHTML = '<option value="">Select District</option>';

            const country = this.value;
            if (country && states[country]) {
                states[country].forEach(state => {
                    const option = document.createElement('option');
                    option.value = state;
                    option.textContent = state;
                    stateSelect.appendChild(option);
                });
            }
        });

        // State change handler
        stateSelect.addEventListener('change', function () {
            districtSelect.innerHTML = '<option value="">Select District</option>';

            const state = this.value;
            if (state && districts[state]) {
                districts[state].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
            }
        });

        // Aadhar number formatting
        document.getElementById('aadhar').addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 12) value = value.slice(0, 12);
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
            }
            e.target.value = value;
        });

        // Password strength checker
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            if (password.length === 0) {
                passwordStrength.textContent = '';
                passwordStrength.className = 'password-strength';
                return;
            }
            
            // Check password strength
            let strength = 0;
            if (password.length >= 8) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Display strength message
            if (strength < 2) {
                passwordStrength.textContent = 'Weak password';
                passwordStrength.className = 'password-strength weak';
            } else if (strength < 4) {
                passwordStrength.textContent = 'Medium strength password';
                passwordStrength.className = 'password-strength medium';
            } else {
                passwordStrength.textContent = 'Strong password';
                passwordStrength.className = 'password-strength strong';
            }
            
            // Check passwords match if confirm password has value
            if (confirmPasswordInput.value) {
                checkPasswordsMatch();
            }
        });

        // Check if passwords match
        confirmPasswordInput.addEventListener('input', checkPasswordsMatch);

        function checkPasswordsMatch() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword.length === 0) {
                passwordMatch.textContent = '';
                passwordMatch.className = 'password-match';
                return;
            }
            
            if (password === confirmPassword) {
                passwordMatch.textContent = 'Passwords match';
                passwordMatch.className = 'password-match match';
            } else {
                passwordMatch.textContent = 'Passwords do not match';
                passwordMatch.className = 'password-match';
            }
        }
