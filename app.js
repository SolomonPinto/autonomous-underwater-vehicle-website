// Global variables
let rustingData = [];
let biofoulingData = [];
let environmentalData = [];
let trendChart = null;
let costChart = null;
let totalProjectCost = 0;
let componentsData = [];
// Detection logs + export
const detectionLogs = {}; // { 'YYYY-MM-DD': [rows...] }

function addDetectionLogEntry(entry) {
    const dateKey = entry.date;
    if (!detectionLogs[dateKey]) detectionLogs[dateKey] = [];
    detectionLogs[dateKey].push(entry);
    renderDetectionTable(dateKey);
}

function renderDetectionTable(dateKey) {
    const tbody = document.querySelector('#detection-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rows = detectionLogs[dateKey] || [];
    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${row.time}</td>
      <td>${row.rustLevel.toFixed(1)}</td>
      <td>${row.rustSeverity}</td>
      <td>${row.bioCoverage.toFixed(1)}</td>
      <td>${row.bioType}</td>
      <td>${row.totalArea.toFixed(1)}</td>
      <td>${row.monitor}</td>
    `;
        tbody.appendChild(tr);
    });
}

function getTodayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function exportTableToPrint(dateKey) {
    const rows = detectionLogs[dateKey] || [];
    const win = window.open('', '_blank');
    if (!win) return;

    const title = `AUV Detection Data - ${dateKey}`;
    const tableHtml = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 16px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { padding: 6px 8px; border: 1px solid #444; text-align: left; }
          thead { background: #111827; color: #fff; }
          tbody tr:nth-child(even) { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Rust Level (%)</th>
              <th>Rust Severity</th>
              <th>Biofouling Coverage (%)</th>
              <th>Biofouling Type</th>
              <th>Total Affected Area (cm²)</th>
              <th>Monitor Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td>${r.time}</td>
                <td>${r.rustLevel.toFixed(1)}</td>
                <td>${r.rustSeverity}</td>
                <td>${r.bioCoverage.toFixed(1)}</td>
                <td>${r.bioType}</td>
                <td>${r.totalArea.toFixed(1)}</td>
                <td>${r.monitor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
    win.document.write(tableHtml);
    win.document.close();
    win.focus();
    win.print();
}

// Application data from JSON
const projectData = {
    "project": {
        "title": "Autonomous Underwater Vehicle",
        "subtitle": "Advanced Maritime Inspection & Environmental Monitoring System",
        "description": "A cutting-edge AUV designed for underwater inspection, featuring real-time rusting detection and biofouling analysis capabilities.",
        "objectives": [
            "Develop autonomous navigation system for underwater environments",
            "Implement computer vision for rusting detection",
            "Create biofouling analysis algorithms",
            "Enable real-time data transmission via Telegram",
            "Design cost-effective underwater inspection solution"
        ]
    },
    "specifications": {
        "Length": "1.2 meters",
        "Width": "0.6 meters",
        "Depth Rating": "50 meters",
        "Battery Life": "4-6 hours",
        "Communication": "Wireless & Telegram API",
        "Sensors": "Camera, Pressure,",
        "Navigation": "GPS, IMU, Depth Sensor"
    },
    "materials": [{
            "category": "Hull & Structure",
            "items": [{
                    "name": "HDPE-Material",
                    "quantity": "set",
                    "cost": 10000,
                    "description": "Main structural frame with corrosion resistance",
                    "icon": "🔧"
                },
                {
                    "name": "Vacume Encolser",
                    "quantity": "Set",
                    "cost": 45,
                    "description": "Complete sealing system",
                    "icon": "⭕"
                }
            ]
        },
        {
            "category": "Electronics & Control",
            "items": [{
                    "name": "Arduino Uno",
                    "quantity": 1,
                    "cost": 800,
                    "description": "Ontrolles the process",
                    "icon": "🔌"
                },
                {
                    "name": "Power Management Board",
                    "quantity": 1,
                    "cost": 500,
                    "description": "Voltage regulation and distribution",
                    "icon": "⚡"
                }
            ]
        },
        {
            "category": "Sensors & Vision",
            "items": [{
                    "name": "Waterproof HD Camera",
                    "quantity": 1,
                    "cost": 120,
                    "description": "1080p cameras for visual inspection",
                    "icon": "📷"
                },
                {
                    "name": "Ultra Sonic Sensor (0-10 bar)",
                    "quantity": 2,
                    "cost": 35,
                    "description": "Depth measurement and monitoring",
                    "icon": "📊"
                },
            ]
        },
        {
            "category": "Propulsion & Movement",
            "items": [{
                    "name": "DC 775",
                    "quantity": 4,
                    "cost": 300,
                    "description": "High-efficiency underwater propulsion",
                    "icon": "🚁"
                },
                {
                    "name": "Motor Drive Controller",
                    "quantity": 1,
                    "cost": 100,
                    "description": "Motor speed and direction control",
                    "icon": "⚙️"
                },
                {
                    "name": "Propeller",
                    "quantity": 4,
                    "cost": 30,
                    "description": "Optimized underwater propellers",
                    "icon": "🔄"
                }
            ]
        },
        {
            "category": "Power & Communication",
            "items": [{
                    "name": "LiPo Battery 5000mAh 4S",
                    "quantity": 1,
                    "cost": 80,
                    "description": "High-capacity lithium polymer batteries",
                    "icon": "🔋"
                },
                {
                    "name": "Wireless Communication Module",
                    "quantity": 1,
                    "cost": 40,
                    "description": "Long-range data transmission",
                    "icon": "📡"
                },
                {
                    "name": "Emergency Buoyancy System",
                    "quantity": 1,
                    "cost": 60,
                    "description": "Safety recovery mechanism",
                    "icon": "🎈"
                }
            ]
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing AUV Dashboard...');
    
    // Check if Chart.js is available
    if (typeof Chart !== 'undefined') {
        console.log('✅ Chart.js loaded successfully');
    } else {
        console.error('❌ Chart.js not loaded');
    }
    
    initializeNavigation();
    initializeLiveData();
    initializeChart();
    initializeMaterialsSection();
    initialize3DModelViewer();
    initializeContactForm();
    initializeModals();
    initializeAnimations();
    calculateTotalCost();
    
    console.log('✅ Dashboard initialization complete');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to highlight active nav item and navbar
    window.addEventListener('scroll', () => {
        highlightActiveNavItem();
        updateNavbarBackground();
    });
}

function highlightActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 50;

    if (scrolled) {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.9)';
        navbar.style.boxShadow = 'none';
    }
}

// Live data initialization - Telegram only mode
function initializeLiveData() {
    // Initialize with default values - no simulation
    initializeDefaultValues();
    
    // Only update from Telegram data - no automatic generation
    console.log('🤖 Live data initialized - Telegram only mode');
    console.log('📡 Waiting for real AUV data from Telegram bot...');
}

function initializeDefaultValues() {
    // Set initial static values
    const rustLabel = document.getElementById('rusting-percent');
    const bioLabel = document.getElementById('biofouling-percent');
    
    if (rustLabel) rustLabel.textContent = '0%';
    if (bioLabel) bioLabel.textContent = '0%';
    
    // Set initial rates
    const rustingRateEl = document.getElementById('rusting-rate');
    const biofoulingRateEl = document.getElementById('biofouling-rate');
    
    if (rustingRateEl) rustingRateEl.textContent = '0.0 μm/day';
    if (biofoulingRateEl) biofoulingRateEl.textContent = '0.0 cm²/day';
    
    // Update connection status
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus) {
        connectionStatus.innerHTML = '🟡 Waiting for AUV Data';
        connectionStatus.className = 'status status--warning';
    }
    
    // Update last updated time
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        lastUpdated.textContent = 'Never';
    }
}

// Real data update function - called only by Telegram integration
function updateLiveDataFromTelegram(data) {
    const currentTime = new Date();
    
    // Update modern gauges with real data
    if (typeof updateModernGauge === 'function') {
        updateModernGauge('rusting', data.corrosion.rustLevel);
        updateModernGauge('biofouling', data.biofouling.coverage);
    }

    // Update percentage labels with real data
    const rustLabel = document.getElementById('rusting-percent');
    const bioLabel = document.getElementById('biofouling-percent');

    if (rustLabel) rustLabel.textContent = data.corrosion.rustLevel.toFixed(1) + '%';
    if (bioLabel) bioLabel.textContent = data.biofouling.coverage.toFixed(1) + '%';

    // Update numerical values with real data
    const rustingRateEl = document.getElementById('rusting-rate');
    const biofoulingRateEl = document.getElementById('biofouling-rate');
    
    if (rustingRateEl) rustingRateEl.textContent = `${(data.corrosion.rustLevel * 0.08).toFixed(2)} μm/day`;
    if (biofoulingRateEl) biofoulingRateEl.textContent = `${(data.biofouling.coverage * 0.15).toFixed(1)} cm²/day`;

    // Update severity and type
    const severityEl = document.querySelector('.metric-value.severity-low');
    if (severityEl) severityEl.textContent = data.corrosion.severity;
    
    const bioTypeEl = document.querySelector('#biofouling-type');
    if (bioTypeEl) bioTypeEl.textContent = data.biofouling.type;

    // Store data for chart with real timestamp
    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    rustingData.push({
        time: timeString,
        value: data.corrosion.rustLevel
    });
    biofoulingData.push({
        time: timeString,
        value: data.biofouling.coverage
    });

    // Keep only last 30 data points for better visualization
    if (rustingData.length > 30) {
        rustingData.shift();
        biofoulingData.shift();
    }

    // Update chart with real data
    updateChart();

    // Update connection status to show we received real data
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus) {
        connectionStatus.innerHTML = '🟢 Receiving AUV Data';
        connectionStatus.className = 'status status--success';
    }

    // Update last updated time
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        lastUpdated.textContent = currentTime.toLocaleTimeString();
    }

    // Log real data entry into the Detection Data table
    if (typeof addDetectionLogEntry === 'function') {
        addDetectionLogEntry({
            date: currentTime.toISOString().slice(0, 10),
            time: currentTime.toLocaleTimeString('en-GB', {
                hour12: false
            }),
            rustLevel: data.corrosion.rustLevel,
            rustSeverity: data.corrosion.severity,
            bioCoverage: data.biofouling.coverage,
            bioType: data.biofouling.type,
            totalArea: data.totalAffectedArea || 0,
            monitor: data.monitor || 'TELEGRAM'
        });
    }

    console.log('📊 Dashboard updated with real Telegram data:', data);
}

// Chart initialization and updates
function initializeChart() {
    const ctx = document.getElementById('trend-chart');
    if (!ctx) {
        console.error('Chart canvas element not found');
        return;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    try {
        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                        label: 'Rusting Detection Rate (%)',
                        data: [],
                        borderColor: '#0f4c75',
                        backgroundColor: 'rgba(15, 76, 117, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#00d4ff',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Biofouling Detection Rate (%)',
                        data: [],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#ff6b35',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Historical Trend Analysis - Waiting for Data',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        color: '#ffffff'
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            },
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            color: '#ffffff',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff',
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Detection Rate (%)',
                            color: '#ffffff',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff',
                            stepSize: 20
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });

        console.log('📊 Chart initialized successfully - waiting for Telegram data');
        
        // Initialize chart controls
        initializeChartControls();
        
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}

function initializeChartControls() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Here you could implement different time periods
            const period = this.getAttribute('data-period');
            console.log(`Switching to ${period} view`);
        });
    });
}

function generateInitialData() {
    const now = new Date();

    // Generate last 20 data points
    for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * 15000)); // 15 second intervals
        const timeString = time.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const rustingValue = 10 + Math.random() * 25 + Math.sin(i / 5) * 8;
        const biofoulingValue = 25 + Math.random() * 30 + Math.cos(i / 4) * 10;

        rustingData.push({
            time: timeString,
            value: Math.max(0, Math.min(100, rustingValue))
        });

        biofoulingData.push({
            time: timeString,
            value: Math.max(0, Math.min(100, biofoulingValue))
        });
    }

    updateChart();
}

function updateChart() {
    if (!trendChart) {
        console.warn('Chart not initialized');
        return;
    }

    try {
        // Update chart data
        trendChart.data.labels = rustingData.map(d => d.time);
        trendChart.data.datasets[0].data = rustingData.map(d => d.value);
        trendChart.data.datasets[1].data = biofoulingData.map(d => d.value);

        // Update chart title based on data availability
        if (rustingData.length > 0) {
            trendChart.options.plugins.title.text = 'Historical Trend Analysis - Live Data';
        } else {
            trendChart.options.plugins.title.text = 'Historical Trend Analysis - Waiting for Data';
        }

        trendChart.update('none'); // No animation for real-time updates
        
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// Materials section functionality
function initializeMaterialsSection() {
    // Flatten materials data for easier handling
    componentsData = [];
    projectData.materials.forEach(category => {
        category.items.forEach(item => {
            componentsData.push({
                ...item,
                category: category.category
            });
        });
    });

    renderComponents();
    initializeFilters();
    initializeCostBreakdown();
}

function renderComponents(filter = 'all') {
    const grid = document.getElementById('components-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filteredComponents = filter === 'all' ?
        componentsData :
        componentsData.filter(comp => comp.category === filter);

    filteredComponents.forEach((component, index) => {
        const card = createComponentCard(component, index);
        grid.appendChild(card);

        // Add staggered animation
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 100);
    });

    updateFilteredCost(filteredComponents);
}

function createComponentCard(component, index) {
    const card = document.createElement('div');
    card.className = 'glass-card component-card';
    card.style.opacity = '0';

    const totalCost = typeof component.quantity === 'number' ?
        component.cost * component.quantity :
        component.cost;

    card.innerHTML = `
        <div class="component-header">
            <div class="component-icon">${component.icon}</div>
            <div class="component-title">
                <h3 class="component-name">${component.name}</h3>
                <p class="component-category">${component.category}</p>
            </div>
        </div>
        <div class="component-badges">
            <span class="component-badge badge-quantity">
                Qty: ${component.quantity}
            </span>
            <span class="component-badge badge-cost">
                ₹${totalCost}
            </span>
        </div>
        <p class="component-description">${component.description}</p>
    `;

    // Add hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    return card;
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            renderComponents(category);
        });
    });
}

function updateFilteredCost(components) {
    const totalCost = components.reduce((sum, comp) => {
        return sum + (typeof comp.quantity === 'number' ? comp.cost * comp.quantity : comp.cost);
    }, 0);

    const costElement = document.getElementById('total-cost');
    if (costElement) {
        animateValue(costElement, 0, totalCost, 800, '₹');
    }
}

function calculateTotalCost() {
    totalProjectCost = componentsData.reduce((sum, comp) => {
        return sum + (typeof comp.quantity === 'number' ? comp.cost * comp.quantity : comp.cost);
    }, 0);

    const costElement = document.getElementById('total-cost');
    if (costElement) {
        costElement.textContent = `₹${totalProjectCost}`;
    }
}

function initializeCostBreakdown() {
    const breakdownBtn = document.getElementById('breakdown-toggle');
    if (breakdownBtn) {
        breakdownBtn.addEventListener('click', showCostBreakdownModal);
    }
}

function showCostBreakdownModal() {
    const modal = document.getElementById('cost-modal');
    if (modal) {
        modal.classList.remove('hidden');
        renderCostChart();
        renderDetailedBreakdown();
    }
}

function renderCostChart() {
    const ctx = document.getElementById('cost-chart');
    if (!ctx) return;

    // Calculate costs by category
    const categoryTotals = {};
    projectData.materials.forEach(category => {
        const total = category.items.reduce((sum, item) => {
            return sum + (typeof item.quantity === 'number' ? item.cost * item.quantity : item.cost);
        }, 0);
        categoryTotals[category.category] = total;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = ['#0f4c75', '#f39c12', '#00ff88', '#ff6b35', '#00d4ff'];

    if (costChart) {
        costChart.destroy();
    }

    costChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#1a1a2e',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function renderDetailedBreakdown() {
    const container = document.getElementById('detailed-breakdown');
    if (!container) return;

    container.innerHTML = '';

    projectData.materials.forEach((category, index) => {
        const categoryTotal = category.items.reduce((sum, item) => {
            return sum + (typeof item.quantity === 'number' ? item.cost * item.quantity : item.cost);
        }, 0);

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-breakdown';
        categoryDiv.style.marginBottom = '20px';

        categoryDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <h4 style="margin: 0; color: #0f4c75;">${category.category}</h4>
                <span style="font-weight: bold; color: #f39c12;">₹${categoryTotal}</span>
            </div>
        `;

        category.items.forEach(item => {
            const itemCost = typeof item.quantity === 'number' ? item.cost * item.quantity : item.cost;
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; color: rgba(255,255,255,0.8); font-size: 14px;';
            itemDiv.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span>₹${itemCost}</span>
            `;
            categoryDiv.appendChild(itemDiv);
        });

        container.appendChild(categoryDiv);
    });
}

// Modal functionality
function initializeModals() {
    const modal = document.getElementById('cost-modal');
    const closeBtn = document.getElementById('modal-close');
    const overlay = modal?.querySelector('.modal-overlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    const submitButton = contactForm.querySelector('.btn');
    if (!submitButton) return;

    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleContactSubmission();
    });
}

function handleContactSubmission() {
    const nameInput = document.querySelector('.contact-form input[type="text"]');
    const emailInput = document.querySelector('.contact-form input[type="email"]');
    const messageTextarea = document.querySelector('.contact-form textarea');
    const submitButton = document.querySelector('.contact-form .btn');

    // Basic validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageTextarea.value.trim()) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending... 📤';
    submitButton.disabled = true;

    setTimeout(() => {
        // Reset form
        nameInput.value = '';
        emailInput.value = '';
        messageTextarea.value = '';

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        showNotification('Message sent successfully! We\'ll get back to you soon. 🚀', 'success');
    }, 2000);
}

// Animation system
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToObserve = document.querySelectorAll('.glass-card, .timeline-item, .team-card');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const difference = end - start;

    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (difference * easedProgress);

        element.textContent = suffix + Math.round(currentValue * 100) / 100 + (suffix === '₹' ? '' : suffix);

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }

    requestAnimationFrame(updateValue);
}

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification status status--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 2001;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 500;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 300px;
    `;

    // Set colors based on type
    if (type === 'success') {
        notification.style.background = 'rgba(0, 255, 136, 0.2)';
        notification.style.borderColor = 'rgba(0, 255, 136, 0.3)';
        notification.style.color = '#00ff88';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 107, 53, 0.2)';
        notification.style.borderColor = 'rgba(255, 107, 53, 0.3)';
        notification.style.color = '#ff6b35';
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring for Telegram updates
function initializePerformanceMonitoring() {
    let updateTimes = [];

    const originalUpdateFunction = updateLiveDataFromTelegram;
    updateLiveDataFromTelegram = function(data) {
        const start = performance.now();
        originalUpdateFunction(data);
        const end = performance.now();

        updateTimes.push(end - start);

        if (updateTimes.length > 10) {
            updateTimes.shift();
        }

        const avgTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;
        if (avgTime > 50) {
            console.warn(`Telegram data update taking ${avgTime.toFixed(2)}ms on average`);
        }
    };
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + D for dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('dashboard').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Alt + M for materials
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        document.getElementById('materials').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Alt + T for team
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        document.getElementById('team').scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);

    if (e.error && e.error.message && e.error.message.includes('Chart')) {
        showNotification('Chart loading error. Please refresh the page.', 'error');
    }
});

// Resize handler
window.addEventListener('resize', debounce(() => {
    if (trendChart) {
        trendChart.resize();
    }
    if (costChart) {
        costChart.resize();
    }
}, 250));

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateLiveDataFromTelegram,
        updateModernGauge,
        showNotification,
        renderComponents,
        calculateTotalCost
    };
}
// Simple 3D AUV Model Viewer (no external libs)
class AUV3DViewer {
    constructor() {
        this.canvas = document.getElementById('auv-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        // basic state
        this.rotation = 0;
        this.zoom = 1;
        this.viewMode = 'external';
        this.activeAxis = 'x';

        this.handleResize = this.resize.bind(this);
        window.addEventListener('resize', this.handleResize);

        this.resize();
        this.setupControls();
        this.setupMouseControls();
        this.animate();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    setupControls() {
        const viewModeEl = document.getElementById('view-mode');
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        const resetBtn = document.getElementById('reset-view');

        if (viewModeEl) {
            viewModeEl.addEventListener('change', e => {
                this.viewMode = e.target.value;
            });
        }

        if (zoomSlider && zoomValue) {
            zoomSlider.addEventListener('input', e => {
                this.zoom = parseFloat(e.target.value);
                zoomValue.textContent = Math.round(this.zoom * 100) + '%';
            });
        }

        document.querySelectorAll('.axis-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                document.querySelectorAll('.axis-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.activeAxis = e.currentTarget.dataset.axis;
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.rotation = 0;
                this.zoom = 1;
                if (zoomSlider) {
                    zoomSlider.value = '1';
                    zoomValue.textContent = '100%';
                }
            });
        }
    }

