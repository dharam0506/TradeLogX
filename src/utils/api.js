const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token')

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

        // Handle 401 Unauthorized - token is invalid or expired
        if (response.status === 401) {
            // Clear invalid token
            removeToken()
            const errorData = await response.json().catch(() => ({}))
            const error = new Error(errorData.message || 'Authentication failed. Please log in again.')
            error.status = 401
            throw error
        }

        // Handle other errors
        if (!response.ok) {
            let errorMessage = 'Something went wrong'
            try {
                const data = await response.json()
                errorMessage = data.message || errorMessage
            } catch {
                errorMessage = `Server error: ${response.status} ${response.statusText}`
            }
            const error = new Error(errorMessage)
            error.status = response.status
            throw error
        }

        const data = await response.json()
        return data
    } catch (error) {
        // Handle network errors
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Cannot connect to server. Please ensure:\n1. Backend server is running (port 5000)\n2. MongoDB is connected\n3. Check terminal/console for errors')
        }
        throw error
    }
}

// Auth API functions
export const authAPI = {
    // Signup
    signup: async (email, password, name) => {
        return apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        })
    },

    // Login
    login: async (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
    },

    // Get current user
    getCurrentUser: async () => {
        return apiRequest('/auth/me')
    }
}

// Save token to localStorage
export const saveToken = (token) => {
    localStorage.setItem('token', token)
}

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token')
}

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token')
}

// Check if user is authenticated (checks if token exists)
export const isAuthenticated = () => {
    return !!getToken()
}

// Validate token with backend (async check)
export const validateToken = async () => {
    try {
        const response = await authAPI.getCurrentUser()
        return response.success
    } catch (error) {
        return false
    }
}

// Trade API functions
export const tradeAPI = {
    // Get all trades with optional filters
    getAllTrades: async (filters = {}) => {
        const queryParams = new URLSearchParams()
        if (filters.status) queryParams.append('status', filters.status)
        if (filters.symbol) queryParams.append('symbol', filters.symbol)
        if (filters.exchange) queryParams.append('exchange', filters.exchange)
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo)
        
        const queryString = queryParams.toString()
        const endpoint = `/trades${queryString ? `?${queryString}` : ''}`
        return apiRequest(endpoint)
    },

    // Get single trade by ID
    getTradeById: async (id) => {
        return apiRequest(`/trades/${id}`)
    },

    // Create new trade
    createTrade: async (tradeData) => {
        return apiRequest('/trades', {
            method: 'POST',
            body: JSON.stringify(tradeData)
        })
    },

    // Update trade
    updateTrade: async (id, tradeData) => {
        return apiRequest(`/trades/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tradeData)
        })
    },

    // Delete trade
    deleteTrade: async (id) => {
        return apiRequest(`/trades/${id}`, {
            method: 'DELETE'
        })
    },

    // Get trading statistics
    getTradeStats: async () => {
        return apiRequest('/trades/stats/summary')
    },

    // Get psychology patterns
    getPsychologyPatterns: async () => {
        return apiRequest('/trades/psychology/patterns')
    },

    // Analyze trade with AI
    analyzeTrade: async (id) => {
        return apiRequest(`/trades/${id}/analyze`, {
            method: 'POST'
        })
    }
}

// Market API functions
export const marketAPI = {
    // Get prediction for a stock
    getPrediction: async (symbol, exchange = 'NSE') => {
        const queryParams = new URLSearchParams({ exchange })
        return apiRequest(`/market/predict/${symbol}?${queryParams.toString()}`)
    }
}

