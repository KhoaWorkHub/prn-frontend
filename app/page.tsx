"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { TicketList } from "@/components/tickets/ticket-list"
import { CategoryManagement } from "@/components/management/category-management"
import { RoomManagement } from "@/components/management/room-management"
import { ReportDashboard } from "@/components/reports/report-dashboard"

type PageView = "dashboard" | "tickets" | "categories" | "rooms" | "reports" | "escalations"

export default function Home() {
  const [currentView, setCurrentView] = useState<PageView>("dashboard")
  const [userRole, setUserRole] = useState<"admin" | "technician" | "staff">("admin")

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
