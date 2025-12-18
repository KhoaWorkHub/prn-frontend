"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  UserX, 
  UserCheck,
  Clock,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"
import { ticketService } from "@/lib/api/ticket.service"
import { useAuth } from "@/lib/auth-context"
import type { TicketResponse } from "@/types/ticket"

interface TicketWorkflowActionsProps {
  ticket: TicketResponse
  onTicketUpdate: () => void
}

export function TicketWorkflowActions({ ticket, onTicketUpdate }: TicketWorkflowActionsProps) {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const isStaff = user?.roles.includes('Staff')
  const isAdmin = user?.roles.includes('Administrator') || user?.roles.includes('Manager')
  const isAssignedStaff = isStaff && ticket.assignedToUser?.userId === user.userId

  // Start Work Dialog
  const StartWorkDialog = () => {
    const [notes, setNotes] = useState("")
    const [open, setOpen] = useState(false)

    const handleStart = async () => {
      setIsProcessing(true)
      try {
        await ticketService.startTicket(ticket.ticketId, notes)
        toast.success("Work started on ticket")
        onTicketUpdate()
        setOpen(false)
        setNotes("")
      } catch (error: any) {
        toast.error("Failed to start work", {
          description: error.response?.data?.message || "Please try again"
        })
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <Play size={16} />
            Start Work
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Working on Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Work Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about starting this work..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleStart} disabled={isProcessing}>
                {isProcessing ? <Clock className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Start Work
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Complete Ticket Dialog
  const CompleteTicketDialog = () => {
    const [completionNotes, setCompletionNotes] = useState("")
    const [resolution, setResolution] = useState("")
    const [open, setOpen] = useState(false)

    const handleComplete = async () => {
      if (!completionNotes.trim() || !resolution.trim()) {
        toast.error("Please provide completion notes and resolution")
        return
      }

      setIsProcessing(true)
      try {
        await ticketService.completeTicket(ticket.ticketId, completionNotes, resolution)
        toast.success("Ticket completed successfully")
        onTicketUpdate()
        setOpen(false)
        setCompletionNotes("")
        setResolution("")
      } catch (error: any) {
        toast.error("Failed to complete ticket", {
          description: error.response?.data?.message || "Please try again"
        })
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <CheckCircle size={16} />
            Complete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Summary *</Label>
              <Textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completion-notes">Completion Notes *</Label>
              <Textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Add detailed notes about the work completed..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleComplete} disabled={isProcessing || !completionNotes.trim() || !resolution.trim()}>
                {isProcessing ? <Clock className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Complete Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Reassign Ticket Dialog
  const ReassignTicketDialog = () => {
    const [newStaffId, setNewStaffId] = useState("")
    const [reason, setReason] = useState("")
    const [staff, setStaff] = useState<any[]>([])
    const [open, setOpen] = useState(false)
    const [loadingStaff, setLoadingStaff] = useState(false)

    const loadStaff = async () => {
      if (loadingStaff) return
      setLoadingStaff(true)
      try {
        const staffData = await ticketService.getAvailableStaff()
        setStaff(staffData)
      } catch (error) {
        toast.error("Failed to load staff")
      } finally {
        setLoadingStaff(false)
      }
    }

    const handleReassign = async () => {
      if (!newStaffId || !reason.trim()) {
        toast.error("Please select staff and provide reason")
        return
      }

      setIsProcessing(true)
      try {
        await ticketService.reassignTicket(ticket.ticketId, newStaffId, reason)
        toast.success("Ticket reassigned successfully")
        onTicketUpdate()
        setOpen(false)
        setNewStaffId("")
        setReason("")
      } catch (error: any) {
        toast.error("Failed to reassign ticket", {
          description: error.response?.data?.message || "Please try again"
        })
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) loadStaff()
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <UserCheck size={16} />
            Reassign
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select New Staff</Label>
              <Select value={newStaffId} onValueChange={setNewStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} - {s.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reassign-reason">Reason for Reassignment *</Label>
              <Textarea
                id="reassign-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this ticket is being reassigned..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleReassign} disabled={isProcessing || !newStaffId || !reason.trim()}>
                {isProcessing ? <Clock className="w-4 h-4 animate-spin mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                Reassign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Quick Action Buttons
  const handleQuickAction = async (action: string) => {
    setIsProcessing(true)
    try {
      switch (action) {
        case 'unassign':
          await ticketService.unassignTicket(ticket.ticketId, 'Manual unassignment')
          toast.success("Ticket unassigned")
          break
        case 'reopen':
          await ticketService.reopenTicket(ticket.ticketId, 'Reopened for further investigation')
          toast.success("Ticket reopened")
          break
        case 'cancel':
          await ticketService.cancelTicket(ticket.ticketId, 'Cancelled by staff')
          toast.success("Ticket cancelled")
          break
        case 'close':
          await ticketService.closeTicket(ticket.ticketId, 'Completed', 'Work finished successfully')
          toast.success("Ticket closed")
          break
      }
      onTicketUpdate()
    } catch (error: any) {
      toast.error(`Failed to ${action} ticket`, {
        description: error.response?.data?.message || "Please try again"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Render different actions based on ticket status and user role
  const renderWorkflowActions = () => {
    const actions = []

    // Status-based actions for assigned staff
    if (isAssignedStaff) {
      if (ticket.status === 'Assigned') {
        actions.push(<StartWorkDialog key="start" />)
      }
      
      if (ticket.status === 'InProgress') {
        actions.push(<CompleteTicketDialog key="complete" />)
      }
      
      if (['Assigned', 'InProgress'].includes(ticket.status)) {
        actions.push(
          <Button key="unassign" variant="outline" size="sm" onClick={() => handleQuickAction('unassign')} className="gap-2">
            <UserX size={16} />
            Unassign
          </Button>
        )
      }
    }

    // Admin/Manager actions
    if (isAdmin) {
      if (ticket.assignedToUser && ['Assigned', 'InProgress'].includes(ticket.status)) {
        actions.push(<ReassignTicketDialog key="reassign" />)
      }

      if (['Closed', 'Resolved'].includes(ticket.status)) {
        actions.push(
          <Button key="reopen" variant="outline" size="sm" onClick={() => handleQuickAction('reopen')} className="gap-2">
            <RefreshCw size={16} />
            Reopen
          </Button>
        )
      }

      if (['Assigned', 'InProgress', 'Reported'].includes(ticket.status)) {
        actions.push(
          <Button key="cancel" variant="destructive" size="sm" onClick={() => handleQuickAction('cancel')} className="gap-2">
            <XCircle size={16} />
            Cancel
          </Button>
        )
      }

      if (ticket.status === 'Resolved') {
        actions.push(
          <Button key="close" size="sm" onClick={() => handleQuickAction('close')} className="gap-2">
            <CheckCircle size={16} />
            Close
          </Button>
        )
      }
    }

    return actions
  }

  const workflowActions = renderWorkflowActions()

  if (workflowActions.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Workflow Actions</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {workflowActions}
      </div>
      {isProcessing && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Clock size={12} className="animate-spin" />
          Processing action...
        </div>
      )}
    </div>
  )
}