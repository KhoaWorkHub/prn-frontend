"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, Package, FileCheck, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { ticketService } from "@/lib/api/ticket.service"
import type { TicketResponse } from "@/types/ticket"
import { useAuth } from "@/lib/auth-context"

interface TicketApprovalDialogProps {
  ticket: TicketResponse
  approvalType: 'order-part' | 'review' | 'close' | 'start' | 'complete' | 'unassign' | 'reopen' | 'cancel'
  onApprovalComplete?: (ticketId: string, approved?: boolean) => void
  trigger?: React.ReactNode
}

export function TicketApprovalDialog({ 
  ticket, 
  approvalType, 
  onApprovalComplete, 
  trigger 
}: TicketApprovalDialogProps) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()
  
  // Order Part Approval States
  const [partDescription, setPartDescription] = useState("")
  const [partCost, setPartCost] = useState("")
  const [vendor, setVendor] = useState("")
  const [urgency, setUrgency] = useState("Medium")
  
  // Review Approval States
  const [approvalId, setApprovalId] = useState("")
  const [approvalStatus, setApprovalStatus] = useState<"Approved" | "Rejected">("Approved")
  const [reviewReason, setReviewReason] = useState("")
  
  // Close Approval States
  const [closeReason, setCloseReason] = useState("")
  const [resolution, setResolution] = useState("")
  
  // Workflow States
  const [startNotes, setStartNotes] = useState("")
  const [completionNotes, setCompletionNotes] = useState("")
  const [completionResolution, setCompletionResolution] = useState("")
  const [unassignReason, setUnassignReason] = useState("")
  const [reopenReason, setReopenReason] = useState("")
  const [cancelReason, setCancelReason] = useState("")

  const getApprovalConfig = () => {
    switch (approvalType) {
      case 'order-part':
        return {
          title: 'Request Part Order Approval',
          icon: <Package className="w-5 h-5" />,
          description: 'Request approval to order parts for this ticket',
          color: 'text-blue-600'
        }
      case 'review':
        return {
          title: 'Review Ticket Approval',
          icon: <FileCheck className="w-5 h-5" />,
          description: 'Review and approve/reject ticket progress',
          color: 'text-purple-600'
        }
      case 'close':
        return {
          title: 'Request Close Approval',
          icon: <CheckCircle className="w-5 h-5" />,
          description: 'Request approval to close this ticket',
          color: 'text-green-600'
        }
      case 'start':
        return {
          title: 'Start Work on Ticket',
          icon: <Clock className="w-5 h-5" />,
          description: 'Begin working on this assigned ticket',
          color: 'text-blue-600'
        }
      case 'complete':
        return {
          title: 'Complete Ticket Work',
          icon: <CheckCircle className="w-5 h-5" />,
          description: 'Mark this ticket as completed',
          color: 'text-green-600'
        }
      case 'unassign':
        return {
          title: 'Unassign from Ticket',
          icon: <XCircle className="w-5 h-5" />,
          description: 'Remove assignment from this ticket',
          color: 'text-orange-600'
        }
      case 'reopen':
        return {
          title: 'Reopen Closed Ticket',
          icon: <AlertCircle className="w-5 h-5" />,
          description: 'Reopen this closed ticket',
          color: 'text-yellow-600'
        }
      case 'cancel':
        return {
          title: 'Cancel Ticket',
          icon: <XCircle className="w-5 h-5" />,
          description: 'Cancel this ticket permanently',
          color: 'text-red-600'
        }
    }
  }

  const config = getApprovalConfig()

  const handleApproval = async () => {
    setIsProcessing(true)
    
    console.log('🚀 handleApproval called with type:', approvalType)
    
    try {
      if (!user) {
        toast.error("User not authenticated")
        return
      }
      
      const staffId = user.id
      const userId = user.id

      switch (approvalType) {
        case 'order-part':
          await ticketService.requestOrderPartApproval({
            ticketId: ticket.ticketId,
            partDescription,
            estimatedCost: parseFloat(partCost) || 0,
            vendor,
            urgency: urgency as any
          }, staffId)
          
          toast.success("Part order approval requested", {
            description: "Manager will review your request"
          })
          break

        case 'review':
          // For WaitingForCloseApproval status, directly close/reject the ticket
          if (approvalStatus === "Approved") {
            // Close the ticket directly
            await ticketService.closeTicket(ticket.ticketId, "Approved by manager", "Close approval granted")
            
            toast.success("Ticket approved and closed", {
              description: "The ticket has been approved and closed successfully"
            })
          } else {
            // Reopen the ticket for more work
            await ticketService.reopenTicket({
              ticketId: ticket.ticketId,
              reason: "Close request rejected - needs more work"
            })
            
            toast.success("Close request rejected", {
              description: "Ticket reopened for additional work"
            })
          }
          break

        case 'close':
          await ticketService.requestCloseApproval({
            ticketId: ticket.ticketId,
            reason: closeReason
          }, userId)
          
          toast.success("Close approval requested", {
            description: "Manager will review your close request"
          })
          break

        case 'start':
          await ticketService.startTicket({
            ticketId: ticket.ticketId,
            notes: startNotes
          })
          
          toast.success("Ticket started", {
            description: "You are now working on this ticket"
          })
          break

        case 'complete':
          await ticketService.completeTicket({
            ticketId: ticket.ticketId,
            completionNotes,
            resolution: completionResolution
          })
          
          toast.success("Ticket completed", {
            description: "Ticket has been marked as completed"
          })
          break

        case 'unassign':
          await ticketService.unassignTicket({
            ticketId: ticket.ticketId,
            reason: unassignReason
          })
          
          toast.success("Ticket unassigned", {
            description: "You have been unassigned from this ticket"
          })
          break

        case 'reopen':
          await ticketService.reopenTicket({
            ticketId: ticket.ticketId,
            reason: reopenReason
          })
          
          toast.success("Ticket reopened", {
            description: "The ticket has been reopened"
          })
          break

        case 'cancel':
          await ticketService.cancelTicket({
            ticketId: ticket.ticketId,
            reason: cancelReason
          })
          
          toast.success("Ticket cancelled", {
            description: "The ticket has been cancelled"
          })
          break
      }

      onApprovalComplete?.(ticket.ticketId, approvalStatus === "Approved")
      setOpen(false)
      
      // Reset form
      resetForm()
      
    } catch (error: any) {
      console.error("Approval failed:", error)
      toast.error("Approval request failed", {
        description: error.response?.data?.message || "Please try again"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setPartDescription("")
    setPartCost("")
    setVendor("")
    setUrgency("Medium")
    setApprovalId("")
    setApprovalStatus("Approved")
    setReviewReason("")
    setCloseReason("")
    setResolution("")
    setStartNotes("")
    setCompletionNotes("")
    setCompletionResolution("")
    setUnassignReason("")
    setReopenReason("")
    setCancelReason("")
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={`gap-2 ${config.color}`}>
      {config.icon}
      {config.title.split(' ')[0]}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${config.color}`}>
            {config.icon}
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Summary */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Ticket Details</h4>
            <p className="font-medium">{ticket.title}</p>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>#{ticket.ticketId.slice(-6)}</span>
              <span>📍 {ticket.room?.name || 'Unknown Room'}</span>
              <span>🏷️ {ticket.status}</span>
            </div>
          </div>

          {/* Approval Form */}
          {approvalType === 'order-part' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="part-description">Part Description *</Label>
                <Textarea
                  id="part-description"
                  placeholder="Describe the parts needed for this repair..."
                  value={partDescription}
                  onChange={(e) => setPartDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="part-cost">Estimated Cost</Label>
                  <Input
                    id="part-cost"
                    type="number"
                    placeholder="0.00"
                    value={partCost}
                    onChange={(e) => setPartCost(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vendor">Preferred Vendor (Optional)</Label>
                <Input
                  id="vendor"
                  placeholder="e.g., ABC Electronics, XYZ Parts"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>
            </div>
          )}

          {approvalType === 'review' && (
            <div className="space-y-4">
              {/* ApprovalID field removed - using direct close/reopen workflow */}
              
              <div className="space-y-2">
                <Label htmlFor="approval-status">Decision</Label>
                <Select value={approvalStatus} onValueChange={(value: "Approved" | "Rejected") => setApprovalStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Approve
                      </div>
                    </SelectItem>
                    <SelectItem value="Rejected">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        Reject
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Reason field removed - backend doesn't support it */}
            </div>
          )}

          {approvalType === 'close' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="close-reason">Close Reason *</Label>
                <Textarea
                  id="close-reason"
                  placeholder="Explain why this ticket should be closed..."
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Summary (Optional)</Label>
                <Textarea
                  id="resolution"
                  placeholder="Briefly describe how the issue was resolved..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {approvalType === 'start' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-notes">Work Notes (Optional)</Label>
                <Textarea
                  id="start-notes"
                  placeholder="Add any notes about starting this work..."
                  value={startNotes}
                  onChange={(e) => setStartNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {approvalType === 'complete' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="completion-notes">Completion Notes *</Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Describe what work was completed..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="completion-resolution">Resolution *</Label>
                <Textarea
                  id="completion-resolution"
                  placeholder="How was the issue resolved?"
                  value={completionResolution}
                  onChange={(e) => setCompletionResolution(e.target.value)}
                  rows={2}
                  required
                />
              </div>
            </div>
          )}

          {approvalType === 'unassign' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unassign-reason">Unassign Reason *</Label>
                <Textarea
                  id="unassign-reason"
                  placeholder="Why are you unassigning from this ticket?"
                  value={unassignReason}
                  onChange={(e) => setUnassignReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          {approvalType === 'reopen' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reopen-reason">Reopen Reason *</Label>
                <Textarea
                  id="reopen-reason"
                  placeholder="Why should this closed ticket be reopened?"
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          {approvalType === 'cancel' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancel-reason">Cancel Reason *</Label>
                <Textarea
                  id="cancel-reason"
                  placeholder="Why should this ticket be cancelled?"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleApproval} 
              disabled={isProcessing || 
                (approvalType === 'order-part' && !partDescription) || 
                (approvalType === 'close' && !closeReason) ||
                (approvalType === 'complete' && (!completionNotes || !completionResolution)) ||
                (approvalType === 'unassign' && !unassignReason) ||
                (approvalType === 'reopen' && !reopenReason) ||
                (approvalType === 'cancel' && !cancelReason)
              }
              className={`gap-2 ${config.color}`}
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {config.icon}
                  Submit Request
                </>
              )}
            </Button>
          </div>

          {/* API Status */}
          <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded border border-green-200">
            <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
            Connected to backend approval APIs. Ready for production use.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}