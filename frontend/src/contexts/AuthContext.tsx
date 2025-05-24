"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import type { User, AuthState } from "../types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Make sure this matches your backend URL
const API_URL = "http://localhost:8000/api"

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: true,
    error: null,
  })

  // Configure axios defaults
  axios.defaults.baseURL = API_URL

  // Add token to requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If error is 401 and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && !originalRequest._retry && authState.refreshToken) {
        originalRequest._retry = true

        try {
          const res = await axios.post("/token/refresh/", {
            refresh: authState.refreshToken,
          })

          const newToken = res.data.access
          localStorage.setItem("token", newToken)
          setAuthState((prev) => ({ ...prev, token: newToken }))

          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axios(originalRequest)
        } catch (refreshError) {
          // If refresh fails, logout
          logout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  // Load user data on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (authState.token) {
        try {
          const res = await axios.get("/users/me/")
          setAuthState((prev) => ({
            ...prev,
            user: res.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }))
        } catch (error) {
          console.error("Failed to load user:", error)
          setAuthState((prev) => ({
            ...prev,
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't show error for failed user load on initial load
          }))
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }))

      const res = await axios.post("/token/", { email, password })
      const { access, refresh } = res.data

      localStorage.setItem("token", access)
      localStorage.setItem("refreshToken", refresh)

      // Get user data
      const userRes = await axios.get("/users/me/", {
        headers: { Authorization: `Bearer ${access}` },
      })

      setAuthState({
        user: userRes.data,
        token: access,
        refreshToken: refresh,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "Login failed. Please try again."

      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again."
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. Please check your credentials."
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data?.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0]
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Cannot connect to server. Please check your internet connection and try again."
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "An unexpected error occurred"
      }

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setAuthState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }

  const register = async (userData: any) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }))

      const response = await axios.post("/register/", userData)
      console.log("Registration successful:", response.data)

      return response.data
    } catch (error: any) {
      console.error("Registration error:", error)
      let errorMessage = "Registration failed. Please try again."

      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.data) {
          const apiErrors = error.response.data
          const errorMessages = []
          for (const key in apiErrors) {
            if (Array.isArray(apiErrors[key])) {
              errorMessages.push(`${key}: ${apiErrors[key].join(", ")}`)
            } else {
              errorMessages.push(`${key}: ${apiErrors[key]}`)
            }
          }
          errorMessage = errorMessages.join("\n")
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Cannot connect to server. Please check your internet connection and try again."
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "An unexpected error occurred"
      }

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      throw error
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const res = await axios.put("/users/update_profile/", userData)
      setAuthState((prev) => ({
        ...prev,
        user: res.data,
        error: null,
      }))
    } catch (error: any) {
      let errorMessage = "Failed to update profile"

      if (error.response) {
        // Handle specific error responses
        if (error.response.data?.detail) {
          errorMessage = error.response.data.detail
        }
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check your internet connection."
      }

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      throw error
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await axios.post("/users/change_password/", {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword,
      })
    } catch (error: any) {
      let errorMessage = "Failed to change password"

      if (error.response) {
        // Handle specific error responses
        if (error.response.data?.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data?.old_password) {
          errorMessage = error.response.data.old_password[0]
        } else if (error.response.data?.new_password) {
          errorMessage = error.response.data.new_password[0]
        }
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check your internet connection."
      }

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
