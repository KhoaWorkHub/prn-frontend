"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, Clock, MapPin, Loader2, Plus } from "lucide-react"
import { ticketService } from "@/lib/api/ticket.service"
import { useAuth } from "@/lib/auth-context"
import type { TicketResponse } from "@/types/ticket"
import { toast } from "sonner"

export default function ReporterDashboard() {
  const { user } = useAuth()
  const [reportedTickets, setReportedTickets] = useState<TicketResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReportedTickets = async () => {
      try {
        console.log('🔄 Loading reporter reported tickets...')
        const tickets = await ticketService.getReporterReportedTickets()
        console.log('✅ Reporter reported tickets loaded:', tickets)
        setReportedTickets(tickets)
      } catch (error: any) {
        console.error('❌ Failed to load reported tickets:', error)
        toast.error("Could not load reported tickets", {
          description: error.response?.data?.message || "Please check your connection"
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.roles.includes('Reporter')) {
      fetchReportedTickets()
    }
  }, [user])

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
      "A": "bg-red-100 text-red-800",
      "B": "bg-orange-100 text-orange-800", 
      "C": "bg-blue-100 text-blue-800",
    }

    return (
      <Badge variant="outline" className={colors[severity] || "bg-gray-100 text-gray-800"}>
        Priority {severity}
      </Badge>
    )
  }

  const handleViewTicket = (ticketId: string) => {
    console.log('🔍 Viewing reporter ticket:', ticketId)
    window.location.href = `/tickets/${ticketId}`
  }

  const handleCreateTicket = () => {
    console.log('➕ Creating new ticket')
    window.location.href = `/tickets/create`
  }

  return (
    <DashboardLayout allowedRoles={['Reporter']} title="Reporter Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold">Welcome, Reporter!</h2>
              </div>
              <p className="text-gray-600">
                Track your reported issues and create new tickets
              </p>
            </div>
            <Button onClick={handleCreateTicket} className="gap-2">
              <Plus className="w-4 h-4" />
              Report New Issue
            </Button>
          </div>
        </Card>

        {/* My Reported Tickets */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Reported Tickets</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Loading reported tickets...</p>
              </div>
            </div>
          ) : reportedTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tickets reported yet</p>
              <p className="text-sm">Report your first issue to get started</p>
              <Button 
                onClick={handleCreateTicket} 
                className="mt-4 gap-2"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                Create Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reportedTickets.map((ticket) => (
                <div key={ticket.ticketId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">#{ticket.ticketId.slice(-6)}</h4>
                        {getStatusBadge(ticket.status)}
                        {getSeverityBadge(ticket.severity)}
                      </div>
                      <h5 className="font-medium mb-1">{ticket.title}</h5>
                      <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ticket.room?.name || 'Unknown Room'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        {ticket.assignedToUser && (
                          <div className="text-blue-600">
                            Assigned to: {ticket.assignedToUser.userName}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTicket(ticket.ticketId)}
                      className="gap-2"
                    >
                      <Eye size={16} />
                      View Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}