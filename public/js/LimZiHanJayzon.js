// Get the login form from login.html
const loginForm = document.getElementById('loginForm');

// Check whether the login form exists before adding an event listener
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        // Prevent the form from refreshing the page when submitted
        event.preventDefault();

        // A. Get the username entered by the user and remove extra spaces
        const username = document.getElementById('username').value.trim();

        try {
            // B. Send the username to the backend for login verification
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            // C. Convert the backend response into a JavaScript object
            const result = await response.json();

            // D. Check whether the login request was successful
            if (response.ok) {
                // Redirect the user to the main dashboard
                window.location.href = '/';
            } else {
                // Display the error message returned by the backend
                const loginMessage = document.getElementById('loginMessage');
                loginMessage.textContent = result.message;
                loginMessage.className = 'alert alert-error';
            }
        } catch (error) {
            // E. Display an error if the server cannot be reached
            const loginMessage = document.getElementById('loginMessage');
            loginMessage.textContent = 'Unable to connect to the server. Please try again.';
            loginMessage.className = 'alert alert-error';

            // Display the error in the browser console for debugging
            console.error('Login error:', error);
        }
    });
}

// Get the signup form from signup.html
const signupForm = document.getElementById('signupForm');

// Check whether the signup form exists before adding an event listener
if (signupForm) {
    signupForm.addEventListener('submit', async function(event) {
        // Prevent the form from refreshing the page when submitted
        event.preventDefault();

        // A. Get the username entered by the user and remove extra spaces
        const username = document.getElementById('signupUsername').value.trim();

        try {
            // B. Send the username to the backend for account creation
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            // C. Convert the backend response into a JavaScript object
            const result = await response.json();

            // D. Check whether the account was created successfully
            const signupMessage = document.getElementById('signupMessage');

            if (response.ok) {
                // Display a success message after account creation
                signupMessage.textContent = 'Account created successfully. You can now log in.';
                signupMessage.className = 'alert alert-success';
            } else {
                // Display the error message returned by the backend
                signupMessage.textContent = result.message;
                signupMessage.className = 'alert alert-error';
            }
        } catch (error) {
            // E. Display an error if the server cannot be reached
            const signupMessage = document.getElementById('signupMessage');
            signupMessage.textContent = 'Unable to connect to the server. Please try again.';
            signupMessage.className = 'alert alert-error';

            // Display the error in the browser console for debugging
            console.error('Signup error:', error);
        }
    });
}