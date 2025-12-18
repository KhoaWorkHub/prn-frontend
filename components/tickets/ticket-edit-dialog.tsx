"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Clock } from "lucide-react"
import { toast } from "sonner"
import { ticketService } from "@/lib/api/ticket.service"
import { metadataService } from "@/lib/api/metadata.service"
import type { TicketResponse, FacilityTypeResponse, RoomResponse } from "@/types/ticket"

interface TicketEditDialogProps {
  ticket: TicketResponse
  onTicketUpdate?: () => void
  trigger?: React.ReactNode
}

export function TicketEditDialog({ ticket, onTicketUpdate, trigger }: TicketEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [facilityTypes, setFacilityTypes] = useState<FacilityTypeResponse[]>([])
  const [rooms, setRooms] = useState<RoomResponse[]>([])
  
  const [formData, setFormData] = useState({
    title: ticket.title,
    description: ticket.description,
    severity: ticket.severity,
    roomId: ticket.room?.roomId || "",
    facilityTypeId: ticket.facilityType?.facilityTypeId || ""
  })

  useEffect(() => {
    const loadMetadata = async () => {
      if (open) {
        try {
          const [facilitiesData, roomsData] = await Promise.all([
            metadataService.getFacilityTypes(),
            metadataService.getRooms()
          ])
          setFacilityTypes(facilitiesData)
          setRooms(roomsData)
        } catch (error) {
          console.error('Failed to load metadata:', error)
          toast.error("Could not load form data")
        }
      }
    }
    
    loadMetadata()
  }, [open])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await ticketService.updateTicket(ticket.ticketId, formData)
      
      toast.success("Ticket updated successfully", {
        description: "Changes have been saved"
      })
      
      onTicketUpdate?.()
      setOpen(false)
    } catch (error: any) {
      console.error("Update failed:", error)
      toast.error("Failed to update ticket", {
        description: error.response?.data?.message || "Please try again"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Edit size={16} />
      Edit
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
            <Edit size={20} />
            Edit Ticket #{ticket.ticketId.slice(-6)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter ticket title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Priority A (Critical)</SelectItem>
                  <SelectItem value="B">Priority B (High)</SelectItem>
                  <SelectItem value="C">Priority C (Medium)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilityType">Facility Type</Label>
              <Select 
                value={formData.facilityTypeId} 
                onValueChange={(value) => setFormData({ ...formData, facilityTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  {facilityTypes.map((type) => (
                    <SelectItem key={type.facilityTypeId} value={type.facilityTypeId}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room/Location</Label>
            <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.roomId} value={room.roomId}>
                    {room.name} {room.campus && `- ${room.campus.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating}
              className="gap-2"
            >
              {isUpdating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Update Ticket
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}