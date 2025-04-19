const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const districtSelect = document.getElementById('district');

const states = {
    india: ["Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Karnataka", "Kerala", "Maharashtra", "Tamil Nadu", "Uttar Pradesh"],
    usa: ["California", "Florida", "New York", "Texas", "Washington"],
    uk: ["England", "Northern Ireland", "Scotland", "Wales"],
    canada: ["Alberta", "British Columbia", "Ontario", "Quebec"],
    australia: ["New South Wales", "Queensland", "Victoria", "Western Australia"]
};

const districts = {
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "California": ["Los Angeles", "San Francisco", "San Diego"],
    "New York": ["New York City", "Buffalo", "Albany"]
};

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

document.getElementById('signInForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Form submitted successfully!');
});

document.getElementById('aadhar').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);
    if (value.length > 0) {
        value = value.match(/.{1,4}/g).join(' ');
    }
    e.target.value = value;
});
