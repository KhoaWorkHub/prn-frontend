"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Loader2 } from "lucide-react"
import { metadataService } from "@/lib/api/metadata.service"
import { ticketService } from "@/lib/api/ticket.service"
import type { RoomResponse, TicketResponse } from "@/types/ticket"

export function RoomManagement() {
  const [rooms, setRooms] = useState<RoomResponse[]>([])
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load rooms and tickets from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('🔄 Loading rooms and tickets...')
        
        const [metadata, ticketsData] = await Promise.all([
          metadataService.getMetadata(),
          ticketService.getTickets().catch(() => []) // Don't fail if tickets API fails
        ])
        
        console.log('✅ Rooms loaded:', metadata.rooms)
        console.log('✅ Tickets loaded:', ticketsData)
        setRooms(metadata.rooms || [])
        setTickets(ticketsData || [])
      } catch (error: any) {
        console.error('❌ Failed to load rooms:', error)
        setError('Failed to load room data')
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate ticket count for each room
  const getTicketCount = (roomId: string) => {
    return tickets.filter(ticket => 
      ticket.roomId === roomId && 
      !['Closed', 'Resolved'].includes(ticket.status)
    ).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm">⚠️ {error}. Some features may not work properly.</p>
        </Card>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Room / Department Management</h2>
        <Button className="bg-primary text-primary-foreground" disabled>
          <Plus size={18} className="mr-2" />
          Add Room (Admin Only)
        </Button>
      </div>

      {/* Empty State */}
      {rooms.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
          <p className="text-gray-600">Contact administrator to add rooms to the system</p>
        </Card>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const activeTickets = getTicketCount(room.roomId)
          return (
            <Card key={room.roomId} className="p-6 bg-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{room.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span className="text-sm">
                      {room.campus?.name || 'Unknown Campus'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campus Info */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Campus:</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {room.campus?.name || 'Unknown Campus'}
                </Badge>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Active Issues</p>
                  <p className={`text-2xl font-bold ${
                    activeTickets > 5 ? 'text-red-600' : 
                    activeTickets > 2 ? 'text-orange-600' : 
                    activeTickets > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {activeTickets}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled title="Edit functionality not available">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled title="Delete functionality not available">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
