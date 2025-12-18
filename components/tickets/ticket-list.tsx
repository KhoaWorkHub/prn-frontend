"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Filter, Eye, Edit, Trash2, Clock, Loader2, UserCheck, Package, FileCheck, CheckCircle, Play, XCircle, RefreshCw, UserX } from "lucide-react"
import { ticketService } from "@/lib/api/ticket.service"
import { useAuth } from "@/lib/auth-context"
import type { TicketResponse } from "@/types/ticket"
// import { TicketAssignmentDialog } from "./ticket-assignment-dialog" // Uses assignTicket API which doesn't exist
import { TicketApprovalDialog } from "./ticket-approval-dialog"
// import { TicketEditDialog } from "./ticket-edit-dialog" // PUT /api/tickets/{id} disabled
// import { TicketDeleteDialog } from "./ticket-delete-dialog" // DELETE /api/tickets/{id} disabled
// import { BulkOperations } from "./bulk-operations" // Not available in backend

interface TicketListProps {
  userRole: string
}

const mockTickets = [
  {
    id: "#1205",
    title: "WiFi not working in A205",
    room: "A205 - Classroom",
    reporter: "Nguyễn Văn A",
    priority: "High",
    status: "Resolving",
    created: "2 hours ago",
    dueIn: "4 hours",
    sla: "On Track",
    assigned: "Tech 01",
  },
  {
    id: "#1204",
    title: "AC leaking water",
    room: "B104 - Meeting Room",
    reporter: "Trần Thị B",
    priority: "Urgent",
    status: "Assigned",
    created: "6 hours ago",
    dueIn: "1 hour",
    sla: "Overdue",
    assigned: "Tech 02",
  },
  {
    id: "#1203",
    title: "Projector bulb burned",
    room: "A101 - Lecture Hall",
    reporter: "Lê Văn C",
    priority: "Medium",
    status: "New",
    created: "8 hours ago",
    dueIn: "8 hours",
    sla: "On Track",
    assigned: "Unassigned",
  },
  {
    id: "#1202",
    title: "Internet slow - WiFi bandwidth issue",
    room: "Computer Lab C",
    reporter: "Phạm Minh D",
    priority: "High",
    status: "Resolved",
    created: "12 hours ago",
    dueIn: "Resolved",
    sla: "On Time",
    assigned: "Tech 03",
  },
]

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Assigned: "bg-yellow-100 text-yellow-800",
  Resolving: "bg-purple-100 text-purple-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
}

const priorityColors: Record<string, string> = {
  Low: "text-blue-600",
  Medium: "text-yellow-600",
  High: "text-orange-600",
  Urgent: "text-red-600",
}

const slaColors: Record<string, string> = {
  "On Track": "text-green-600",
  "On Time": "text-green-600",
  Overdue: "text-red-600",
}

