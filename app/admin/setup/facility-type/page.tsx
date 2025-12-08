"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const mockFacilityTypes = [
  { id: 1, name: "Projector", description: "Room projector", issues: 5 },
  { id: 2, name: "Air Conditioner", description: "Cooling system", issues: 3 },
  { id: 3, name: "WiFi Router", description: "Wireless network", issues: 4 },
]

export default function FacilityTypeManagementPage() {
  const [types, setTypes] = useState(mockFacilityTypes)
  const [newType, setNewType] = useState({ name: "", description: "" })

  const handleAdd = () => {
    if (newType.name.trim()) {
      setTypes([...types, { id: Date.now(), ...newType, issues: 0 }])
      setNewType({ name: "", description: "" })
    }
  }

  const handleDelete = (id: number) => {
    setTypes(types.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facility Type Management</h1>
        <p className="text-slate-600">Define types of facilities in the system</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Facility Types</CardTitle>
              <CardDescription>Manage equipment and facility categories</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Facility Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newType.name}
                      onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                      placeholder="e.g., Projector"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={newType.description}
                      onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                      placeholder="e.g., Room projector"
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Create Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {types.map((type) => (
              <Card key={type.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{type.name}</h3>
                    <Badge variant="secondary">{type.issues} issues</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{type.description}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDelete(type.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
