import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err?.response?.data?.detail || err.message || 'Network error';
    console.error('[API Error]', msg);
    return Promise.reject(new Error(msg));
  }
);

// Analytics
export const getKPIs = () => api.get('/api/analytics/kpis').then(r => r.data);

// Inventory
export const getInventory = (params = {}) => api.get('/api/inventory', { params }).then(r => r.data);
export const createInventoryItem = (data) => api.post('/api/inventory', data).then(r => r.data);
export const updateInventoryItem = (id, data) => api.patch(`/api/inventory/${id}`, data).then(r => r.data);
export const deleteInventoryItem = (id) => api.delete(`/api/inventory/${id}`).then(r => r.data);

// Suppliers
export const getSuppliers = (params = {}) => api.get('/api/suppliers', { params }).then(r => r.data);
export const createSupplier = (data) => api.post('/api/suppliers', data).then(r => r.data);
export const getSupplier = (id) => api.get(`/api/suppliers/${id}`).then(r => r.data);

// Orders
export const getOrders = (params = {}) => api.get('/api/orders', { params }).then(r => r.data);
export const createOrder = (data) => api.post('/api/orders', data).then(r => r.data);
export const updateOrder = (id, data) => api.patch(`/api/orders/${id}`, data).then(r => r.data);

// Contractors
export const getContractors = (params = {}) => api.get('/api/contractors', { params }).then(r => r.data);
export const createContractor = (data) => api.post('/api/contractors', data).then(r => r.data);

// Invoices
export const getInvoices = (params = {}) => api.get('/api/invoices', { params }).then(r => r.data);
export const createInvoice = (data) => api.post('/api/invoices', data).then(r => r.data);
export const markInvoicePaid = (id) => api.patch(`/api/invoices/${id}/mark-paid`).then(r => r.data);

// Deliveries
export const getDeliveries = (params = {}) => api.get('/api/deliveries', { params }).then(r => r.data);
export const updateDelivery = (id, data) => api.patch(`/api/deliveries/${id}`, data).then(r => r.data);

export default api;
