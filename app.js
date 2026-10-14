/* =====================================================
   BUILDSMART — Application JavaScript
   ===================================================== */

'use strict';

// ============================================================
// GLOBAL STATE
// ============================================================
const State = {
  currentPage: 'dashboard',
  inventoryView: 'grid',
  inventoryCategory: 'all',
  inventorySearch: '',
  chartInstances: {},
};

// ============================================================
// DATA
// ============================================================
const DATA = {
  inventory: [
    { id: 'SKU001', name: 'Portland Cement 50kg', category: 'cement', stock: 420, maxStock: 600, reorderLevel: 80, price: 420, supplier: 'BuildMart Pro', icon: '🧱', sku: 'SKU-CEM-001' },
    { id: 'SKU002', name: 'TMT Steel Bar 12mm', category: 'steel', stock: 38, maxStock: 500, reorderLevel: 60, price: 6800, supplier: 'SteelForge Co.', icon: '⚙', sku: 'SKU-STL-002' },
    { id: 'SKU003', name: 'Power Drill HD 20V', category: 'tools', stock: 12, maxStock: 80, reorderLevel: 15, price: 4500, supplier: 'PowerTool Inc.', icon: '🔧', sku: 'SKU-TLZ-003' },
    { id: 'SKU004', name: 'PVC Pipe 4 inch', category: 'plumbing', stock: 280, maxStock: 400, reorderLevel: 50, price: 320, supplier: 'PlumbEx', icon: '🔩', sku: 'SKU-PLM-004' },
    { id: 'SKU005', name: 'LED Flood Light 50W', category: 'electrical', stock: 7, maxStock: 100, reorderLevel: 20, price: 1200, supplier: 'ElectroPro', icon: '💡', sku: 'SKU-ELE-005' },
    { id: 'SKU006', name: 'Asian Paints Exterior 20L', category: 'paint', stock: 95, maxStock: 200, reorderLevel: 30, price: 3800, supplier: 'PaintWorld', icon: '🎨', sku: 'SKU-PNT-006' },
    { id: 'SKU007', name: 'River Sand Fine Grade', category: 'cement', stock: 180, maxStock: 300, reorderLevel: 40, price: 1800, supplier: 'BuildMart Pro', icon: '⬛', sku: 'SKU-SND-007' },
    { id: 'SKU008', name: 'Angle Grinder 7 inch', category: 'tools', stock: 24, maxStock: 60, reorderLevel: 10, price: 3200, supplier: 'PowerTool Inc.', icon: '🔨', sku: 'SKU-TLZ-008' },
    { id: 'SKU009', name: 'Copper Wire 2.5mm 90m', category: 'electrical', stock: 55, maxStock: 150, reorderLevel: 25, price: 2100, supplier: 'ElectroPro', icon: '⚡', sku: 'SKU-ELE-009' },
    { id: 'SKU010', name: 'Ceramic Floor Tiles 2x2', category: 'paint', stock: 340, maxStock: 500, reorderLevel: 60, price: 85, supplier: 'TileZone', icon: '⬜', sku: 'SKU-TLS-010' },
    { id: 'SKU011', name: 'GI Pipe 1 inch', category: 'plumbing', stock: 3, maxStock: 120, reorderLevel: 20, price: 580, supplier: 'PlumbEx', icon: '🔩', sku: 'SKU-PLM-011' },
    { id: 'SKU012', name: 'TATA Steel I-Beam 6m', category: 'steel', stock: 62, maxStock: 150, reorderLevel: 20, price: 18500, supplier: 'SteelForge Co.', icon: '🏗', sku: 'SKU-STL-012' },
  ],

  orders: [
    { id: 'ORD-2026-001', supplier: 'BuildMart Pro', items: 5, value: 184000, orderDate: '2026-05-20', expectedDate: '2026-05-28', status: 'shipped' },
    { id: 'ORD-2026-002', supplier: 'SteelForge Co.', items: 3, value: 427500, orderDate: '2026-05-22', expectedDate: '2026-05-30', status: 'processing' },
    { id: 'ORD-2026-003', supplier: 'PowerTool Inc.', items: 8, value: 96000, orderDate: '2026-05-23', expectedDate: '2026-06-02', status: 'pending' },
    { id: 'ORD-2026-004', supplier: 'ElectroPro', items: 4, value: 63200, orderDate: '2026-05-18', expectedDate: '2026-05-25', status: 'delivered' },
    { id: 'ORD-2026-005', supplier: 'PlumbEx', items: 6, value: 38400, orderDate: '2026-05-24', expectedDate: '2026-06-03', status: 'pending' },
    { id: 'ORD-2026-006', supplier: 'PaintWorld', items: 2, value: 76000, orderDate: '2026-05-19', expectedDate: '2026-05-27', status: 'delivered' },
    { id: 'ORD-2026-007', supplier: 'TileZone', items: 10, value: 42500, orderDate: '2026-05-25', expectedDate: '2026-06-05', status: 'processing' },
  ],

  suppliers: [
    { name: 'BuildMart Pro', category: 'Cement & Aggregates', rating: 4.8, orders: 142, onTime: '96%', value: '₹24.8L', icon: '🏢', status: 'active' },
    { name: 'SteelForge Co.', category: 'Steel & Metals', rating: 4.6, orders: 87, onTime: '92%', value: '₹61.2L', icon: '⚙', status: 'active' },
    { name: 'PowerTool Inc.', category: 'Tools & Equipment', rating: 4.4, orders: 53, onTime: '88%', value: '₹12.4L', icon: '🔧', status: 'active' },
    { name: 'ElectroPro', category: 'Electrical', rating: 4.7, orders: 98, onTime: '94%', value: '₹18.6L', icon: '⚡', status: 'active' },
    { name: 'PlumbEx', category: 'Plumbing', rating: 4.2, orders: 61, onTime: '85%', value: '₹8.9L', icon: '🔩', status: 'active' },
    { name: 'PaintWorld', category: 'Paint & Coatings', rating: 4.5, orders: 44, onTime: '91%', value: '₹11.2L', icon: '🎨', status: 'active' },
    { name: 'TileZone', category: 'Tiles & Flooring', rating: 4.3, orders: 38, onTime: '89%', value: '₹9.7L', icon: '⬜', status: 'active' },
  ],

  contractors: [
    { initials: 'RK', name: 'Rajesh Kumar Builders', type: 'General Contractor', tier: 'platinum', totalOrders: 284, totalSpend: '₹48.2L', activeSince: '2021', credit: '₹5L' },
    { initials: 'MS', name: 'Mahesh Singh Infra', type: 'Civil Engineer', tier: 'gold', totalOrders: 156, totalSpend: '₹22.6L', activeSince: '2022', credit: '₹2L' },
    { initials: 'AP', name: 'Amit Patel Constructions', type: 'Structural Contractor', tier: 'gold', totalOrders: 98, totalSpend: '₹15.8L', activeSince: '2023', credit: '₹1.5L' },
    { initials: 'SD', name: 'Sunita Devi Interiors', type: 'Interior Designer', tier: 'silver', totalOrders: 42, totalSpend: '₹6.4L', activeSince: '2024', credit: '₹75K' },
    { initials: 'VR', name: 'Venkat Raju Electricals', type: 'Electrical Contractor', tier: 'silver', totalOrders: 67, totalSpend: '₹9.2L', activeSince: '2023', credit: '₹1L' },
    { initials: 'NK', name: 'Neeraj Kapoor Projects', type: 'Plumbing Specialist', tier: 'gold', totalOrders: 119, totalSpend: '₹17.3L', activeSince: '2022', credit: '₹2.5L' },
  ],

  products: [
    { name: 'Portland Cement 50kg', brand: 'UltraTech', category: 'cement', price: 420, stock: 420, status: 'in-stock', icon: '🧱' },
    { name: 'TMT Steel Bar 12mm', brand: 'TATA Steel', category: 'steel', price: 6800, stock: 38, status: 'low-stock', icon: '⚙' },
    { name: 'Power Drill HD 20V', brand: 'Bosch', category: 'tools', price: 4500, stock: 12, status: 'low-stock', icon: '🔧' },
    { name: 'PVC Pipe 4 inch 6m', brand: 'Finolex', category: 'plumbing', price: 320, stock: 280, status: 'in-stock', icon: '🔩' },
    { name: 'LED Flood Light 50W', brand: 'Havells', category: 'electrical', price: 1200, stock: 7, status: 'low-stock', icon: '💡' },
    { name: 'Exterior Wall Paint 20L', brand: 'Asian Paints', category: 'paint', price: 3800, stock: 95, status: 'in-stock', icon: '🎨' },
    { name: 'M-Sand 1 Ton Bag', brand: 'BuildMart', category: 'cement', price: 1800, stock: 180, status: 'in-stock', icon: '⬛' },
    { name: 'Angle Grinder 7 inch', brand: 'Makita', category: 'tools', price: 3200, stock: 24, status: 'in-stock', icon: '🔨' },
    { name: 'Copper Wire 2.5mm 90m', brand: 'KEI', category: 'electrical', price: 2100, stock: 55, status: 'in-stock', icon: '⚡' },
    { name: 'Vitrified Floor Tiles 2x2', brand: 'Kajaria', category: 'paint', price: 85, stock: 340, status: 'in-stock', icon: '⬜' },
    { name: 'GI Pipe 1 inch 6m', brand: 'APL Apollo', category: 'plumbing', price: 580, stock: 3, status: 'low-stock', icon: '🔩' },
    { name: 'I-Beam 150x75 6m', brand: 'TATA Steel', category: 'steel', price: 18500, stock: 62, status: 'in-stock', icon: '🏗' },
    { name: 'Waterproof Cement 25kg', brand: 'Birla', category: 'cement', price: 560, stock: 210, status: 'in-stock', icon: '🧱' },
    { name: 'Circular Saw 7.5 inch', brand: 'Bosch', category: 'tools', price: 5800, stock: 0, status: 'out-stock', icon: '🔧' },
    { name: 'MCB Distribution Board', brand: 'Schneider', category: 'electrical', price: 4200, stock: 18, status: 'in-stock', icon: '⚡' },
    { name: 'CPVC Fitting Set', brand: 'Supreme', category: 'plumbing', price: 890, stock: 145, status: 'in-stock', icon: '🔩' },
  ],

  invoices: [
    { id: 'INV-2026-0042', customer: 'Rajesh Kumar Builders', date: '2026-05-25', dueDate: '2026-06-10', amount: 84200, status: 'paid' },
    { id: 'INV-2026-0041', customer: 'Mahesh Singh Infra', date: '2026-05-24', dueDate: '2026-06-08', amount: 212600, status: 'pending' },
    { id: 'INV-2026-0040', customer: 'Walk-in Customer', date: '2026-05-23', dueDate: '2026-05-23', amount: 6840, status: 'paid' },
    { id: 'INV-2026-0039', customer: 'Amit Patel Constructions', date: '2026-05-22', dueDate: '2026-06-05', amount: 156000, status: 'pending' },
    { id: 'INV-2026-0038', customer: 'Sunita Devi Interiors', date: '2026-05-20', dueDate: '2026-05-27', amount: 38400, status: 'overdue' },
    { id: 'INV-2026-0037', customer: 'Venkat Raju Electricals', date: '2026-05-18', dueDate: '2026-06-01', amount: 92300, status: 'paid' },
  ],

  deliveries: [
    { id: 'DEL-001', orderRef: 'ORD-2026-001', supplier: 'BuildMart Pro', destination: 'Site A – Koramangala', driver: 'Suresh B.', progress: 75, eta: '~2 hrs', status: 'green', x: '62%', y: '38%' },
    { id: 'DEL-002', orderRef: 'ORD-2026-002', supplier: 'SteelForge Co.', destination: 'Site B – Whitefield', driver: 'Kiran M.', progress: 42, eta: '~4 hrs', status: 'orange', x: '35%', y: '58%' },
    { id: 'DEL-003', orderRef: 'ORD-2026-004', supplier: 'ElectroPro', destination: 'Site C – Indiranagar', driver: 'Ramu S.', progress: 90, eta: '~30 min', status: 'green', x: '78%', y: '25%' },
    { id: 'DEL-004', orderRef: 'ORD-2026-006', supplier: 'PaintWorld', destination: 'Site D – HSR Layout', driver: 'Priya K.', progress: 20, eta: '~6 hrs', status: 'red', x: '22%', y: '70%' },
    { id: 'DEL-005', orderRef: 'ORD-2026-007', supplier: 'TileZone', destination: 'Site E – Electronic City', driver: 'Anil T.', progress: 58, eta: '~3 hrs', status: 'orange', x: '55%', y: '72%' },
  ],

  alerts: [
    { icon: '⚠', color: '#E87E52', bg: 'rgba(232,126,82,0.12)', title: 'Low Stock: LED Flood Light 50W', sub: 'Only 7 units remaining — reorder level: 20', time: '5m ago' },
    { icon: '⚠', color: '#E85252', bg: 'rgba(232,82,82,0.12)', title: 'Critical: GI Pipe 1 inch', sub: 'Only 3 units left — urgent reorder needed!', time: '12m ago' },
    { icon: '✦', color: '#9B72D9', bg: 'rgba(155,114,217,0.12)', title: 'AI Forecast: Cement demand up 34%', sub: 'Monsoon season approaching — stock up now', time: '1h ago' },
    { icon: '🚚', color: '#4A90D9', bg: 'rgba(74,144,217,0.12)', title: 'Delivery DEL-001 en route', sub: 'BuildMart Pro shipment — ETA 2 hrs', time: '2h ago' },
    { icon: '📄', color: '#52C97E', bg: 'rgba(82,201,126,0.12)', title: 'Invoice INV-2026-0038 Overdue', sub: 'Sunita Devi Interiors — ₹38,400 overdue', time: '1d ago' },
  ],

  forecast: [
    { name: 'Portland Cement', pct: 92, trend: 'up', trendVal: '+34%' },
    { name: 'TMT Steel Bar', pct: 78, trend: 'up', trendVal: '+18%' },
    { name: 'LED Flood Light', pct: 65, trend: 'up', trendVal: '+12%' },
    { name: 'Power Drill HD', pct: 45, trend: 'down', trendVal: '-5%' },
    { name: 'PVC Pipe 4 inch', pct: 38, trend: 'up', trendVal: '+8%' },
  ],

  stockouts: [
    { name: 'GI Pipe 1 inch', detail: 'Current: 3 units | Reorder: 20 units', days: 'Stockout in ~2 days' },
    { name: 'LED Flood Light 50W', detail: 'Current: 7 units | Reorder: 20 units', days: 'Stockout in ~5 days' },
    { name: 'Power Drill HD 20V', detail: 'Current: 12 units | Reorder: 15 units', days: 'Stockout in ~9 days' },
    { name: 'TMT Steel Bar 12mm', detail: 'Current: 38 units | Reorder: 60 units', days: 'Stockout in ~14 days' },
  ],

  reorderRecs: [
    { name: 'GI Pipe 1 inch', qty: 'Order 120 units', supplier: 'PlumbEx', saving: 'Save ₹2,400 bulk deal' },
    { name: 'LED Flood Light', qty: 'Order 93 units', supplier: 'ElectroPro', saving: 'Save ₹6,000 bulk deal' },
    { name: 'Power Drill HD', qty: 'Order 68 units', supplier: 'PowerTool Inc.', saving: 'Save ₹9,600 bulk deal' },
  ],

  aiInsights: [
    { label: 'Demand Spike', text: 'Cement demand is predicted to rise 34% in the next 30 days due to monsoon pre-season construction surge.' },
    { label: 'Price Alert', text: 'Steel prices expected to dip 8% in June. Consider delaying large orders by 2-3 weeks.' },
    { label: 'Seasonal Trend', text: 'Electrical demand peaks every October-November. Begin stocking LED products by August.' },
    { label: 'Reorder Optimization', text: 'Consolidating GI Pipe and PVC Pipe orders from PlumbEx can save ₹14,200 on shipping.' },
  ],

  zones: [
    { name: 'Zone A — Cement & Aggregates', pct: 94, color: '#E85252' },
    { name: 'Zone B — Steel & Metals', pct: 72, color: '#E87E52' },
    { name: 'Zone C — Tools & Equipment', pct: 58, color: '#C8A820' },
    { name: 'Zone D — Electrical', pct: 41, color: '#52C97E' },
    { name: 'Zone E — Plumbing', pct: 63, color: '#4A90D9' },
    { name: 'Zone F — Paint & Tiles', pct: 35, color: '#9B72D9' },
  ],

  recentBills: [
    { name: 'Rajesh Kumar', amount: '₹84,200', time: '10:42 AM' },
    { name: 'Walk-in', amount: '₹6,840', time: '09:15 AM' },
    { name: 'Mahesh Singh', amount: '₹1,12,600', time: 'Yesterday' },
    { name: 'Amit Patel', amount: '₹36,400', time: 'Yesterday' },
  ],
};

