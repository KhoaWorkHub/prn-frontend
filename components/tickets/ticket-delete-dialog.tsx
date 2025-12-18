"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Trash2, Clock } from "lucide-react"
import { toast } from "sonner"
import { ticketService } from "@/lib/api/ticket.service"
import type { TicketResponse } from "@/types/ticket"
import { useAuth } from "@/lib/auth-context"

interface TicketDeleteDialogProps {
  ticket: TicketResponse
  onTicketDelete?: () => void
  trigger?: React.ReactNode
}

export function TicketDeleteDialog({ ticket, onTicketDelete, trigger }: TicketDeleteDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reason, setReason] = useState("")

  const canDelete = user?.roles.includes('Administrator') || user?.roles.includes('Manager')

  const handleDelete = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for deletion")
      return
    }

    setIsDeleting(true)
    try {
      await ticketService.deleteTicket(ticket.ticketId)
      
      toast.success("Ticket deleted successfully", {
        description: "The ticket has been permanently removed"
      })
      
      onTicketDelete?.()
      setOpen(false)
      setReason("")
    } catch (error: any) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete ticket", {
        description: error.response?.data?.message || "Please try again or contact administrator"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!canDelete) {
    return null
  }

  const defaultTrigger = (
    <Button variant="destructive" size="sm" className="gap-2">
      <Trash2 size={16} />
      Delete
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={20} />
            Delete Ticket
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-medium text-destructive mb-2">Warning</h4>
            <p className="text-sm text-destructive/80">
              This action cannot be undone. This will permanently delete ticket #{ticket.ticketId.slice(-6)} 
              and all associated data.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Ticket Details</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Title:</strong> {ticket.title}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Status:</strong> {ticket.status}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-reason">Reason for Deletion *</Label>
            <Textarea
              id="delete-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for deleting this ticket..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete} 
            disabled={isDeleting || !reason.trim()}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}