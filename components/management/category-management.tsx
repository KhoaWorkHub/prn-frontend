"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft } from "lucide-react"

const mockCategories = [
  { id: 1, name: "WiFi Issues", description: "Wireless network problems", active: true, tickets: 142 },
  { id: 2, name: "AC/Cooling", description: "Air conditioning systems", active: true, tickets: 87 },
  { id: 3, name: "Projector Issues", description: "Presentation equipment", active: true, tickets: 63 },
  { id: 4, name: "Door Lock", description: "Access and security", active: false, tickets: 24 },
]

export function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories)
  const [newCategoryName, setNewCategoryName] = useState("")

  const toggleActive = (id: number) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, active: !cat.active } : cat)))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Category Management</h2>
        <Button className="bg-primary text-primary-foreground">
          <Plus size={18} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* New Category Input */}
      <Card className="p-6 bg-card">
        <div className="flex gap-2">
          <Input
            placeholder="Category name (e.g., WiFi Issues, AC, etc.)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <Button className="bg-primary text-primary-foreground">Create</Button>
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggleActive(category.id)}>
                {category.active ? (
                  <ToggleRight size={20} className="text-green-600" />
                ) : (
                  <ToggleLeft size={20} className="text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <Badge className={category.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {category.active ? "Active" : "Inactive"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">{category.tickets} tickets</p>
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
