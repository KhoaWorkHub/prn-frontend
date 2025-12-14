"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2, User } from "lucide-react"
import { toast } from "sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
  allowedRoles: string[]
  title: string
}

export function DashboardLayout({ children, allowedRoles, title }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  // Protected route
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to continue')
      router.push('/auth/login')
    } else if (user && !allowedRoles.some(role => user.roles.includes(role))) {
      toast.error('Access denied')
      // Redirect to appropriate dashboard based on role
      if (user.roles.includes('Administrator') || user.roles.includes('Manager')) {
        router.push('/admin/dashboard')
      } else if (user.roles.includes('Staff')) {
        router.push('/staff/dashboard')
      } else if (user.roles.includes('Reporter')) {
        router.push('/user/dashboard')
      } else {
        router.push('/')
      }
    }
  }, [user, loading, router, allowedRoles])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render until authentication is confirmed
  if (!user || !allowedRoles.some(role => user.roles.includes(role))) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Logout */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">FPT</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                <p className="text-xs text-gray-500">Facility Helpdesk</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.roles.join(', ')}</p>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