// ============================================================
// CHART.JS LOADER (CDN fallback with canvas drawing)
// ============================================================
function loadChartJS(callback) {
  if (window.Chart) { callback(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js';
  s.onload = callback;
  s.onerror = () => { console.warn('Chart.js CDN failed, using fallback canvas'); callback(); };
  document.head.appendChild(s);
}

// ============================================================
// NAVIGATION
// ============================================================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  document.getElementById('pageBreadcrumb').textContent = formatPageTitle(page);
  State.currentPage = page;

  // Close mobile sidebar on nav
  document.getElementById('sidebar').classList.remove('open');

  // Init page-specific stuff
  setTimeout(() => initPage(page), 50);
}

function formatPageTitle(page) {
  const map = {
    'dashboard': 'Dashboard',
    'analytics': 'Analytics',
    'inventory': 'Inventory',
    'orders': 'Bulk Orders',
    'suppliers': 'Suppliers',
    'warehouse': 'Warehouse',
    'ai-forecast': 'AI Forecast',
    'demand': 'Demand AI',
    'billing': 'QR Billing',
    'invoices': 'Invoices',
    'delivery': 'Delivery',
    'contractors': 'Contractors',
    'products': 'Products',
  };
  return map[page] || page;
}

function initPage(page) {
  switch (page) {
    case 'dashboard': initDashboard(); break;
    case 'analytics': initAnalytics(); break;
    case 'inventory': renderInventory(); break;
    case 'orders': renderOrders(); break;
    case 'suppliers': renderSuppliers(); break;
    case 'warehouse': initWarehouse(); break;
    case 'ai-forecast': initForecast(); break;
    case 'demand': initDemand(); break;
    case 'billing': initBilling(); break;
    case 'invoices': renderInvoices(); break;
    case 'delivery': initDelivery(); break;
    case 'contractors': renderContractors(); break;
    case 'products': renderProducts(); break;
  }
}

// ============================================================
// CLOCK
// ============================================================
function startClock() {
  function tick() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const t = document.getElementById('currentTime');
    const d = document.getElementById('currentDate');
    if (t) t.textContent = timeStr;
    if (d) d.textContent = dateStr;
  }
  tick();
  setInterval(tick, 1000);
}

