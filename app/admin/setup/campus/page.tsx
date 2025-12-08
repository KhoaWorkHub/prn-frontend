"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockCampuses = [
  { id: 1, name: "Campus A", description: "Main campus", rooms: 45 },
  { id: 2, name: "Campus B", description: "Engineering campus", rooms: 32 },
  { id: 3, name: "Campus C", description: "IT campus", rooms: 28 },
]

export default function CampusManagementPage() {
  const [campuses, setCampuses] = useState(mockCampuses)
  const [newCampus, setNewCampus] = useState({ name: "", description: "" })
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleAdd = () => {
    if (newCampus.name.trim()) {
      setCampuses([...campuses, { id: Date.now(), ...newCampus, rooms: 0 }])
      setNewCampus({ name: "", description: "" })
    }
  }

  const handleDelete = (id: number) => {
    setCampuses(campuses.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campus Management</h1>
        <p className="text-slate-600">Manage campuses in the system</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campuses</CardTitle>
              <CardDescription>Create and manage campus locations</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Campus
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Campus</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newCampus.name}
                      onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
                      placeholder="e.g., Campus A"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={newCampus.description}
                      onChange={(e) => setNewCampus({ ...newCampus, description: e.target.value })}
                      placeholder="e.g., Main campus"
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Create Campus
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Rooms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campuses.map((campus) => (
                <TableRow key={campus.id}>
                  <TableCell className="font-medium">{campus.name}</TableCell>
                  <TableCell>{campus.description}</TableCell>
                  <TableCell className="text-right">{campus.rooms}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(campus.id)}>
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
