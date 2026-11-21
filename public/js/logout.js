// Get the username saved during login
const username = localStorage.getItem('username');

// Display the logged-in username on the dashboard
const userProfile = document.getElementById('userProfile');

if (userProfile && username) {
    userProfile.textContent = username;
}

// Get the Logout button
const logoutButton = document.getElementById('logoutButton');

// Listen for clicks on the Logout button
if (logoutButton) {
    logoutButton.addEventListener('click', function() {

        // Remove the saved username
        localStorage.removeItem('username');

        // Redirect the user to the login page
        window.location.href = '/login.html';
    });
}