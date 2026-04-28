"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLoading } from "./loading-context"

type UserRole = "user" | "admin" | null

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS = [
  {
    id: "1",
    email: "usuario@truckparts.com",
    password: "usuario123",
    name: "Juan Pérez",
    role: "user" as UserRole,
  },
  {
    id: "2",
    email: "admin@truckparts.com",
    password: "admin123",
    name: "Carlos Admin",
    role: "admin" as UserRole,
  },
]

function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null
  try {
    const saved = localStorage.getItem("truck-parts-user")
    if (saved) return JSON.parse(saved)
  } catch {
    localStorage.removeItem("truck-parts-user")
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showLoading, hideLoading, isLoadingScreenEnabled } = useLoading()

  useEffect(() => {
    setUser(loadUserFromStorage())
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLoadingScreenEnabled) showLoading()
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const foundUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      }
      setUser(userData)
      localStorage.setItem("truck-parts-user", JSON.stringify(userData))
      hideLoading()
      return true
    }

    hideLoading()
    return false
  }

  const logout = async () => {
    if (isLoadingScreenEnabled) showLoading()
    await new Promise((resolve) => setTimeout(resolve, 800))
    setUser(null)
    localStorage.removeItem("truck-parts-user")
    hideLoading()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