// ============================================================
// KPI COUNTERS
// ============================================================
function animateCounter(el, target, prefix = '', suffix = '') {
  const duration = 1200;
  const start = performance.now();
  const startVal = 0;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(startVal + (target - startVal) * eased);
    el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============================================================
// SPARKLINE CANVAS (no Chart.js required)
// ============================================================
function drawSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  ctx.clearRect(0, 0, w, h);

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h * 0.8 - h * 0.1,
  }));

  // Fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, color + '00');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, h);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, h);
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ============================================================
// CHART HELPERS
// ============================================================
function destroyChart(id) {
  if (State.chartInstances[id]) {
    State.chartInstances[id].destroy();
    delete State.chartInstances[id];
  }
}

function makeChart(id, config) {
  if (!window.Chart) return;
  destroyChart(id);
  const canvas = document.getElementById(id);
  if (!canvas) return;
  State.chartInstances[id] = new Chart(canvas, config);
  return State.chartInstances[id];
}

const chartDefaults = {
  plugins: { legend: { display: false } },
  responsive: true,
  maintainAspectRatio: false,
};

// ============================================================
// DASHBOARD
// ============================================================
function initDashboard() {
  // KPI counters
  animateCounter(document.getElementById('kpiRevenue'), 284600, '₹');
  animateCounter(document.getElementById('kpiOrders'), 47);
  animateCounter(document.getElementById('kpiInventory'), 1248);
  animateCounter(document.getElementById('kpiDeliveries'), 14);

  // Sparklines
  drawSparkline('sparkRevenue', [180, 220, 195, 260, 240, 285, 310, 275, 295, 284], '#C8A96E');
  drawSparkline('sparkOrders', [30, 42, 38, 51, 44, 55, 48, 60, 52, 47], '#4A90D9');
  drawSparkline('sparkInventory', [1300, 1280, 1260, 1248, 1260, 1270, 1255, 1240, 1248, 1248], '#52C97E');
  drawSparkline('sparkDelivery', [8, 10, 12, 9, 11, 14, 12, 15, 13, 14], '#E87E52');

  // Charts
  loadChartJS(() => {
    renderRevenueChart('week');
    renderCategoryChart();
  });

  // Lists
  renderAlerts();
  renderRecentOrders();
  renderForecastWidget();
  renderHeatmapMini();
}

function renderRevenueChart(period) {
  const labels = {
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    month: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    quarter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  };
  const data = {
    week: [182000, 248000, 196000, 312000, 284000, 354000, 228000],
    month: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200000) + 150000),
    quarter: [1840000, 2120000, 1960000, 2480000, 3120000, 2840000, 3540000, 2880000, 3200000],
  };

  if (!window.Chart) return;
  makeChart('revenueChart', {
    type: 'bar',
    data: {
      labels: labels[period],
      datasets: [{
        data: data[period],
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          g.addColorStop(0, '#C8A96E99');
          g.addColorStop(1, '#C8A96E22');
          return g;
        },
        borderColor: '#C8A96E',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }, {
        type: 'line',
        data: data[period].map(v => v * 0.75),
        borderColor: '#4A90D9',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#4A90D9',
        fill: false,
        tension: 0.4,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0', font: { size: 11 } } },
        y: {
          grid: { color: '#F2F1EF', borderDash: [4, 4] },
          ticks: { color: '#9AA0B0', font: { size: 11 }, callback: v => '₹' + (v / 1000).toFixed(0) + 'K' },
        },
      },
    },
  });
}

