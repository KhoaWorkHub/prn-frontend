"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, Loader2 } from "lucide-react"
import { metadataService } from "@/lib/api/metadata.service"
import type { FacilityTypeResponse } from "@/types/ticket"


export function CategoryManagement() {
  const [facilityTypes, setFacilityTypes] = useState<FacilityTypeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")

  const toggleActive = async (facilityTypeId: string) => {
    console.log('Toggle active for facility type:', facilityTypeId)
  }

  // Load facility types from backend
  useEffect(() => {
    const loadFacilityTypes = async () => {
      try {
        setLoading(true)
        console.log('🔄 Loading facility types...')
        const metadata = await metadataService.getMetadata()
        console.log('✅ Facility types loaded:', metadata.facilityTypes)
        setFacilityTypes(metadata.facilityTypes || [])
      } catch (error: any) {
        console.error('❌ Failed to load facility types:', error)
        setError('Failed to load facility types')
        // Fallback to empty array
        setFacilityTypes([])
      } finally {
        setLoading(false)
      }
    }

    loadFacilityTypes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading facility types...</p>
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
        <h2 className="text-2xl font-bold text-foreground">Facility Types Management</h2>
        <Button className="bg-primary text-primary-foreground" disabled>
          <Plus size={18} className="mr-2" />
          Add Facility Type (Admin Only)
        </Button>
      </div>

      {/* Empty State */}
      {facilityTypes.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No facility types found</h3>
          <p className="text-gray-600">Contact administrator to add facility types to the system</p>
        </Card>
      )}

      {/* Facility Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilityTypes.map((facilityType) => (
          <Card key={facilityType.facilityTypeId} className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{facilityType.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{facilityType.description || 'No description available'}</p>
              </div>
              <Button variant="ghost" size="icon" disabled title="Toggle functionality not available">
                <ToggleRight size={20} className="text-green-600" />
              </Button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <Badge className="bg-green-100 text-green-800">
                  Active
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">Facility type from system</p>
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
        ))}
      </div>
    </div>
  )
}
