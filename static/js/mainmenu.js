// Get the dark mode toggle switch and body element
const toggleSwitch = document.getElementById('darkModeToggle');
const body = document.body;

// Check if dark mode is saved in localStorage and apply it
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleSwitch.checked = true; // Set the toggle to 'dark mode' state
}

// Toggle dark mode on checkbox change
toggleSwitch.addEventListener('change', function () {
    if (toggleSwitch.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Logout button functionality
document.getElementById("btnLogout").addEventListener("click", function() {
    fetch("{{ url_for('logout') }}", { method: 'POST' })
        .then(response => window.location.href = "{{ url_for('home') }}");
});