"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { UserCheck, Search, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { ticketService } from "@/lib/api/ticket.service"
import type { TicketResponse } from "@/types/ticket"

interface TicketAssignmentDialogProps {
  ticket: TicketResponse
  onAssignmentComplete?: (ticketId: string, staffId: string) => void
  trigger?: React.ReactNode
}

interface StaffMember {
  id: string;
  userName: string;
  email: string;
  role?: string;
  available?: boolean;
}

export function TicketAssignmentDialog({ ticket, onAssignmentComplete, trigger }: TicketAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [assignmentNote, setAssignmentNote] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [estimatedHours, setEstimatedHours] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [loadingStaff, setLoadingStaff] = useState(true)

  // Load staff on component mount
  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoadingStaff(true)
        const staff = await ticketService.getAvailableStaff()
        setStaffList(staff.map(s => ({ ...s, available: true })))
      } catch (error) {
        console.error('Failed to load staff:', error)
        toast.error("Could not load staff list")
      } finally {
        setLoadingStaff(false)
      }
    }
    
    if (open) {
      loadStaff()
    }
  }, [open])

  // Filter staff based on search term and availability
  const filteredStaff = staffList.filter(staff => 
    staff.available && 
    (staff.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (staff.role && staff.role.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const selectedStaff = staffList.find(staff => staff.id === selectedStaffId)

  const handleAssignment = async () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member to assign")
      return
    }

    setIsAssigning(true)
    try {
      console.log('🔄 Assignment request:', {
        ticketId: ticket.ticketId,
        staffId: selectedStaffId,
        note: assignmentNote,
        priority,
        estimatedHours
      })
      
      // Use real assignment API
      await ticketService.assignTicket(ticket.ticketId, selectedStaffId, assignmentNote)
      
      toast.success(`Ticket assigned to ${selectedStaff?.userName}`, {
        description: "The staff member has been notified"
      })
      
      onAssignmentComplete?.(ticket.ticketId, selectedStaffId)
      setOpen(false)
      
      // Reset form
      setSelectedStaffId("")
      setAssignmentNote("")
      setEstimatedHours("")
      setSearchTerm("")
    } catch (error: any) {
      console.error("Assignment failed:", error)
      toast.error("Failed to assign ticket", {
        description: error.response?.data?.message || "Please try again or contact administrator"
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <UserCheck size={16} />
      {ticket.assignedToUser ? 'Reassign' : 'Assign'}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck size={20} />
            Assign Ticket #{ticket.ticketId.slice(-6)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Summary */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Ticket Details</h4>
            <p className="font-medium">{ticket.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>📍 {ticket.room?.name || 'Unknown Room'}</span>
              <span>📊 {ticket.severity}</span>
              <span>🏷️ {ticket.status}</span>
            </div>
            {ticket.assignedToUser && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  Currently assigned to: {ticket.assignedToUser.userName}
                </Badge>
              </div>
            )}
          </div>

          {/* Staff Search */}
          <div className="space-y-3">
            <Label htmlFor="staff-search">Search Staff</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="staff-search"
                placeholder="Search by name, role, or department..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Staff Selection */}
          <div className="space-y-3">
            <Label>Available Staff ({filteredStaff.length})</Label>
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {loadingStaff ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                  <p>Loading staff...</p>
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No available staff found</p>
                  <p className="text-xs">Try adjusting your search terms</p>
                </div>
              ) : (
                filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStaffId === staff.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-secondary/50'
                    }`}
                    onClick={() => setSelectedStaffId(staff.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                        {staff.department && (
                          <p className="text-xs text-muted-foreground">{staff.department}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assignment Details */}
          {selectedStaffId && (
            <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium text-sm">Assignment Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimated-hours">Estimated Hours</Label>
                  <Input
                    id="estimated-hours"
                    type="number"
                    placeholder="e.g., 2"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    min="1"
                    max="40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignment-note">Assignment Notes (Optional)</Label>
                <Textarea
                  id="assignment-note"
                  placeholder="Add any special instructions or notes for the assigned staff..."
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isAssigning}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignment} 
              disabled={!selectedStaffId || isAssigning}
              className="gap-2"
            >
              {isAssigning ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Assign Ticket
                </>
              )}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}