    setupMouseControls() {
        let isDragging = false;
        let lastX = 0;

        this.canvas.addEventListener('mousedown', e => {
            isDragging = true;
            lastX = e.clientX;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            lastX = e.clientX;
            this.rotation += dx * 0.01;
        });

        this.canvas.addEventListener('wheel', e => {
            e.preventDefault();
            const factor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom = Math.min(3, Math.max(0.5, this.zoom * factor));
            const zoomSlider = document.getElementById('zoom-slider');
            const zoomValue = document.getElementById('zoom-value');
            if (zoomSlider && zoomValue) {
                zoomSlider.value = this.zoom.toFixed(1);
                zoomValue.textContent = Math.round(this.zoom * 100) + '%';
            }
        }, {
            passive: false
        });
    }

    // THIS FUNCTION FIXES YOUR ERROR
    renderAUV() {
        const ctx = this.ctx;
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.rotate(this.rotation);

        // AUV main body
        ctx.fillStyle = '#00d4ff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-150, -40, 300, 80, 40);
        ctx.fill();
        ctx.stroke();

        // nose
        ctx.beginPath();
        ctx.moveTo(150, -40);
        ctx.lineTo(190, 0);
        ctx.lineTo(150, 40);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // tail
        ctx.beginPath();
        ctx.moveTo(-150, -40);
        ctx.lineTo(-190, -70);
        ctx.lineTo(-190, 70);
        ctx.lineTo(-150, 40);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // camera window
        ctx.fillStyle = '#16213e';
        ctx.beginPath();
        ctx.arc(60, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // highlight active axis
        if (this.activeAxis === 'x') ctx.strokeStyle = '#ff6b35';
        else if (this.activeAxis === 'y') ctx.strokeStyle = '#00ff88';
        else ctx.strokeStyle = '#f39c12';

        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-200, 0);
        ctx.lineTo(220, 0);
        ctx.stroke();

        ctx.restore();
    }

