import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Log all requests
api.interceptors.request.use((config) => {
  console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`)
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Log all responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ ${error.response?.status} ${error.config?.url}`, error.response?.data)
    return Promise.reject(error)
  }
)

// ────────────────────────────────────────────────────────────────
// AUTH API
// ────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (email, password, name, role = 'CITIZEN') =>
    api.post('/auth/register', { email, password, name, role }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/auth/me'),
}

// ────────────────────────────────────────────────────────────────
// IMAGE UPLOAD & VERIFICATION API
// ────────────────────────────────────────────────────────────────

export const imagesAPI = {
  verify: (imageFile, complaintCategory) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('complaintCategory', complaintCategory)
    return api.post('/images/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  attach: (complaintId, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.post(`/images/${complaintId}/attach`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// ────────────────────────────────────────────────────────────────
// COMPLAINTS API
// ────────────────────────────────────────────────────────────────

export const complaintsAPI = {
  createWithAI: (title, description, language = 'English') =>
    api.post('/complaints/ai', { title, description, language }),
  
  createManual: (data) =>
    api.post('/complaints/manual', data),
  
  getAll: (filters = {}) =>
    api.get('/complaints', { params: filters }),
  
  getById: (id) =>
    api.get(`/complaints/${id}`),
  
  updateStatus: (id, status) =>
    api.patch(`/complaints/${id}/status`, { status }),
  
  addUpdate: (id, message) =>
    api.post(`/complaints/${id}/updates`, { message }),
  
  getUpdates: (id) =>
    api.get(`/complaints/${id}/updates`),
  
  assign: (id, officerId) =>
    api.post(`/complaints/${id}/assign`, { officerId }),
}

// ────────────────────────────────────────────────────────────────
// DEPARTMENTS API
// ────────────────────────────────────────────────────────────────

export const departmentsAPI = {
  getAll: () =>
    api.get('/departments'),
  
  getById: (id) =>
    api.get(`/departments/${id}`),
  
  getComplaints: (id, filters = {}) =>
    api.get(`/departments/${id}/complaints`, { params: filters }),
}

// ────────────────────────────────────────────────────────────────
// ZONES API
// ────────────────────────────────────────────────────────────────

export const zonesAPI = {
  getAll: () =>
    api.get('/zones'),
  
  getById: (id) =>
    api.get(`/zones/${id}`),
  
  getWards: (zoneId) =>
    api.get(`/zones/${zoneId}/wards`),
}

// ────────────────────────────────────────────────────────────────
// ANALYTICS API
// ────────────────────────────────────────────────────────────────

export const analyticsAPI = {
  getStats: () =>
    api.get('/analytics/stats'),
  
  getZones: () =>
    api.get('/analytics/zones'),
  
  getDepartments: () =>
    api.get('/analytics/departments'),
  
  getCategories: () =>
    api.get('/analytics/categories'),
  
  getTimeseries: (days = 30) =>
    api.get('/analytics/timeseries', { params: { days } }),
}

// ────────────────────────────────────────────────────────────────
// LLM API (Proxy to Python backend)
// ────────────────────────────────────────────────────────────────

export const llmAPI = {
  health: () =>
    api.get('/llm/health'),
  
  chat: (messages, language = 'English') =>
    api.post('/llm/chat', { messages, language }),
  
  orchestrate: (title, description, language = 'English') =>
    api.post('/llm/orchestrate', { title, description, language }),
}

// ────────────────────────────────────────────────────────────────
// UTILS
// ────────────────────────────────────────────────────────────────

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('auth_token')
    delete api.defaults.headers.common.Authorization
  }
}

export const clearAuth = () => {
  setAuthToken(null)
}

export default api
