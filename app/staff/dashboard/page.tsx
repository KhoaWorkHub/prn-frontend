"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { AlertCircle, Wrench } from "lucide-react"

export default function StaffDashboard() {
  return (
    <DashboardLayout allowedRoles={['Staff']} title="Staff Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold">Welcome, Staff Member!</h2>
          </div>
          <p className="text-gray-600">
            Manage assigned tickets and update progress
          </p>
        </Card>

        {/* Info Card - Backend APIs not ready yet */}
        <Card className="p-6 border-2 border-dashed border-amber-300 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Staff Features Coming Soon
              </h3>
              <p className="text-sm text-amber-700">
                Backend APIs for staff ticket management are being developed. Currently only authentication is fully functional.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                <strong>Available now:</strong> Login, Logout
              </p>
              <p className="text-sm text-amber-700">
                <strong>Coming soon:</strong> View Assigned Tickets, Update Progress, Acknowledge Tasks, Request Parts, Request Close Approval
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
