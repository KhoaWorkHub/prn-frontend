"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"

const mockRooms = [
  { id: 1, name: "A101", floor: 1, campus: "Campus A", facilities: ["Projector", "AC", "WiFi"], tickets: 12 },
  { id: 2, name: "A202", floor: 2, campus: "Campus A", facilities: ["Projector", "WiFi"], tickets: 8 },
  { id: 3, name: "B104", floor: 1, campus: "Campus B", facilities: ["AC", "WiFi"], tickets: 15 },
  { id: 4, name: "B303", floor: 3, campus: "Campus B", facilities: ["Projector", "AC"], tickets: 5 },
]

export function RoomManagement() {
  const [rooms, setRooms] = useState(mockRooms)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Room / Department Management</h2>
        <Button className="bg-primary text-primary-foreground">
          <Plus size={18} className="mr-2" />
          Add Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-primary">{room.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {room.campus} - Floor {room.floor}
                  </span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Facilities:</p>
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((facility) => (
                  <Badge key={facility} className="bg-secondary text-secondary-foreground">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-bold text-orange-600">{room.tickets}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
