const API_BASE_URL = 'http://localhost:5000/api';

// Validation Patterns
const patterns = {
    email: /^[^@]+@[^@]+\.[^@]+$/,
    phone: /^\+?[0-9\s\-]{10,20}$/
};

// Form Logic
const form = document.getElementById('registrationForm');
if (form) {
    const inputs = form.querySelectorAll('input, select, textarea');

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (!isValid) return;

        const formData = {
            full_name: document.getElementById('full_name').value,
            designation: document.getElementById('designation').value,
            dob: document.getElementById('dob').value,
            skills: Array.from(document.getElementById('skills').selectedOptions).map(opt => opt.value),
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        const feedback = document.getElementById('form-feedback');
        const submitBtn = document.getElementById('submitBtn');

        try {
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                feedback.className = 'feedback-message success';
                feedback.textContent = result.message;
                form.reset();
            } else {
                feedback.className = 'feedback-message error';
                feedback.textContent = 'Error: ' + JSON.stringify(result.errors || result.message);
            }
        } catch (error) {
            feedback.className = 'feedback-message error';
            feedback.textContent = 'Network error. Please try again.';
        } finally {
            submitBtn.textContent = 'Submit Application';
            submitBtn.disabled = false;
        }
    });

    function validateField(input) {
        const errorSpan = document.getElementById(`error-${input.id}`);
        if (!errorSpan) return true;

        let message = '';
        if (input.required && !input.value.trim()) {
            message = 'This field is required';
        } else if (input.type === 'email' && !patterns.email.test(input.value)) {
            message = 'Please enter a valid email address';
        } else if (input.id === 'phone' && !patterns.phone.test(input.value)) {
            message = 'Please enter a valid phone number';
        }

        if (input.id === 'skills' && input.selectedOptions.length === 0) {
            message = 'Please select at least one skill';
        }

        errorSpan.textContent = message;
        return !message;
    }
}

// Submissions Table Logic
async function loadSubmissions() {
    const tableBody = document.querySelector('#submissionsTable tbody');
    if (!tableBody) return;

    try {
        tableBody.innerHTML = '<tr><td colspan="9">Loading...</td></tr>';

        const response = await fetch(`${API_BASE_URL}/submissions`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();

        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9">No submissions yet.</td></tr>';
            return;
        }

        data.forEach(sub => {
            const row = `
                <tr>
                    <td>${sub.id}</td>
                    <td>${sub.full_name}</td>
                    <td>${sub.designation}</td>
                    <td>${sub.dob}</td>
                    <td>${sub.skills}</td>
                    <td>${sub.email}</td>
                    <td>${sub.phone}</td>
                    <td>${sub.address}</td>
                    <td>${new Date(sub.created_at).toLocaleString()}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="9" style="color:red">Error loading data: ${error.message}</td></tr>`;
    }
}