function renderCategoryChart() {
  if (!window.Chart) return;
  makeChart('categoryChart', {
    type: 'doughnut',
    data: {
      labels: ['Cement', 'Steel', 'Tools', 'Electrical', 'Plumbing', 'Paint'],
      datasets: [{
        data: [32, 28, 14, 11, 9, 6],
        backgroundColor: ['#C8A96E', '#4A90D9', '#52C97E', '#9B72D9', '#E87E52', '#E8C820'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      }],
    },
    options: {
      ...chartDefaults,
      cutout: '65%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { font: { size: 11 }, color: '#5A6070', padding: 12, boxWidth: 10, boxHeight: 10 },
        },
      },
    },
  });
}

function renderAlerts() {
  const el = document.getElementById('alertsList');
  if (!el) return;
  el.innerHTML = DATA.alerts.map(a => `
    <div class="alert-item">
      <div class="alert-icon" style="background:${a.bg};color:${a.color}">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-sub">${a.sub}</div>
      </div>
      <div class="alert-time">${a.time}</div>
    </div>
  `).join('');
}

function renderRecentOrders() {
  const el = document.getElementById('recentOrdersBody');
  if (!el) return;
  el.innerHTML = DATA.orders.slice(0, 5).map(o => `
    <tr>
      <td><span class="font-mono" style="font-size:0.78rem;color:var(--text-muted)">${o.id}</span></td>
      <td><strong>${o.supplier}</strong></td>
      <td>${o.items} items</td>
      <td><strong style="color:var(--gold-3)">₹${o.value.toLocaleString('en-IN')}</strong></td>
      <td><span class="status-badge ${o.status}">${cap(o.status)}</span></td>
      <td><button class="action-btn" onclick="viewOrder('${o.id}')">View</button></td>
    </tr>
  `).join('');
}

function renderForecastWidget() {
  const el = document.getElementById('forecastWidget');
  if (!el) return;
  el.innerHTML = DATA.forecast.map(f => `
    <div class="forecast-row">
      <span class="fr-name">${f.name}</span>
      <div class="fr-bar-wrap"><div class="fr-bar" style="width:${f.pct}%"></div></div>
      <span class="fr-pct">${f.pct}%</span>
      <span class="fr-trend ${f.trend}">${f.trendVal}</span>
    </div>
  `).join('');
}

function renderHeatmapMini() {
  const el = document.getElementById('heatmapMini');
  if (!el) return;
  const colors = ['#4A90D9', '#52C97E', '#C8A820', '#E87E52', '#E85252'];
  let html = '';
  for (let i = 0; i < 32; i++) {
    const heat = Math.random();
    const colorIdx = Math.floor(heat * colors.length);
    const opacity = 0.3 + heat * 0.7;
    html += `<div class="hm-cell" style="background:${colors[colorIdx]};opacity:${opacity.toFixed(2)}" title="Zone ${i + 1}: ${Math.round(heat * 100)}% utilized"></div>`;
  }
  el.innerHTML = html;
}

function setChartPeriod(period, btn) {
  document.querySelectorAll('#page-dashboard .ctrl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRevenueChart(period);
}

// ============================================================
// ANALYTICS
// ============================================================
function initAnalytics() {
  loadChartJS(() => {
    renderAnalyticsRevChart();
    renderTopProducts();
    renderSupplierChart();
    renderFulfillmentChart();
    renderContractorChart();
  });
}

function renderAnalyticsRevChart() {
  if (!window.Chart) return;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  makeChart('analyticsRevChart', {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: '2026 Revenue',
        data: [1840, 2120, 1960, 2480, 3120, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#C8A96E',
        backgroundColor: 'rgba(200,169,110,0.12)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#C8A96E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }, {
        label: '2025 Revenue',
        data: [1420, 1680, 1820, 1960, 2240, 2180, 2420, 2640, 2380, 2560, 2780, 2940],
        borderColor: '#8A9BB0',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        borderDash: [6, 3],
      }],
    },
    options: {
      ...chartDefaults,
      plugins: {
        legend: { display: true, labels: { color: '#5A6070', font: { size: 11 } } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0', font: { size: 11 } } },
        y: {
          grid: { color: '#F2F1EF' },
          ticks: { color: '#9AA0B0', font: { size: 11 }, callback: v => '₹' + v + 'K' },
        },
      },
    },
  });
}

function renderTopProducts() {
  const el = document.getElementById('topProductsList');
  if (!el) return;
  const tops = [
    { name: 'TMT Steel Bar 12mm', val: '₹8.4L', rank: 1 },
    { name: 'Portland Cement 50kg', val: '₹6.2L', rank: 2 },
    { name: 'TATA I-Beam 6m', val: '₹5.8L', rank: 3 },
    { name: 'Power Drill HD 20V', val: '₹4.1L', rank: 4 },
    { name: 'LED Flood Light 50W', val: '₹3.6L', rank: 5 },
  ];
  el.innerHTML = tops.map(t => `
    <div class="pr-item">
      <div class="pr-rank ${t.rank === 1 ? 'gold-rank' : ''}">${t.rank}</div>
      <span class="pr-name">${t.name}</span>
      <span class="pr-val">${t.val}</span>
    </div>
  `).join('');
}

