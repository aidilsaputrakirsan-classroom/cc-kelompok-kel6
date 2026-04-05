import axios from 'axios'

const API_BASE_URL = 'http://localhost'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.params = {
      ...config.params,
      token,
    }
  }
  return config
})

// Auth endpoints
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  // Ketua only
  listUsers: () =>
    api.get('/auth/users'),
  
  createUser: (username, email, password, role) =>
    api.post('/auth/users', { username, email, password }, { params: { role } }),
  
  updateUser: (userId, data) =>
    api.put(`/auth/users/${userId}`, data),
  
  deleteUser: (userId) =>
    api.delete(`/auth/users/${userId}`),
}

// Finance endpoints
export const financeAPI = {
  // Categories
  getCategories: () =>
    api.get('/finance/categories'),
  
  createCategory: (name, type) =>
    api.post('/finance/categories', { name, type }),
  
  updateCategory: (categoryId, data) =>
    api.put(`/finance/categories/${categoryId}`, data),
  
  deleteCategory: (categoryId) =>
    api.delete(`/finance/categories/${categoryId}`),
  
  // Transactions
  getTransactions: () =>
    api.get('/finance/transactions'),
  
  getTransaction: (transactionId) =>
    api.get(`/finance/transactions/${transactionId}`),
  
  createTransaction: (categoryId, amount, description, type) =>
    api.post('/finance/transactions', { category_id: categoryId, amount, description, type }),
  
  updateTransaction: (transactionId, data) =>
    api.put(`/finance/transactions/${transactionId}`, data),
  
  deleteTransaction: (transactionId) =>
    api.delete(`/finance/transactions/${transactionId}`),
  
  // Cashflow
  getCashflow: () =>
    api.get('/finance/cashflow'),
}

// Letter endpoints
export const letterAPI = {
  getLetters: () =>
    api.get('/letter/letters'),
  
  getLetter: (letterId) =>
    api.get(`/letter/letters/${letterId}`),
  
  createLetter: (type, title, content, senderName, recipientName, filePath) =>
    api.post('/letter/letters', {
      type,
      title,
      content,
      sender_name: senderName,
      recipient_name: recipientName,
      file_path: filePath,
    }),
  
  updateLetter: (letterId, data) =>
    api.put(`/letter/letters/${letterId}`, data),
  
  deleteLetter: (letterId) =>
    api.delete(`/letter/letters/${letterId}`),
  
  getNextNumber: (type = 'in') =>
    api.get('/letter/letters/next-number', { params: { type } }),
}

export default api
