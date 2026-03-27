import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setAuthToken, clearAuth } from '../api/client'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('auth_token'))

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setAuthToken(token)
          const res = await authAPI.getMe()
          setUser(res.data)
        } catch (error) {
          console.error('Failed to load user:', error)
          clearAuth()
          setToken(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password)
      const { token, user } = res.data
      
      setAuthToken(token)
      setToken(token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const register = async (email, password, name, role = 'CITIZEN') => {
    try {
      const res = await authAPI.register(email, password, name, role)
      const { token, user } = res.data
      
      setAuthToken(token)
      setToken(token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' }
    }
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  return (
    <AppContext.Provider value={{
      sidebarOpen, setSidebarOpen,
      selectedComplaint, setSelectedComplaint,
      filterStatus, setFilterStatus,
      searchQuery, setSearchQuery,
      user,
      token,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
