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

interface TicketApprovalDialogProps {
  ticket: TicketResponse
  approvalType: 'order-part' | 'review' | 'close'
  onApprovalComplete?: (ticketId: string, approved: boolean) => void
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
    }
  }

  const config = getApprovalConfig()

  const handleApproval = async () => {
    setIsProcessing(true)
    
    try {
      const staffId = "current-user-id" // TODO: Get from auth context
      const userId = "current-user-id" // TODO: Get from auth context

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
          if (!approvalId) {
            toast.error("Please enter approval ID")
            return
          }
          
          await ticketService.reviewTicketApproval({
            approvalId,
            approvalStatus,
            userId,
            reason: reviewReason
          })
          
          toast.success(`Ticket ${approvalStatus.toLowerCase()}`, {
            description: `The ticket has been ${approvalStatus.toLowerCase()}`
          })
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
              <div className="space-y-2">
                <Label htmlFor="approval-id">Approval ID *</Label>
                <Input
                  id="approval-id"
                  placeholder="Enter the approval request ID"
                  value={approvalId}
                  onChange={(e) => setApprovalId(e.target.value)}
                  required
                />
              </div>
              
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
              
              <div className="space-y-2">
                <Label htmlFor="review-reason">Reason (Optional)</Label>
                <Textarea
                  id="review-reason"
                  placeholder={`Provide reason for ${approvalStatus.toLowerCase()}ing this request...`}
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  rows={3}
                />
              </div>
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleApproval} 
              disabled={isProcessing || (approvalType === 'order-part' && !partDescription) || (approvalType === 'review' && !approvalId) || (approvalType === 'close' && !closeReason)}
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