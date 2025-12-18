"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ODataTickets } from "@/components/tickets/odata-tickets"
import { SwaggerAPIExplorer } from "@/components/api/swagger-api-explorer"

export default function ODataPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
        router.push('/auth/login')
      }
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <DashboardLayout allowedRoles={['Administrator', 'Manager']} title="OData API Explorer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Explorer</h1>
          <p className="text-muted-foreground">
            Test and explore all APIs from Swagger documentation
          </p>
        </div>
        
        <SwaggerAPIExplorer userRole={user.roles[0] || 'Admin'} />
        
        <ODataTickets userRole={user.roles[0] || 'Admin'} />
      </div>
    </DashboardLayout>
  )
}