function renderSupplierChart() {
  if (!window.Chart) return;
  makeChart('supplierChart', {
    type: 'bar',
    data: {
      labels: ['BuildMart', 'SteelForge', 'PowerTool', 'ElectroPro', 'PlumbEx'],
      datasets: [{
        label: 'On-time %',
        data: [96, 92, 88, 94, 85],
        backgroundColor: ['#52C97E', '#4A90D9', '#C8A820', '#52C97E', '#E87E52'],
        borderRadius: 6,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0', font: { size: 11 } } },
        y: { min: 75, max: 100, ticks: { color: '#9AA0B0', callback: v => v + '%' } },
      },
    },
  });
}

function renderFulfillmentChart() {
  if (!window.Chart) return;
  makeChart('fulfillmentChart', {
    type: 'doughnut',
    data: {
      labels: ['On Time', 'Delayed', 'Cancelled'],
      datasets: [{
        data: [78, 16, 6],
        backgroundColor: ['#52C97E', '#E87E52', '#E85252'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { color: '#5A6070', font: { size: 11 }, padding: 10, boxWidth: 10 } },
      },
    },
  });
}

function renderContractorChart() {
  if (!window.Chart) return;
  makeChart('contractorChart', {
    type: 'bar',
    data: {
      labels: ['Rajesh K.', 'Mahesh S.', 'Amit P.', 'Sunita D.', 'Venkat R.', 'Neeraj K.'],
      datasets: [{
        data: [284, 156, 98, 42, 67, 119],
        backgroundColor: 'rgba(200,169,110,0.7)',
        borderColor: '#C8A96E',
        borderWidth: 1,
        borderRadius: 6,
      }],
    },
    options: {
      ...chartDefaults,
      indexAxis: 'y',
      scales: {
        x: { grid: { color: '#F2F1EF' }, ticks: { color: '#9AA0B0', font: { size: 11 } } },
        y: { grid: { display: false }, ticks: { color: '#5A6070', font: { size: 11 } } },
      },
    },
  });
}

// ============================================================
// INVENTORY
// ============================================================
function renderInventory() {
  const el = document.getElementById('inventoryGrid');
  if (!el) return;

  let items = [...DATA.inventory];

  if (State.inventoryCategory !== 'all') {
    items = items.filter(i => i.category === State.inventoryCategory);
  }

  if (State.inventorySearch) {
    const q = State.inventorySearch.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
  }

  if (State.inventoryView === 'list') {
    el.classList.add('list-view');
  } else {
    el.classList.remove('list-view');
  }

  el.innerHTML = items.map(item => {
    const pct = Math.round((item.stock / item.maxStock) * 100);
    const stockClass = item.stock <= item.reorderLevel * 0.3 ? 'stock-critical'
      : item.stock <= item.reorderLevel ? 'stock-low' : 'stock-ok';
    const needsReorder = item.stock <= item.reorderLevel;

    let barColor = 'var(--accent-green)';
    if (stockClass === 'stock-low') barColor = 'var(--accent-orange)';
    if (stockClass === 'stock-critical') barColor = 'var(--accent-red)';

    return `
      <div class="inv-card ${stockClass}" onclick="viewItem('${item.id}')">
        ${needsReorder ? '<div class="inv-reorder-alert"></div>' : ''}
        <div class="inv-card-top">
          <div class="inv-icon" style="background:var(--surface-2)">${item.icon}</div>
          <span class="inv-menu" onclick="event.stopPropagation();itemMenu('${item.id}')">⋯</span>
        </div>
        <div class="inv-name">${item.name}</div>
        <div class="inv-sku">${item.sku}</div>
        <div class="inv-stock-bar">
          <div class="inv-stock-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="inv-footer">
          <div class="inv-qty">${item.stock} <span>/ ${item.maxStock} units</span></div>
          <div class="inv-price">₹${item.price.toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;
  }).join('');

  if (!items.length) {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No items found</div>`;
  }
}

function filterInventory(val) {
  State.inventorySearch = val;
  renderInventory();
}

function filterByCategory(cat, btn) {
  document.querySelectorAll('#page-inventory .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  State.inventoryCategory = cat;
  renderInventory();
}

function sortInventory(val) {
  if (val === 'name') DATA.inventory.sort((a, b) => a.name.localeCompare(b.name));
  else if (val === 'stock') DATA.inventory.sort((a, b) => a.stock - b.stock);
  else if (val === 'price') DATA.inventory.sort((a, b) => b.price - a.price);
  else if (val === 'reorder') DATA.inventory.sort((a, b) => (a.stock / a.reorderLevel) - (b.stock / b.reorderLevel));
  renderInventory();
}

function toggleView(view) {
  State.inventoryView = view;
  document.getElementById('gridViewBtn').style.color = view === 'grid' ? 'var(--gold)' : '';
  document.getElementById('listViewBtn').style.color = view === 'list' ? 'var(--gold)' : '';
  renderInventory();
}

function addInventoryItem() {
  document.getElementById('addItemModal').style.display = 'flex';
}

function saveInventoryItem() {
  const name = document.getElementById('newItemName').value.trim();
  if (!name) { showToast('Please enter a product name', 'error'); return; }

  const newItem = {
    id: 'SKU' + String(DATA.inventory.length + 1).padStart(3, '0'),
    name,
    category: document.getElementById('newItemCategory').value,
    stock: parseInt(document.getElementById('newItemStock').value) || 0,
    maxStock: (parseInt(document.getElementById('newItemStock').value) || 0) * 2,
    reorderLevel: parseInt(document.getElementById('newItemReorder').value) || 10,
    price: parseFloat(document.getElementById('newItemPrice').value) || 0,
    supplier: document.getElementById('newItemSupplier').value,
    icon: '📦',
    sku: 'SKU-NEW-' + String(DATA.inventory.length + 1).padStart(3, '0'),
  };

  DATA.inventory.push(newItem);
  closeModal('addItemModal');
  renderInventory();
  showToast('Item added successfully', 'success');
}

function viewItem(id) {
  const item = DATA.inventory.find(i => i.id === id);
  if (item) showToast(`Viewing: ${item.name}`, 'info');
}

function itemMenu(id) {
  showToast('Item options coming soon', 'info');
}

function scanQR() {
  showToast('📷 QR Scanner activated — point at product label', 'info');
}

// ============================================================
// ORDERS
// ============================================================
function renderOrders() {
  const body = document.getElementById('ordersBody');
  if (!body) return;

  const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0 };
  DATA.orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

  document.getElementById('statPending').textContent = counts.pending;
  document.getElementById('statProcessing').textContent = counts.processing;
  document.getElementById('statShipped').textContent = counts.shipped;
  document.getElementById('statDelivered').textContent = counts.delivered;

  body.innerHTML = DATA.orders.map(o => `
    <tr>
      <td><span class="font-mono" style="font-size:0.78rem">${o.id}</span></td>
      <td><strong>${o.supplier}</strong></td>
      <td>${o.items} items</td>
      <td><strong style="color:var(--gold-3)">₹${o.value.toLocaleString('en-IN')}</strong></td>
      <td style="color:var(--text-muted);font-size:0.82rem">${o.orderDate}</td>
      <td style="color:var(--text-muted);font-size:0.82rem">${o.expectedDate}</td>
      <td><span class="status-badge ${o.status}">${cap(o.status)}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="action-btn" onclick="trackOrder('${o.id}')">Track</button>
          <button class="action-btn" onclick="viewOrder('${o.id}')">View</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function createOrder() {
  document.getElementById('createOrderModal').style.display = 'flex';
}

function addOrderLine() {
  const container = document.getElementById('orderLines');
  const div = document.createElement('div');
  div.className = 'order-line';
  div.innerHTML = `
    <select class="ol-product">
      <option>Portland Cement 50kg</option>
      <option>TMT Steel Bar 12mm</option>
      <option>Power Drill HD</option>
      <option>PVC Pipe 4inch</option>
    </select>
    <input type="number" class="ol-qty" placeholder="Qty" value="50" />
    <input type="number" class="ol-price" placeholder="Unit Price" value="420" />
    <span class="ol-total">₹21,000</span>
    <button class="ol-remove" onclick="removeOrderLine(this)">✕</button>
  `;
  container.appendChild(div);
}

function removeOrderLine(btn) {
  btn.parentElement.remove();
}

function submitOrder() {
  const supplier = document.getElementById('orderSupplier').value;
  const delivery = document.getElementById('orderDeliveryDate').value;
  if (!delivery) { showToast('Please select a delivery date', 'error'); return; }

  const newOrder = {
    id: `ORD-2026-${String(DATA.orders.length + 1).padStart(3, '0')}`,
    supplier,
    items: document.querySelectorAll('#orderLines .order-line').length,
    value: Math.floor(Math.random() * 200000) + 50000,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: delivery,
    status: 'pending',
  };

  DATA.orders.unshift(newOrder);
  closeModal('createOrderModal');
  renderOrders();
  showToast(`Order ${newOrder.id} placed successfully!`, 'success');
}

function trackOrder(id) {
  navigate('delivery');
  showToast(`Tracking ${id}`, 'info');
}

function viewOrder(id) {
  showToast(`Viewing order ${id}`, 'info');
}

// ============================================================
// SUPPLIERS
// ============================================================
function renderSuppliers() {
  const el = document.getElementById('suppliersGrid');
  if (!el) return;

  el.innerHTML = DATA.suppliers.map(s => `
    <div class="supplier-card">
      <div class="supplier-top">
        <div class="supplier-logo">${s.icon}</div>
        <div>
          <div class="supplier-name">${s.name}</div>
          <div class="supplier-category">${s.category}</div>
        </div>
        <div class="supplier-rating">⭐ ${s.rating}</div>
      </div>
      <div class="supplier-stats">
        <div class="ss-item">
          <div class="ss-val">${s.orders}</div>
          <div class="ss-label">Orders</div>
        </div>
        <div class="ss-item">
          <div class="ss-val">${s.onTime}</div>
          <div class="ss-label">On-Time</div>
        </div>
        <div class="ss-item">
          <div class="ss-val">${s.value}</div>
          <div class="ss-label">Value</div>
        </div>
      </div>
      <div class="supplier-actions">
        <button class="btn-sm" onclick="contactSupplier('${s.name}')">✉ Contact</button>
        <button class="btn-sm" onclick="viewSupplier('${s.name}')">View Profile</button>
        <button class="btn-primary" style="flex:1;font-size:0.75rem" onclick="orderFromSupplier('${s.name}')">+ Order</button>
      </div>
    </div>
  `).join('');
}

function addSupplier() {
  showToast('Add Supplier form coming soon', 'info');
}

function contactSupplier(name) {
  showToast(`Contacting ${name}…`, 'info');
}

function viewSupplier(name) {
  showToast(`Opening profile: ${name}`, 'info');
}

function orderFromSupplier(name) {
  document.getElementById('orderSupplier').value = name;
  navigate('orders');
  setTimeout(() => createOrder(), 300);
}

// ============================================================
// WAREHOUSE
// ============================================================
function initWarehouse() {
  renderFullHeatmap();
  renderZoneDetails();
  loadChartJS(renderStorageTrend);
}

function renderFullHeatmap() {
  const el = document.getElementById('fullHeatmap');
  if (!el) return;
  const zoneColors = ['#E85252', '#E87E52', '#C8A820', '#52C97E', '#4A90D9', '#9B72D9'];
  let html = '';
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 12; col++) {
      const zoneIdx = Math.floor(col / 2) % zoneColors.length;
      const heat = 0.25 + Math.random() * 0.75;
      const opacity = (0.3 + heat * 0.7).toFixed(2);
      html += `<div class="hm-cell" style="background:${zoneColors[zoneIdx]};opacity:${opacity};aspect-ratio:1.5" 
        onclick="zoneClick(${row},${col})" 
        title="Zone ${String.fromCharCode(65 + row)}${col + 1}: ${Math.round(heat * 100)}% utilized"></div>`;
    }
  }
  el.innerHTML = html;
}

function renderZoneDetails() {
  const el = document.getElementById('zoneDetails');
  if (!el) return;
  el.innerHTML = DATA.zones.map(z => `
    <div class="zone-item" onclick="showToast('${z.name}','info')">
      <div class="zone-dot" style="background:${z.color}"></div>
      <span class="zone-name">${z.name}</span>
      <span class="zone-pct">${z.pct}%</span>
    </div>
  `).join('');
}

function renderStorageTrend() {
  if (!window.Chart) return;
  makeChart('storageTrendChart', {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        data: [72, 78, 82, 85, 87],
        borderColor: '#C8A96E',
        backgroundColor: 'rgba(200,169,110,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#C8A96E',
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0', font: { size: 10 } } },
        y: { min: 60, max: 100, ticks: { color: '#9AA0B0', font: { size: 10 }, callback: v => v + '%' } },
      },
    },
  });
}

function zoneClick(r, c) {
  showToast(`Zone ${String.fromCharCode(65 + r)}${c + 1} selected`, 'info');
}

function refreshWarehouse() {
  renderFullHeatmap();
  showToast('Warehouse data refreshed', 'success');
}

// ============================================================
// AI FORECAST
// ============================================================
function initForecast() {
  loadChartJS(() => {
    renderForecastChart();
    renderDemandMatrix();
  });
  renderStockoutList();
  renderReorderList();
}

function renderForecastChart() {
  if (!window.Chart) return;
  const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  const cement = days.map((_, i) => 380 + Math.sin(i * 0.4) * 60 + i * 5 + Math.random() * 30);
  const steel = days.map((_, i) => 45 + Math.sin(i * 0.3) * 8 + i * 0.5 + Math.random() * 5);
  const tools = days.map((_, i) => 18 + Math.cos(i * 0.5) * 4 + Math.random() * 3);

  makeChart('forecastChart', {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        { label: 'Cement (bags)', data: cement, borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.1)', fill: true, tension: 0.4, pointRadius: 2, yAxisID: 'y' },
        { label: 'Steel (rods)', data: steel, borderColor: '#4A90D9', fill: false, tension: 0.4, pointRadius: 2, yAxisID: 'y1' },
        { label: 'Tools (units)', data: tools, borderColor: '#52C97E', fill: false, tension: 0.4, pointRadius: 2, yAxisID: 'y1' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top', labels: { color: '#5A6070', font: { size: 11 }, padding: 16, boxWidth: 12 } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0', font: { size: 10 }, maxTicksLimit: 10 } },
        y: { position: 'left', grid: { color: '#F2F1EF' }, ticks: { color: '#9AA0B0', font: { size: 10 }, callback: v => v + ' bags' } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#9AA0B0', font: { size: 10 } } },
      },
    },
  });
}

function renderDemandMatrix() {
  if (!window.Chart) return;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  makeChart('demandMatrix', {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Cement', data: [320, 280, 420, 390, 480, 0], backgroundColor: 'rgba(200,169,110,0.8)', borderRadius: 4 },
        { label: 'Steel', data: [45, 38, 52, 48, 61, 0], backgroundColor: 'rgba(74,144,217,0.8)', borderRadius: 4 },
        { label: 'Tools', data: [18, 15, 22, 20, 24, 0], backgroundColor: 'rgba(82,201,126,0.8)', borderRadius: 4 },
        { label: 'Electrical', data: [32, 28, 38, 35, 44, 0], backgroundColor: 'rgba(155,114,217,0.8)', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top', labels: { color: '#5A6070', font: { size: 11 }, padding: 12, boxWidth: 12 } } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: '#9AA0B0' } },
        y: { stacked: true, grid: { color: '#F2F1EF' }, ticks: { color: '#9AA0B0' } },
      },
    },
  });
}

function renderStockoutList() {
  const el = document.getElementById('stockoutList');
  if (!el) return;
  el.innerHTML = DATA.stockouts.map(s => `
    <div class="stockout-item">
      <div class="si-name">${s.name}</div>
      <div class="si-detail">${s.detail}</div>
      <span class="si-days">${s.days}</span>
    </div>
  `).join('');
}

function renderReorderList() {
  const el = document.getElementById('reorderList');
  if (!el) return;
  el.innerHTML = DATA.reorderRecs.map(r => `
    <div class="reorder-item">
      <div class="ri-top">
        <span class="ri-name">${r.name}</span>
        <span class="ri-qty">${r.qty}</span>
      </div>
      <div style="font-size:0.75rem;color:var(--text-muted)">Supplier: ${r.supplier}</div>
      <div style="font-size:0.72rem;color:var(--accent-green);margin-top:3px">${r.saving}</div>
      <button class="ri-btn" onclick="reorderNow('${r.name}')">⚡ Reorder Now</button>
    </div>
  `).join('');
}

function runForecast() {
  showToast('✦ AI model running… forecast updated!', 'success');
  setTimeout(() => initForecast(), 500);
}

function reorderNow(name) {
  showToast(`Reorder initiated for ${name}`, 'success');
  navigate('orders');
  setTimeout(() => createOrder(), 300);
}

// ============================================================
// DEMAND AI
// ============================================================
function initDemand() {
  loadChartJS(() => {
    renderSeasonalChart();
    renderRegionChart();
    renderPriceChart();
  });
  renderAIInsights();
}

function renderSeasonalChart() {
  if (!window.Chart) return;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  makeChart('seasonalChart', {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'Cement Demand', data: [280, 260, 340, 320, 400, 360, 200, 180, 280, 380, 420, 360], borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#C8A96E' },
        { label: 'Steel Demand', data: [42, 38, 52, 48, 60, 52, 32, 28, 44, 58, 64, 54], borderColor: '#4A90D9', fill: false, tension: 0.4, pointRadius: 4 },
        { label: 'Electrical', data: [28, 24, 32, 30, 36, 40, 38, 42, 44, 50, 56, 48], borderColor: '#9B72D9', fill: false, tension: 0.4, pointRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top', labels: { color: '#5A6070', font: { size: 11 }, padding: 16, boxWidth: 12 } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0' } },
        y: { grid: { color: '#F2F1EF' }, ticks: { color: '#9AA0B0' } },
      },
    },
  });
}

function renderRegionChart() {
  if (!window.Chart) return;
  makeChart('regionChart', {
    type: 'doughnut',
    data: {
      labels: ['Koramangala', 'Whitefield', 'Indiranagar', 'HSR Layout', 'Electronic City'],
      datasets: [{
        data: [28, 22, 18, 16, 16],
        backgroundColor: ['#C8A96E', '#4A90D9', '#52C97E', '#9B72D9', '#E87E52'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      cutout: '60%', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { color: '#5A6070', font: { size: 10 }, padding: 8, boxWidth: 10 } } },
    },
  });
}

function renderPriceChart() {
  if (!window.Chart) return;
  makeChart('priceChart', {
    type: 'line',
    data: {
      labels: ['₹300', '₹350', '₹400', '₹420', '₹450', '₹480', '₹500'],
      datasets: [{
        label: 'Demand (bags/day)',
        data: [520, 480, 440, 420, 360, 300, 240],
        borderColor: '#E87E52',
        backgroundColor: 'rgba(232,126,82,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#E87E52',
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9AA0B0', font: { size: 10 } }, title: { display: true, text: 'Price per bag (₹)', color: '#9AA0B0', font: { size: 10 } } },
        y: { grid: { color: '#F2F1EF' }, ticks: { color: '#9AA0B0', font: { size: 10 } }, title: { display: true, text: 'Units demanded', color: '#9AA0B0', font: { size: 10 } } },
      },
    },
  });
}

function renderAIInsights() {
  const el = document.getElementById('aiInsights');
  if (!el) return;
  el.innerHTML = DATA.aiInsights.map(i => `
    <div class="ai-insight">
      <div class="aii-label">✦ ${i.label}</div>
      <div class="aii-text">${i.text}</div>
    </div>
  `).join('');
}

// ============================================================
// QR BILLING
// ============================================================
function initBilling() {
  renderRecentBills();
  updateBillTotals();
  animateQRPattern();
}

function renderRecentBills() {
  const el = document.getElementById('recentBills');
  if (!el) return;
  el.innerHTML = DATA.recentBills.map(b => `
    <div class="bill-list-item">
      <div>
        <div class="bli-name">${b.name}</div>
        <div class="bli-time">${b.time}</div>
      </div>
      <div class="bli-amount">${b.amount}</div>
    </div>
  `).join('');
}

function updateBillTotals() {
  const rows = document.querySelectorAll('#billItemsList .bill-item-row');
  let subtotal = 0;
  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.bir-qty')?.value) || 0;
    const price = parseFloat(row.querySelector('.bir-price')?.value) || 0;
    const total = qty * price;
    const totalEl = row.querySelector('.bir-total');
    if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    subtotal += total;
  });

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const s = document.getElementById('billSubtotal');
  const g = document.getElementById('billGST');
  const t = document.getElementById('billTotal');
  const q = document.getElementById('qrAmount');

  if (s) s.textContent = '₹' + subtotal.toLocaleString('en-IN');
  if (g) g.textContent = '₹' + Math.round(gst).toLocaleString('en-IN');
  if (t) t.textContent = '₹' + Math.round(total).toLocaleString('en-IN');
  if (q) q.textContent = '₹' + Math.round(total).toLocaleString('en-IN');
}

function addBillRow() {
  const list = document.getElementById('billItemsList');
  const div = document.createElement('div');
  div.className = 'bill-item-row';
  div.innerHTML = `
    <div class="bir-scan"><button class="qr-scan-btn" onclick="simulateScan(this)">📷 Scan</button></div>
    <input class="bir-product" type="text" placeholder="Product name or SKU" />
    <input class="bir-qty" type="number" placeholder="Qty" value="1" oninput="updateBillTotals()" />
    <input class="bir-price" type="number" placeholder="Price" oninput="updateBillTotals()" />
    <span class="bir-total">₹0</span>
    <button class="bir-del" onclick="removeBillRow(this)">✕</button>
  `;
  list.appendChild(div);
}

function removeBillRow(btn) {
  btn.closest('.bill-item-row').remove();
  updateBillTotals();
}

function simulateScan(btn) {
  const products = ['Portland Cement 50kg — ₹420', 'TMT Steel Bar — ₹6,800', 'PVC Pipe 4inch — ₹320', 'Power Drill HD — ₹4,500'];
  const picked = products[Math.floor(Math.random() * products.length)];
  const row = btn.closest('.bill-item-row');
  const productInput = row.querySelector('.bir-product');
  const priceInput = row.querySelector('.bir-price');
  if (productInput) productInput.value = picked.split(' — ')[0];
  const priceStr = picked.split('₹')[1]?.replace(',', '') || '0';
  if (priceInput) priceInput.value = priceStr;
  updateBillTotals();
  showToast('📷 Product scanned: ' + picked.split(' — ')[0], 'success');
}

function processBill() {
  const customer = document.getElementById('billCustomer').value || 'Walk-in';
  showToast(`✓ Bill processed for ${customer}`, 'success');
  DATA.recentBills.unshift({ name: customer, amount: document.getElementById('billTotal').textContent, time: 'Just now' });
  renderRecentBills();
}

function animateQRPattern() {
  // QR is decorative (CSS based), nothing needed
}

// ============================================================
// INVOICES
// ============================================================
function renderInvoices() {
  const el = document.getElementById('invoicesBody');
  if (!el) return;
  el.innerHTML = DATA.invoices.map(inv => `
    <tr>
      <td><span class="font-mono" style="font-size:0.78rem;color:var(--accent-blue)">${inv.id}</span></td>
      <td><strong>${inv.customer}</strong></td>
      <td style="color:var(--text-muted);font-size:0.82rem">${inv.date}</td>
      <td style="color:var(--text-muted);font-size:0.82rem">${inv.dueDate}</td>
      <td><strong style="color:var(--gold-3)">₹${inv.amount.toLocaleString('en-IN')}</strong></td>
      <td><span class="status-badge ${inv.status}">${cap(inv.status)}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="action-btn" onclick="downloadInvoice('${inv.id}')">↓ PDF</button>
          <button class="action-btn" onclick="sendInvoice('${inv.id}')">✉ Send</button>
          ${inv.status !== 'paid' ? `<button class="action-btn" onclick="markPaid('${inv.id}')">✓ Mark Paid</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function generateInvoice() {
  showToast('📄 Invoice generated and ready for download', 'success');
}

function downloadInvoice(id) {
  showToast(`↓ Downloading ${id}…`, 'info');
}

function sendInvoice(id) {
  showToast(`✉ Invoice ${id} sent via email`, 'success');
}

function markPaid(id) {
  const inv = DATA.invoices.find(i => i.id === id);
  if (inv) {
    inv.status = 'paid';
    renderInvoices();
    showToast(`✓ ${id} marked as paid`, 'success');
  }
}

// ============================================================
// DELIVERY
// ============================================================
function initDelivery() {
  renderDeliveryList();
  renderMapMarkers();
}

function renderDeliveryList() {
  const el = document.getElementById('deliveryList');
  if (!el) return;
  el.innerHTML = DATA.deliveries.map(d => `
    <div class="delivery-item">
      <div class="di-top">
        <span class="di-id">${d.id}</span>
        <span class="status-badge in-transit">In Transit</span>
      </div>
      <div class="di-name">${d.supplier} → ${d.destination}</div>
      <div class="di-route">Driver: ${d.driver} | Ref: ${d.orderRef}</div>
      <div class="di-progress">
        <div class="di-progress-fill" style="width:${d.progress}%;background:${d.status === 'green' ? 'var(--accent-green)' : d.status === 'orange' ? 'var(--accent-orange)' : 'var(--accent-red)'}"></div>
      </div>
      <div class="di-eta">ETA: ${d.eta} | ${d.progress}% complete</div>
    </div>
  `).join('');
}

function renderMapMarkers() {
  const el = document.getElementById('mapDeliveries');
  if (!el) return;
  el.innerHTML = DATA.deliveries.map(d => `
    <div class="map-marker" style="left:${d.x};top:${d.y}">
      <div class="marker-label">${d.id}</div>
      <div class="marker-dot ${d.status}"></div>
    </div>
  `).join('');
}

// ============================================================
// CONTRACTORS
// ============================================================
function renderContractors() {
  const el = document.getElementById('contractorsGrid');
  if (!el) return;
  el.innerHTML = DATA.contractors.map(c => `
    <div class="contractor-card">
      <div class="cc-avatar">${c.initials}</div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-type">${c.type}</div>
      <div style="margin-top:8px"><span class="cc-tier ${c.tier}">★ ${cap(c.tier)} Member</span></div>
      <div class="cc-stats">
        <div class="cc-stat">
          <div class="cc-stat-val">${c.totalOrders}</div>
          <div class="cc-stat-label">Orders</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-val">${c.totalSpend}</div>
          <div class="cc-stat-label">Spend</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-val">${c.credit}</div>
          <div class="cc-stat-label">Credit</div>
        </div>
      </div>
      <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:14px">Member since ${c.activeSince}</div>
      <div style="display:flex;gap:8px">
        <button class="btn-secondary" style="flex:1;font-size:0.8rem" onclick="showToast('Contacting ${c.name}…','info')">✉ Contact</button>
        <button class="btn-primary" style="flex:1;font-size:0.8rem" onclick="showToast('Viewing account: ${c.name}','info')">View Account</button>
      </div>
    </div>
  `).join('');
}

function addContractor() {
  showToast('Add Contractor form coming soon', 'info');
}

// ============================================================
// PRODUCTS
// ============================================================
function renderProducts(items) {
  const el = document.getElementById('productsGrid');
  if (!el) return;
  const list = items || DATA.products;

  el.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="pc-image">
        <span style="font-size:3.2rem">${p.icon}</span>
        <span class="pc-stock-tag ${p.status === 'in-stock' ? 'in-stock' : p.status === 'low-stock' ? 'low-stock' : 'out-stock'}">
          ${p.status === 'in-stock' ? 'In Stock' : p.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
        </span>
      </div>
      <div class="pc-body">
        <div class="pc-brand">${p.brand}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-footer">
          <div class="pc-price">₹${p.price.toLocaleString('en-IN')}</div>
          <button class="pc-add" onclick="addToCart('${p.name}')">+</button>
        </div>
      </div>
    </div>
  `).join('');

  if (!list.length) {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No products found</div>`;
  }
}

function searchProducts(val) {
  const q = val.toLowerCase();
  if (!q) { renderProducts(); return; }
  const filtered = DATA.products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
  renderProducts(filtered);
}

function toggleProductFilters() {
  const el = document.getElementById('productFilters');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function applyProductFilters() {
  const minPrice = parseFloat(document.getElementById('pfMinPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('pfMaxPrice').value) || Infinity;
  const brand = document.getElementById('pfBrand').value;
  const avail = document.getElementById('pfAvailability').value;

  let filtered = DATA.products.filter(p => {
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (brand && p.brand !== brand) return false;
    if (avail && p.status !== avail) return false;
    return true;
  });

  renderProducts(filtered);
  showToast(`Showing ${filtered.length} products`, 'info');
  document.getElementById('productFilters').style.display = 'none';
}

function addToCart(name) {
  showToast(`Added to bill: ${name}`, 'success');
  navigate('billing');
}

// ============================================================
// MODALS & PANELS
// ============================================================
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function showAlerts() {
  showReorderAlerts();
}

function showReorderAlerts() {
  const el = document.getElementById('reorderPanel');
  if (!el) return;
  el.style.display = 'block';
  renderReorderAlertsPanel();
}

function renderReorderAlertsPanel() {
  const el = document.getElementById('reorderAlertsList');
  if (!el) return;
  const lowStock = DATA.inventory.filter(i => i.stock <= i.reorderLevel);
  el.innerHTML = lowStock.map(item => {
    const pct = Math.round((item.stock / item.reorderLevel) * 100);
    return `
      <div class="ra-item">
        <div class="ra-name">${item.name}</div>
        <div class="ra-detail">Current: <strong>${item.stock}</strong> | Reorder at: ${item.reorderLevel} | Supplier: ${item.supplier}</div>
        <div class="ra-bar"><div class="ra-fill" style="width:${Math.min(pct, 100)}%"></div></div>
        <div class="ra-actions">
          <button class="btn-sm" onclick="reorderNow('${item.name}')">⚡ Reorder Now</button>
          <button class="btn-sm" onclick="showToast('Dismissing alert for ${item.name}','info')">Dismiss</button>
        </div>
      </div>
    `;
  }).join('');

  if (!lowStock.length) {
    el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted)">✓ All stock levels are healthy!</div>`;
  }
}

function closePanel(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
  if (e.target.classList.contains('panel-overlay')) {
    e.target.style.display = 'none';
  }
});

// ============================================================
// MOBILE SIDEBAR
// ============================================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'default') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ', default: '◈' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.default}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// GLOBAL SEARCH
// ============================================================
function handleSearch(val) {
  if (!val.trim()) return;
  const q = val.toLowerCase();

  // Check products
  const productMatch = DATA.products.filter(p => p.name.toLowerCase().includes(q));
  const inventoryMatch = DATA.inventory.filter(i => i.name.toLowerCase().includes(q));

  if (productMatch.length) {
    showToast(`Found ${productMatch.length} product(s) — go to Products`, 'info');
  } else if (inventoryMatch.length) {
    showToast(`Found ${inventoryMatch.length} in inventory`, 'info');
  }
}

// ============================================================
// EXPORT REPORT
// ============================================================
function exportReport() {
  showToast('📊 Report export queued — PDF generating…', 'info');
  setTimeout(() => showToast('✓ Report ready for download', 'success'), 2500);
}

// ============================================================
// BILL / INVOICE UTILS
// ============================================================
function removeBillRow(btn) {
  btn.closest('.bill-item-row').remove();
  updateBillTotals();
}

// ============================================================
// BILLING PAGE: live update inputs
// ============================================================
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('bir-qty') || e.target.classList.contains('bir-price')) {
    updateBillTotals();
  }
});

// ============================================================
// UTILITY
// ============================================================
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  loadChartJS(() => {
    initDashboard();
  });
});
