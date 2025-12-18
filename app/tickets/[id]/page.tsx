"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  Loader2,
  AlertCircle,
  Tag,
  Building
} from "lucide-react"
import { ticketService } from "@/lib/api/ticket.service"
import { useAuth } from "@/lib/auth-context"
import { TicketWorkflow } from "@/components/tickets/ticket-workflow" // Re-enabled with proper APIs
// import { TicketEditDialog } from "@/components/tickets/ticket-edit-dialog" // PUT /api/tickets/{id} disabled
// import { TicketDeleteDialog } from "@/components/tickets/ticket-delete-dialog" // DELETE /api/tickets/{id} disabled
import { TicketApprovalActions } from "@/components/tickets/ticket-approval-actions" // New component for workflow actions
import type { TicketResponse } from "@/types/ticket"
import { toast } from "sonner"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [ticket, setTicket] = useState<TicketResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const ticketId = params.id as string

  useEffect(() => {
    const fetchTicket = async () => {
      if (!user || !ticketId) {
        console.log('❌ Missing user or ticketId:', { user: !!user, ticketId })
        return
      }
      
      try {
        setLoading(true)
        console.log('🔄 Loading ticket details:', ticketId)
        console.log('👤 Current user:', {
          id: user.id,
          userName: user.userName,
          email: user.email,
          roles: user.roles
        })
        console.log('🏷️ User roles array:', user.roles)
        console.log('🎭 Role checks:', {
          isReporter: user.roles.includes('Reporter'),
          isStaff: user.roles.includes('Staff'),
          isAdmin: user.roles.includes('Administrator'),
          isManager: user.roles.includes('Manager')
        })
        
        // Try different endpoints based on user role
        let ticketData: TicketResponse
        
        // For Reporter: use their specific endpoint
        if (user.roles.includes('Reporter')) {
          console.log('📞 Calling getReporterReportedTicketById with ticketId:', ticketId)
          ticketData = await ticketService.getReporterReportedTicketById(ticketId)
        } 
        // For Staff: use their assigned tickets endpoint  
        else if (user.roles.includes('Staff')) {
          console.log('📞 Calling getStaffAssignedTicketById with ticketId:', ticketId)
          ticketData = await ticketService.getStaffAssignedTicketById(ticketId)
        } 
        // For Administrator/Manager: use general endpoint
        else if (user.roles.includes('Administrator') || user.roles.includes('Manager')) {
          console.log('📞 Calling getTicketById with ticketId:', ticketId)
          ticketData = await ticketService.getTicketById(ticketId)
        } 
        else {
          console.log('❌ User has no valid roles for ticket access:', user.roles)
          throw new Error('No valid role for ticket access')
        }
        
        console.log('✅ Ticket details loaded successfully:', ticketData)
        setTicket(ticketData)
      } catch (error: any) {
        console.error('❌ Failed to load ticket details:', error)
        setError(error.response?.data?.message || 'Failed to load ticket details')
        toast.error("Could not load ticket details", {
          description: "Please check if you have permission to view this ticket"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [user, ticketId])

  const handleTicketUpdate = () => {
    // Refresh ticket data after workflow action
    if (ticketId) {
      const fetchUpdatedTicket = async () => {
        try {
          let ticketData: TicketResponse
          
          if (user?.roles.includes('Reporter')) {
            ticketData = await ticketService.getReporterReportedTicketById(ticketId)
          } else if (user?.roles.includes('Staff')) {
            ticketData = await ticketService.getStaffAssignedTicketById(ticketId)
          } else {
            ticketData = await ticketService.getTicketById(ticketId)
          }
          
          setTicket(ticketData)
          toast.success("Ticket updated successfully")
        } catch (error) {
          console.error('Failed to refresh ticket:', error)
        }
      }
      
      fetchUpdatedTicket()
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "Reported": "bg-yellow-100 text-yellow-800",
      "WaitingForAssignment": "bg-orange-100 text-orange-800", 
      "Assigned": "bg-blue-100 text-blue-800",
      "Reviewing": "bg-purple-100 text-purple-800",
      "InProgress": "bg-indigo-100 text-indigo-800",
      "WaitingForPartApproval": "bg-amber-100 text-amber-800",
      "WaitingForParts": "bg-pink-100 text-pink-800",
      "WaitingForCloseApproval": "bg-teal-100 text-teal-800",
      "Closed": "bg-green-100 text-green-800",
    }
    
    const labels: Record<string, string> = {
      "Reported": "Reported",
      "WaitingForAssignment": "Waiting Assignment",
      "Assigned": "Assigned",
      "Reviewing": "Under Review",
      "InProgress": "In Progress",
      "WaitingForPartApproval": "Waiting Part Approval",
      "WaitingForParts": "Waiting Parts",
      "WaitingForCloseApproval": "Waiting Close Approval",
      "Closed": "Closed",
    }

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      "A": "bg-red-100 text-red-800 border-red-300",
      "B": "bg-orange-100 text-orange-800 border-orange-300", 
      "C": "bg-blue-100 text-blue-800 border-blue-300",
    }

    return (
      <Badge variant="outline" className={colors[severity] || "bg-gray-100 text-gray-800"}>
        Priority {severity}
      </Badge>
    )
  }

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['Administrator', 'Manager', 'Staff', 'Reporter']} title="Ticket Details">
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading ticket details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !ticket) {
    return (
      <DashboardLayout allowedRoles={['Administrator', 'Manager', 'Staff', 'Reporter']} title="Ticket Details">
        <Card className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Unable to load ticket</h3>
          <p className="text-muted-foreground mb-6">
            {error || "Ticket not found or you don't have permission to view it"}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={['Administrator', 'Manager', 'Staff', 'Reporter']} title="Ticket Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Ticket #{ticket.ticketId.slice(-6)}</h1>
              <p className="text-muted-foreground">Complete ticket workflow and details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(ticket.status)}
            {getSeverityBadge(ticket.severity)}
            {/* NOTE: Edit/Delete buttons removed - backend APIs are disabled
                - PUT /api/tickets/{id} is commented out
                - DELETE /api/tickets/{id} is commented out
            */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{ticket.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {ticket.description}
              </p>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.room?.name || 'Unknown Room'}
                  </p>
                  {ticket.room?.campus && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {ticket.room.campus.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Reporter</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.createdBy?.userName || 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.createdBy?.email}
                  </p>
                </div>
              </div>

              {ticket.assignedToUser && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Assigned Staff</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ticket.assignedToUser.userName} ({ticket.assignedToUser.email})
                    </p>
                    {ticket.assignedAt && (
                      <p className="text-xs text-muted-foreground">
                        Assigned on {new Date(ticket.assignedAt).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                </>
              )}
            </Card>

            {/* Ticket Issues */}
            {ticket.ticketIssues && ticket.ticketIssues.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Reported Issues</h3>
                <div className="space-y-2">
                  {ticket.ticketIssues.map((issue, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline">
                        {issue.issueType?.name || 'Other Issue'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Ticket Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {ticket.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <span>{new Date(ticket.dueDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
                {ticket.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolved</span>
                    <span>{new Date(ticket.resolvedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
                {ticket.closedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Closed</span>
                    <span>{new Date(ticket.closedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Workflow Actions */}
            <TicketApprovalActions 
              ticket={ticket} 
              user={user}
              onActionComplete={handleTicketUpdate}
            />
            
            {/* Ticket Workflow Timeline */}
            <TicketWorkflow 
              ticket={ticket}
              onTicketUpdate={handleTicketUpdate}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}