    animate() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.ctx.clearRect(0, 0, w, h);
        this.renderAUV();
        requestAnimationFrame(() => this.animate());
    }
}

// init
//document.addEventListener('DOMContentLoaded', () => {
//  const canvas = document.getElementById('auv-canvas');
//  if (canvas) {
//    new AUV3DViewer();
//  }
//});


function addDetectionLogEntry(entry) {
    const dateKey = entry.date;
    if (!detectionLogs[dateKey]) detectionLogs[dateKey] = [];
    detectionLogs[dateKey].push(entry);
    renderDetectionTable(dateKey);
}

function renderDetectionTable(dateKey) {
    const tbody = document.querySelector('#detection-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rows = detectionLogs[dateKey] || [];
    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${row.time}</td>
      <td>${row.rustLevel.toFixed(1)}</td>
      <td>${row.rustSeverity}</td>
      <td>${row.bioCoverage.toFixed(1)}</td>
      <td>${row.bioType}</td>
      <td>${row.totalArea.toFixed(1)}</td>
      <td>${row.monitor}</td>
    `;
        tbody.appendChild(tr);
    });
}

function getTodayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function exportTableToPrint(dateKey) {
    const rows = detectionLogs[dateKey] || [];
    const win = window.open('', '_blank');
    if (!win) return;

    const title = `AUV Detection Data - ${dateKey}`;
    const tableHtml = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 16px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { padding: 6px 8px; border: 1px solid #444; text-align: left; }
          thead { background: #111827; color: #fff; }
          tbody tr:nth-child(even) { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Rust Level (%)</th>
              <th>Rust Severity</th>
              <th>Biofouling Coverage (%)</th>
              <th>Biofouling Type</th>
              <th>Total Affected Area (cm²)</th>
              <th>Monitor Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td>${r.time}</td>
                <td>${r.rustLevel.toFixed(1)}</td>
                <td>${r.rustSeverity}</td>
                <td>${r.bioCoverage.toFixed(1)}</td>
                <td>${r.bioType}</td>
                <td>${r.totalArea.toFixed(1)}</td>
                <td>${r.monitor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
    win.document.write(tableHtml);
    win.document.close();
    win.focus();
    win.print();
}

// hook buttons
document.addEventListener('DOMContentLoaded', () => {
    const logDateInput = document.getElementById('log-date');
    const loadBtn = document.getElementById('load-logs');
    const downloadTodayBtn = document.getElementById('download-today');
    const downloadSelectedBtn = document.getElementById('download-selected');

    if (logDateInput) logDateInput.value = getTodayKey();

    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            const key = logDateInput.value || getTodayKey();
            renderDetectionTable(key);
        });
    }

    if (downloadTodayBtn) {
        downloadTodayBtn.addEventListener('click', () => {
            const key = getTodayKey();
            exportTableToPrint(key);
        });
    }

    if (downloadSelectedBtn) {
        downloadSelectedBtn.addEventListener('click', () => {
            const key = logDateInput.value || getTodayKey();
            exportTableToPrint(key);
        });
    }
});


// === Simple Three.js OBJ Viewer ===
function initOBJViewer() {
    const canvas = document.getElementById('auv-canvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050816);

    const camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 20, 60);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const light1 = new THREE.DirectionalLight(0xffffff, 1.0);
    light1.position.set(30, 50, 50);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(light2);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new THREE.OBJLoader();
    loader.load(
        'Media/finished_assembly.obj',
        function(obj) {
            obj.traverse(child => {
                if (child.isMesh && !child.material) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x00d4ff,
                        metalness: 0.2,
                        roughness: 0.4
                    });

                }
            });

            obj.position.set(0, -10, 0);
            obj.scale.set(0.5, 0.5, 0.5);
            scene.add(obj);
        },
        undefined,
        function(error) {
            console.error('Error loading OBJ:', error);
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const rect = canvas.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height, false);
    });
}

document.addEventListener('DOMContentLoaded', initOBJViewer);


// init
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('auv-canvas');
    if (canvas) {
        new AUV3DViewer();
    }
});
// Update ring fill using CSS custom properties
document.documentElement.style.setProperty(
    '--rusting-angle',
    (rustingRate * 3.6).toFixed(1) + 'deg'
);
document.documentElement.style.setProperty(
    '--bio-angle',
    (biofoulingRate * 3.6).toFixed(1) + 'deg'
);

// === Modern circular gauge updater ===
function updateModernGauge(type, value) {
    // Clamp 0–100
    const percent = Math.max(0, Math.min(100, value));

    // Pick correct elements
    const fillId = type === 'rusting' ? 'rusting-fill' : 'biofouling-fill';
    const gaugeId = type === 'rusting' ? 'rusting-gauge' : 'biofouling-gauge';
    const percentId = type === 'rusting' ? 'rusting-percent' : 'biofouling-percent';

    const fillEl = document.getElementById(fillId);
    const gaugeEl = document.getElementById(gaugeId);
    const percentEl = document.getElementById(percentId);

    if (!fillEl || !gaugeEl || !percentEl) return;

    // 0–100% -> 0–180deg (half‑circle)
    const angle = (percent / 100) * 180;

    // Colored arc
    fillEl.style.background = `conic-gradient(
        #00d4ff ${angle}deg,
        transparent 0deg
    )`;

    // Center text
    percentEl.textContent = percent.toFixed(2) + '%';
}
// Gallery functionality
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const isPhoto = item.classList.contains('photo-item');
                const isVideo = item.classList.contains('video-item');
                
                let shouldShow = false;
                
                switch(filter) {
                    case 'all':
                        shouldShow = true;
                        break;
                    case 'photos':
                        shouldShow = isPhoto;
                        break;
                    case 'videos':
                        shouldShow = isVideo;
                        break;
                }
                
                if (shouldShow) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });

    // Add click handlers for video items
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        const video = item.querySelector('.gallery-video');
        const placeholder = item.querySelector('.video-placeholder');
        
        if (video && placeholder) {
            item.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    placeholder.style.opacity = '0';
                } else {
                    video.pause();
                    placeholder.style.opacity = '1';
                }
            });
            
            // Reset placeholder when video ends
            video.addEventListener('ended', function() {
                placeholder.style.opacity = '1';
            });
        }
    });
}

// Add gallery initialization to the main DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    initializeGallery();
});
// Test function to verify chart is working (for debugging)
function testChartWithSampleData() {
    console.log('🧪 Testing chart with sample data...');
    
    // Add sample data points
    const sampleData = [
        { time: '10:00:00', rust: 15, bio: 25 },
        { time: '10:05:00', rust: 18, bio: 28 },
        { time: '10:10:00', rust: 12, bio: 22 },
        { time: '10:15:00', rust: 20, bio: 30 }
    ];
    
    sampleData.forEach(point => {
        rustingData.push({ time: point.time, value: point.rust });
        biofoulingData.push({ time: point.time, value: point.bio });
    });
    
    updateChart();
    console.log('✅ Sample data added to chart');
}

// Add keyboard shortcut to test chart (Ctrl+Shift+T)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        testChartWithSampleData();
    }
});
// Test function to verify chart functionality
function testChartWithSampleData() {
    console.log('🧪 Testing chart with sample data...');
    
    // Add sample data points
    const sampleData = [
        { time: '10:00:00', rusting: 15, biofouling: 25 },
        { time: '10:05:00', rusting: 18, biofouling: 28 },
        { time: '10:10:00', rusting: 22, biofouling: 32 },
        { time: '10:15:00', rusting: 19, biofouling: 29 },
        { time: '10:20:00', rusting: 25, biofouling: 35 }
    ];
    
    sampleData.forEach(point => {
        rustingData.push({ time: point.time, value: point.rusting });
        biofoulingData.push({ time: point.time, value: point.biofouling });
    });
    
    updateChart();
    console.log('✅ Sample data added to chart');
}

// Add keyboard shortcut to test chart (Ctrl+Shift+T)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        testChartWithSampleData();
    }
});

// 3D Model Viewer Functionality
function initialize3DModelViewer() {
    const modelImage = document.getElementById('model-image');
    const viewLabel = document.getElementById('view-label');
    const viewButtons = document.querySelectorAll('.view-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (!modelImage || !viewButtons.length) {
        console.log('3D Model viewer elements not found');
        return;
    }
    
    console.log('🎯 Initializing 3D Model Viewer...');
    
    // View data mapping
    const viewData = {
        front: { label: 'Front View', image: 'Media/auv_test1.png' },
        back: { label: 'Back View', image: 'Media/auv_test2.jpg' },
        left: { label: 'Left Side View', image: 'Media/auv_test3.jpeg' },
        right: { label: 'Right Side View', image: 'Media/auv_test1.png' },
        top: { label: 'Top View', image: 'Media/auv_test2.jpg' },
        bottom: { label: 'Bottom View', image: 'Media/auv_test3.jpeg' }
    };
    
    // Handle view button clicks
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            const imageUrl = this.dataset.image;
            
            if (!view || !viewData[view]) return;
            
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update image with fade effect
            modelImage.style.opacity = '0.5';
            
            setTimeout(() => {
                modelImage.src = imageUrl;
                modelImage.alt = `AUV 3D Model - ${viewData[view].label}`;
                viewLabel.textContent = viewData[view].label;
                
                // Fade back in
                modelImage.style.opacity = '1';
            }, 150);
            
            console.log(`📷 Switched to ${viewData[view].label}`);
        });
    });
    
    // Handle fullscreen functionality
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const modelDisplay = document.querySelector('.model-display');
            
            if (!document.fullscreenElement) {
                // Enter fullscreen
                if (modelDisplay.requestFullscreen) {
                    modelDisplay.requestFullscreen();
                } else if (modelDisplay.webkitRequestFullscreen) {
                    modelDisplay.webkitRequestFullscreen();
                } else if (modelDisplay.msRequestFullscreen) {
                    modelDisplay.msRequestFullscreen();
                }
                
                // Update button text
                this.innerHTML = `
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zM10 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 9 2.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 10 .5zM0 10a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
                    </svg>
                    Exit Fullscreen
                `;
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                // Reset button text when exiting fullscreen
                fullscreenBtn.innerHTML = `
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    Fullscreen
                `;
            }
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!document.querySelector('.model-viewer')) return;
        
        const currentActive = document.querySelector('.view-btn.active');
        const allButtons = Array.from(viewButtons);
        const currentIndex = allButtons.indexOf(currentActive);
        
        let nextIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : allButtons.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextIndex = currentIndex < allButtons.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'f':
            case 'F':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    fullscreenBtn?.click();
                }
                break;
        }
        
        if (nextIndex !== currentIndex) {
            allButtons[nextIndex].click();
        }
    });
    
    console.log('✅ 3D Model Viewer initialized successfully');
}