"use client"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Função para obter todos os usuários cadastrados
  const getUsers = (): User[] => {
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem("users")
      return storedUsers ? JSON.parse(storedUsers) : []
    }
    return []
  }

  const login = async (email: string, password: string) => {
  setIsLoading(true)
  
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Check for default admin user first (always check this)
    if (email === "admin@cine.com" && password === "admin123") {
      const adminUser = {
        id: "1",
        name: "Admin User",
        email: "admin@cine.com",
        password: "admin123",
        role: "admin" as const,
      }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      
      // Make sure admin is in the users list
      const users = getUsers()
      if (!users.some(u => u.email === "admin@cine.com")) {
        localStorage.setItem("users", JSON.stringify([...users, adminUser]))
      }
      
      setIsLoading(false)
      return true
    }
    
    // Then check regular users
    const users = getUsers()
    const foundUser = users.find(user => 
      user.email === email && user.password === password
    )

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  } catch (error) {
    setIsLoading(false)
    return false
  }
}

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const users = getUsers()
      
      // Check if email already exists
      const emailExists = users.some(user => user.email === email)
      if (emailExists) {
        setIsLoading(false)
        return false
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "user"
      }

      // Save new user to users list
      const updatedUsers = [...users, newUser]
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Automatically log in the new user
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
