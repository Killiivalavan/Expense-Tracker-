// Theme toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('darkModeToggle');
    const body = document.body;

    // Debug log
    console.log('Theme toggle initialized');
    console.log('Initial dark mode state:', localStorage.getItem('darkMode'));

    // Check initial theme state
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        console.log('Dark mode enabled on load');
    }

    // Toggle theme
    toggleButton.addEventListener('click', function() {
        console.log('Toggle button clicked');
        body.classList.toggle('dark-mode');
        
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        
        console.log('Dark mode is now:', isDarkMode ? 'enabled' : 'disabled');
    });

    // Menu and Tab functionality
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const insightsTab = document.getElementById('insightsTab');
    const dashboardTab = document.getElementById('dashboardTab');
    const dashboardView = document.getElementById('dashboardView');
    const insightsView = document.getElementById('insightsView');

    // Show menu on hover
    menuBtn.addEventListener('mouseenter', function() {
        sideMenu.classList.add('show');
    });

    // Hide menu when mouse leaves both button and menu
    function hideMenu(e) {
        // Check if the mouse is not over the menu or the button
        if (!sideMenu.contains(e.relatedTarget) && !menuBtn.contains(e.relatedTarget)) {
            sideMenu.classList.remove('show');
        }
    }

    menuBtn.addEventListener('mouseleave', hideMenu);
    sideMenu.addEventListener('mouseleave', hideMenu);

    // Tab switching
    function switchToTab(tab) {
        // Update tab styles
        insightsTab.classList.remove('active');
        dashboardTab.classList.remove('active');
        tab.classList.add('active');

        // Show/hide views
        if (tab === insightsTab) {
            dashboardView.style.display = 'none';
            insightsView.style.display = 'block';
            updateMonthlyExpenseChart(); // Update the insights chart
        } else {
            dashboardView.style.display = 'block';
            insightsView.style.display = 'none';
            updatePieChart(); // Update the dashboard chart
        }
    }

    insightsTab.addEventListener('click', function() {
        switchToTab(insightsTab);
    });

    dashboardTab.addEventListener('click', function() {
        switchToTab(dashboardTab);
    });

    // Settings Panel functionality
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const closeSettings = document.getElementById('closeSettings');
    const currencySelect = document.getElementById('currency');

    // Set initial currency
    const currentCurrency = localStorage.getItem('currency') || 'USD';
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }

    // Open settings panel
    settingsBtn.addEventListener('click', function(e) {
        console.log('Settings button clicked');
        e.stopPropagation();
        settingsPanel.classList.add('show');
        settingsOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close settings panel
    function closeSettingsPanel() {
        console.log('Closing settings panel');
        settingsPanel.classList.remove('show');
        settingsOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeSettings.addEventListener('click', closeSettingsPanel);
    settingsOverlay.addEventListener('click', closeSettingsPanel);

    // Handle currency change
    currencySelect.addEventListener('change', function() {
        const currency = this.value;
        console.log('Currency changed to:', currency);
        localStorage.setItem('currency', currency);
        location.reload();
    });
});

// Logout form
document.getElementById('logoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        this.submit();
    }
});

// Add this to your existing mainmenu.js
function toggleForm(type) {
    const expenseForm = document.getElementById('expenseForm');
    const incomeForm = document.getElementById('incomeForm');
    
    if (type === 'expense') {
        expenseForm.style.display = expenseForm.style.display === 'none' ? 'block' : 'none';
        incomeForm.style.display = 'none';
    } else {
        incomeForm.style.display = incomeForm.style.display === 'none' ? 'block' : 'none';
        expenseForm.style.display = 'none';
    }
}

// Add these functions to your existing mainmenu.js
function toggleDeleteMode() {
    const checkboxColumns = document.querySelectorAll('.checkbox-column');
    const deleteControls = document.getElementById('delete-controls');
    const isVisible = checkboxColumns[0].style.display !== 'none';

    checkboxColumns.forEach(col => {
        col.style.display = isVisible ? 'none' : 'table-cell';
    });
    deleteControls.style.display = isVisible ? 'none' : 'flex';

    // Clear checkboxes when exiting delete mode
    if (isVisible) {
        document.querySelectorAll('.delete-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

async function deleteSelected() {
    const selectedBoxes = document.querySelectorAll('.delete-checkbox:checked');
    
    if (selectedBoxes.length === 0) {
        alert('Please select items to delete');
        return;
    }

    if (!confirm('Are you sure you want to delete the selected items?')) {
        return;
    }

    const deletePromises = Array.from(selectedBoxes).map(checkbox => {
        const id = checkbox.dataset.id;
        const type = checkbox.dataset.type;
        return fetch(`/${type}/delete_${type}/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    });

    try {
        await Promise.all(deletePromises);
        // Refresh the page to show updated list
        window.location.reload();
    } catch (error) {
        console.error('Error deleting items:', error);
        alert('There was an error deleting some items');
    }
}

// Function to get current currency symbol
function getCurrencySymbol() {
    const currency = localStorage.getItem('currency') || 'USD';
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'INR': '₹',
        'CNY': '¥',
        'AUD': '$',
        'CAD': '$'
    };
    return symbols[currency] || '$';
}


