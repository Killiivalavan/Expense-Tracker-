// Global variable for the chart
let myPieChart = null;
let monthlyExpenseChart = null;

// Function to update the pie chart
async function updatePieChart() {
    try {
        console.log('Fetching data...');
        const response = await fetch('/dashboard/total_balance');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        const canvas = document.getElementById('pieChart');
        console.log('Canvas element:', canvas);
        
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        console.log('Canvas context:', ctx);

        if (myPieChart) {
            console.log('Destroying existing chart');
            myPieChart.destroy();
        }

        // Calculate remaining balance
        const remainingBalance = data.total_income - data.total_expense;

        console.log('Creating new chart with data:', {
            expenses: data.total_expense,
            remaining: remainingBalance
        });

        const currencySymbol = getCurrencySymbol();

        // Update balance display
        const balanceAmount = document.getElementById('balanceAmount');
        if (balanceAmount) {
            balanceAmount.textContent = `${currencySymbol}${Math.abs(remainingBalance).toFixed(2)}`;
            // Set color based on balance amount
            if (remainingBalance <= 0) {
                balanceAmount.className = 'balance-amount danger';
            } else if (remainingBalance <= 1000) {
                balanceAmount.className = 'balance-amount warning';
            } else {
                balanceAmount.className = 'balance-amount';
            }
        }

        myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Expenses', 'Remaining'],
                datasets: [{
                    data: [data.total_expense, remainingBalance],
                    backgroundColor: ['#E74C3C', '#2ECC71'],
                    borderWidth: 0.2,
                    cutout: '30%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${currencySymbol}${Math.abs(value).toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Chart created successfully');
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
    }
}

// Function to update the monthly expense chart
async function updateMonthlyExpenseChart() {
    try {
        let url = '/dashboard/monthly_expenses';
        const timePeriod = document.getElementById('timePeriod').value;
        
        if (timePeriod === 'custom') {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            if (startDate && endDate) {
                url += `?start_date=${startDate}&end_date=${endDate}`;
            } else {
                console.error('Start and end dates are required for custom range');
                return;
            }
        } else {
            url += `?days=${timePeriod}`;
        }

        console.log('Fetching expense data:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received expense data:', data);
        
        const canvas = document.getElementById('monthlyExpenseChart');
        console.log('Monthly expense canvas element:', canvas);
        
        if (!canvas) {
            console.error('Monthly expense canvas element not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (monthlyExpenseChart) {
            console.log('Destroying existing monthly expense chart');
            monthlyExpenseChart.destroy();
        }

        const currencySymbol = getCurrencySymbol();
        
        // Calculate minimum width based on number of data points
        const minWidth = Math.max(data.dates.length * 50, document.getElementById('monthlyExpenseChart').parentElement.offsetWidth);
        document.getElementById('monthlyExpenseChart').parentElement.style.width = `${minWidth}px`;
        
        monthlyExpenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.dates,
                datasets: [{
                    label: 'Daily Expenses',
                    data: data.amounts,
                    borderColor: '#E74C3C',
                    backgroundColor: 'rgba(231, 76, 60, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#E74C3C'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#333',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${currencySymbol}${value.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            display: true,
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45,
                            padding: 10,
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return currencySymbol + value;
                            },
                            padding: 10,
                            font: {
                                size: 12
                            }
                        },
                        border: {
                            display: false
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        bottom: 10,
                        left: 10
                    }
                }
            }
        });
        
        console.log('Monthly expense chart created successfully');
    } catch (error) {
        console.error('Error updating monthly expense chart:', error);
        console.error('Error stack:', error.stack);
    }
}

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing chart...');
    updatePieChart();
});

// Add event listeners for date range controls
document.addEventListener('DOMContentLoaded', function() {
    const timePeriodSelect = document.getElementById('timePeriod');
    const dateRangeSelector = document.getElementById('dateRangeSelector');
    const applyDateRange = document.getElementById('applyDateRange');

    if (timePeriodSelect) {
        timePeriodSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                dateRangeSelector.style.display = 'flex';
            } else {
                dateRangeSelector.style.display = 'none';
                updateMonthlyExpenseChart();
            }
        });
    }

    if (applyDateRange) {
        applyDateRange.addEventListener('click', updateMonthlyExpenseChart);
    }
});

// Make updatePieChart available globally
window.updatePieChart = updatePieChart;
// Make updateMonthlyExpenseChart available globally
window.updateMonthlyExpenseChart = updateMonthlyExpenseChart;