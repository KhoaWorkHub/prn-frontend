"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const mockRooms = [
  { id: 1, name: "A101", campus: "Campus A", floor: 1, facilities: 3, tickets: 5 },
  { id: 2, name: "A202", campus: "Campus A", floor: 2, facilities: 2, tickets: 3 },
  { id: 3, name: "B303", campus: "Campus B", floor: 3, facilities: 4, tickets: 8 },
]

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState(mockRooms)
  const [newRoom, setNewRoom] = useState({ name: "", campus: "", floor: 1 })

  const handleAdd = () => {
    if (newRoom.name.trim() && newRoom.campus) {
      setRooms([...rooms, { id: Date.now(), ...newRoom, facilities: 0, tickets: 0 }])
      setNewRoom({ name: "", campus: "", floor: 1 })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Management</h1>
        <p className="text-slate-600">Manage rooms and departments across campuses</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rooms & Departments</CardTitle>
              <CardDescription>Create and manage facility locations</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Room Name</label>
                    <Input
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="e.g., A101"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Campus</label>
                    <Select value={newRoom.campus} onValueChange={(val) => setNewRoom({ ...newRoom, campus: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campus-a">Campus A</SelectItem>
                        <SelectItem value="campus-b">Campus B</SelectItem>
                        <SelectItem value="campus-c">Campus C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Floor</label>
                    <Input
                      type="number"
                      value={newRoom.floor}
                      onChange={(e) => setNewRoom({ ...newRoom, floor: Number.parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Create Room
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead className="text-right">Floor</TableHead>
                <TableHead className="text-right">Facilities</TableHead>
                <TableHead className="text-right">Tickets</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {room.name}
                  </TableCell>
                  <TableCell>{room.campus}</TableCell>
                  <TableCell className="text-right">{room.floor}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{room.facilities}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{room.tickets}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
