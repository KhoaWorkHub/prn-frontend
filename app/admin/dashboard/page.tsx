"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { TicketList } from "@/components/tickets/ticket-list"
import { CategoryManagement } from "@/components/management/category-management"
import { RoomManagement } from "@/components/management/room-management"
import { ReportDashboard } from "@/components/reports/report-dashboard"
import { WorkflowScenario } from "@/components/demo/workflow-scenario"

type PageView = "dashboard" | "tickets" | "categories" | "rooms" | "reports" | "escalations" | "demo"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<PageView>("dashboard")
  const [userRole, setUserRole] = useState<"admin" | "technician" | "staff">("admin")

  // Protected route - only Administrator and Manager allowed
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    } else if (user && !user.roles.includes('Administrator') && !user.roles.includes('Manager')) {
      // Redirect non-admin users to their appropriate dashboard
      if (user.roles.includes('Staff')) {
        router.push('/staff/dashboard')
      } else if (user.roles.includes('Reporter')) {
        router.push('/user/dashboard')
      } else {
        router.push('/')
      }
    }
  }, [user, loading, router])

  // Show loading while checking authentication
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
  if (!user || (!user.roles.includes('Administrator') && !user.roles.includes('Manager'))) {
    return null
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={userRole} />
      case "tickets":
        return <TicketList userRole={userRole} />
      case "categories":
        return <CategoryManagement />
      case "rooms":
        return <RoomManagement />
      case "reports":
        return <ReportDashboard />
      case "demo":
        return <WorkflowScenario />
      default:
        return <Dashboard userRole={userRole} />
    }
  }

  return (
    <MainLayout currentView={currentView} onViewChange={setCurrentView} userRole={userRole} onRoleChange={setUserRole}>
      {renderView()}
    </MainLayout>
  )
}