export function TicketList({ userRole }: TicketListProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  // NOTE: Direct workflow actions not available - backend uses approval workflow only

  // Load tickets from backend based on user role
  useEffect(() => {
    const loadTickets = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        console.log('🔄 Loading tickets for roles:', user.roles)
        
        let ticketData: TicketResponse[]
        
        // Use role-specific APIs as shown in Swagger
        if (user.roles.includes('Reporter')) {
          ticketData = await ticketService.getReporterReportedTickets()
          console.log('✅ Loaded reporter tickets:', ticketData)
        } else if (user.roles.includes('Staff')) {
          ticketData = await ticketService.getStaffAssignedTickets()
          console.log('✅ Loaded staff assigned tickets:', ticketData)
        } else {
          // Admin/Manager can see all tickets
          ticketData = await ticketService.getTickets()
          console.log('✅ Loaded all tickets:', ticketData)
        }
        
        setTickets(ticketData || [])
      } catch (error: any) {
        console.error('❌ Failed to load tickets:', error)
        
        if (error.response?.status === 401) {
          setError('Authentication required - please login to view tickets')
          setTickets([]) // Don't show mock data for auth errors
        } else if (error.response?.status === 403) {
          setError('Access denied - insufficient permissions')
          setTickets([]) 
        } else {
          setError('Failed to load tickets from server')
          // Fallback to mock data if API fails (but not for auth errors)
          setTickets(mockTickets.map(ticket => ({
            ticketId: ticket.id,
            title: ticket.title,
            description: ticket.title,
            status: ticket.status as any,
            severity: ticket.priority as any,
            createdAt: new Date().toISOString(),
            room: { roomId: '1', name: ticket.room, campus: { campusId: '1', name: 'Campus' } },
            createdBy: { id: '1', userName: ticket.reporter, email: 'test@test.com' },
            closeReason: null,
            assignedAt: null,
            resolvedAt: null,
            dueDate: null,
            closedAt: null,
            roomId: '1',
            facilityTypeId: '1',
            assignedToUserId: null,
            createdByUserId: '1',
            assignedToUser: null,
            ticketIssues: [],
            ticketHistories: []
          } as TicketResponse)))
        }
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm">⚠️ {error}. Showing fallback data.</p>
        </Card>
      )}
      
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={18} className="mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["All", "New", "Assigned", "Resolving", "Resolved"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            <Filter size={16} className="mr-1" />
            {status}
          </Button>
        ))}
      </div>

      {/* NOTE: Bulk operations not available in backend */}

      {/* Tickets Table */}
      <Card className="bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Ticket ID</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Room</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Reporter</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Priority</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Assigned</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">SLA</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="opacity-50" />
                      <p className="text-lg">No tickets found</p>
                      <p className="text-sm">Create your first ticket to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedTickets.includes(ticket.ticketId)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTickets([...selectedTickets, ticket.ticketId])
                          } else {
                            setSelectedTickets(selectedTickets.filter(id => id !== ticket.ticketId))
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-primary">#{ticket.ticketId.slice(-4)}</td>
                    <td className="px-6 py-4 text-foreground max-w-xs">{ticket.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{ticket.room?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{ticket.createdBy?.userName || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[ticket.status] || statusColors.New}>{ticket.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${priorityColors[ticket.severity] || priorityColors.Medium}`}>{ticket.severity}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{ticket.assignedToUser?.userName || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-green-600" />
                        <span className="font-semibold text-green-600">On Track</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          title="View Details"
                          onClick={() => window.location.href = `/tickets/${ticket.ticketId}`}
                        >
                          <Eye size={16} />
                        </Button>
                        {/* NOTE: Assignment APIs not available in backend - assignments done through disabled PUT endpoint */}
                        {/* NOTE: Direct workflow actions removed - not available in backend */}
                        
                        {/* Staff approval actions */}
                        {userRole === 'Staff' && ticket.status === 'Assigned' && (
                          <>
                            <TicketApprovalDialog 
                              ticket={ticket}
                              approvalType="order-part"
                              onApprovalComplete={(ticketId, approved) => {
                                console.log(`Part order ${approved ? 'approved' : 'rejected'} for ticket ${ticketId}`)
                                loadTickets()
                              }}
                              trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Request Parts">
                                  <Package size={16} />
                                </Button>
                              }
                            />
                            <TicketApprovalDialog 
                              ticket={ticket}
                              approvalType="close"
                              onApprovalComplete={(ticketId, approved) => {
                                console.log(`Close request submitted for ticket ${ticketId}`)
                                loadTickets()
                              }}
                              trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Request Close">
                                  <CheckCircle size={16} />
                                </Button>
                              }
                            />
                          </>
                        )}
                        {/* Manager/Admin approval actions */}
                        {(userRole === 'Admin' || userRole === 'Manager') && (
                          <TicketApprovalDialog 
                            ticket={ticket}
                            approvalType="review"
                            onApprovalComplete={(ticketId, approved) => {
                              console.log(`Review ${approved ? 'approved' : 'rejected'} for ticket ${ticketId}`)
                              loadTickets()
                            }}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600" title="Review Approval">
                                <FileCheck size={16} />
                              </Button>
                            }
                          />
                        )}
                        {/* NOTE: Edit and Delete APIs are commented out in backend 
                            - PUT /api/tickets/{id} is disabled
                            - DELETE /api/tickets/{id} is disabled
                        */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
