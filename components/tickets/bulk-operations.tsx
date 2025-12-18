"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ticketService } from "@/lib/api/ticket.service"
import { Download, Edit3, Trash2, UserCheck, Clock } from "lucide-react"
import type { TicketResponse } from "@/types/ticket"

interface BulkOperationsProps {
  selectedTickets: string[]
  tickets: TicketResponse[]
  onSelectionChange: (ticketIds: string[]) => void
  onOperationComplete: () => void
  userRole: string
}

export function BulkOperations({ 
  selectedTickets, 
  tickets, 
  onSelectionChange, 
  onOperationComplete,
  userRole 
}: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>("")

  const selectedTicketData = tickets.filter(t => selectedTickets.includes(t.ticketId))

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedTickets.length === 0) {
      toast.error("Please select tickets and an action")
      return
    }

    setIsProcessing(true)
    try {
      let updateData: any = {}
      
      switch (bulkAction) {
        case "close":
          updateData = { status: "Closed" }
          break
        case "in-progress":
          updateData = { status: "InProgress" }
          break
        case "priority-high":
          updateData = { severity: "A" }
          break
        case "priority-medium":
          updateData = { severity: "B" }
          break
        case "priority-low":
          updateData = { severity: "C" }
          break
        default:
          toast.error("Invalid action selected")
          return
      }

      await ticketService.bulkUpdateTickets(selectedTickets, updateData)
      
      toast.success(`Successfully updated ${selectedTickets.length} tickets`, {
        description: `Action: ${bulkAction.replace('-', ' ')}`
      })
      
      onOperationComplete()
      onSelectionChange([])
      setBulkAction("")
    } catch (error: any) {
      console.error("Bulk update failed:", error)
      toast.error("Failed to update tickets", {
        description: error.response?.data?.message || "Please try again"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsProcessing(true)
    try {
      const blob = await ticketService.exportTickets(format, {
        ticketIds: selectedTickets.length > 0 ? selectedTickets : undefined
      })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(`Tickets exported as ${format.toUpperCase()}`)
    } catch (error: any) {
      console.error("Export failed:", error)
      toast.error("Failed to export tickets", {
        description: error.response?.data?.message || "Please try again"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const canPerformBulkActions = userRole === 'Admin' || userRole === 'Manager'

  return (
    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="font-medium">{selectedTickets.length}</span> tickets selected
          {selectedTickets.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSelectionChange([])}
              className="ml-2 h-6 px-2"
            >
              Clear
            </Button>
          )}
        </div>
        
        {selectedTickets.length > 0 && (
          <div className="flex gap-1">
            {selectedTicketData.slice(0, 3).map(ticket => (
              <Badge key={ticket.ticketId} variant="outline" className="text-xs">
                #{ticket.ticketId.slice(-4)}
              </Badge>
            ))}
            {selectedTicketData.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{selectedTicketData.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Export Actions */}
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport('csv')}
            disabled={isProcessing}
            className="gap-2"
          >
            <Download size={16} />
            CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport('xlsx')}
            disabled={isProcessing}
            className="gap-2"
          >
            <Download size={16} />
            Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport('pdf')}
            disabled={isProcessing}
            className="gap-2"
          >
            <Download size={16} />
            PDF
          </Button>
        </div>

        {/* Bulk Update Actions */}
        {canPerformBulkActions && selectedTickets.length > 0 && (
          <>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select bulk action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="close">Mark as Closed</SelectItem>
                <SelectItem value="in-progress">Mark as In Progress</SelectItem>
                <SelectItem value="priority-high">Set Priority High</SelectItem>
                <SelectItem value="priority-medium">Set Priority Medium</SelectItem>
                <SelectItem value="priority-low">Set Priority Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleBulkUpdate}
              disabled={isProcessing || !bulkAction}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Apply
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}