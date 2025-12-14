"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
  return (
    <DashboardLayout allowedRoles={['Reporter']} title="Reporter Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome, Reporter!</h2>
          <p className="text-gray-600 mb-4">
            Create and track your facility issue reports
          </p>
          <Link href="/user/tickets/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              Create New Ticket
            </Button>
          </Link>
        </Card>

        {/* Info Card - Backend APIs not ready yet */}
        <Card className="p-6 border-2 border-dashed border-blue-300 bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Ticket Management Coming Soon
              </h3>
              <p className="text-sm text-blue-700">
                Backend APIs for tickets are being developed. Currently only authentication (login/logout/register) is fully functional.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Available now:</strong> Login, Logout, Register, User Profile
              </p>
              <p className="text-sm text-blue-700">
                <strong>Coming soon:</strong> Create Tickets, View My Tickets, Track Status
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
