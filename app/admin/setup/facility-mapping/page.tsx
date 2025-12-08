"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const mockMappings = [
  { id: 1, room: "A101", campus: "Campus A", facility: "Projector", quantity: 1 },
  { id: 2, room: "A101", campus: "Campus A", facility: "Air Conditioner", quantity: 2 },
  { id: 3, room: "A202", campus: "Campus A", facility: "WiFi Router", quantity: 1 },
  { id: 4, room: "B303", campus: "Campus B", facility: "Projector", quantity: 2 },
]

export default function FacilityMappingPage() {
  const [mappings, setMappings] = useState(mockMappings)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facility Mapping</h1>
        <p className="text-slate-600">Assign facilities to rooms and departments</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Room ↔ Facility Mapping</CardTitle>
              <CardDescription>Configure which facilities exist in each room</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mapping
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Facility to Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Campus</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">Campus A</SelectItem>
                        <SelectItem value="b">Campus B</SelectItem>
                        <SelectItem value="c">Campus C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Room</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a101">A101</SelectItem>
                        <SelectItem value="a202">A202</SelectItem>
                        <SelectItem value="b303">B303</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Facility Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="projector">Projector</SelectItem>
                        <SelectItem value="ac">Air Conditioner</SelectItem>
                        <SelectItem value="wifi">WiFi Router</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" placeholder="1" min="1" />
                  </div>
                  <Button className="w-full">Create Mapping</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campus</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Facility Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{mapping.campus}</TableCell>
                  <TableCell className="font-medium">{mapping.room}</TableCell>
                  <TableCell>{mapping.facility}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      <Package className="w-3 h-3 mr-1" />
                      {mapping.quantity}
                    </Badge>
                  </TableCell>
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
