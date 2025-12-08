"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { TicketList } from "@/components/tickets/ticket-list"
import { ReportDashboard } from "@/components/reports/report-dashboard"

type PageView = "dashboard" | "tickets" | "reports"

export default function StaffDashboard() {
  const [currentView, setCurrentView] = useState<PageView>("dashboard")
  const [userRole, setUserRole] = useState<"admin" | "technician" | "staff">("staff")

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={userRole} />
      case "tickets":
        return <TicketList userRole={userRole} />
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
