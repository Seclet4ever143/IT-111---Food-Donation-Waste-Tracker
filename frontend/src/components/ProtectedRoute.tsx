"use client"

import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If roles are specified and user doesn't have the required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === "donor") {
      return <Navigate to="/donor/dashboard" replace />
    } else if (user.role === "charity") {
      return <Navigate to="/charity/dashboard" replace />
    }

    // Fallback to login if role is unknown
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute