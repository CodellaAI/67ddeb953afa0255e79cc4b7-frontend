
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    
    if (token) {
      fetchUserData(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      username,
      password
    })
    
    const { token, user: userData } = response.data
    
    // Store token in localStorage
    localStorage.setItem('token', token)
    
    // Set user data
    setUser(userData)
    
    return userData
  }

  const register = async (username, email, password) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      username,
      email,
      password
    })
    
    return response.data
  }

  const logout = () => {
    // Remove token
    localStorage.removeItem('token')
    
    // Clear user data
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
