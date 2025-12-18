"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Database, Code, Play } from "lucide-react"
import { ticketService } from "@/lib/api/ticket.service"
import type { TicketResponse, ODataResponse } from "@/types/ticket"
import { toast } from "sonner"

interface ODataTicketsProps {
  userRole: string
}

export function ODataTickets({ userRole }: ODataTicketsProps) {
  const [metadata, setMetadata] = useState<string>("")
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [ticketCount, setTicketCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [odataQuery, setOdataQuery] = useState("")
  const [filterQuery, setFilterQuery] = useState("")
  
  // Sample OData queries
  const sampleQueries = [
    {
      name: "All Tickets",
      query: "",
      description: "Get all tickets via OData"
    },
    {
      name: "Filter by Status",
      query: "$filter=Status eq 'Reported'",
      description: "Get tickets with Reported status"
    },
    {
      name: "Select Fields",
      query: "$select=TicketId,Title,Status,Severity",
      description: "Get only specific fields"
    },
    {
      name: "Top 10",
      query: "$top=10",
      description: "Get first 10 tickets"
    },
    {
      name: "Order by Created",
      query: "$orderby=CreatedAt desc",
      description: "Order tickets by creation date"
    },
    {
      name: "Complex Filter",
      query: "$filter=Severity eq 'A' and Status ne 'Closed'&$orderby=CreatedAt desc&$top=5",
      description: "High priority open tickets"
    }
  ]

  // Load OData metadata
  const loadMetadata = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading OData metadata...')
      const metadataXML = await ticketService.getODataMetadata()
      setMetadata(metadataXML)
      console.log('✅ OData metadata loaded')
      toast.success("OData metadata loaded successfully")
    } catch (error: any) {
      console.error('❌ Failed to load metadata:', error)
      toast.error("Failed to load OData metadata")
    } finally {
      setLoading(false)
    }
  }

  // Execute OData query
  const executeQuery = async (query: string = odataQuery) => {
    try {
      setLoading(true)
      console.log('🔄 Executing OData query:', query)
      
      const odataResponse = await ticketService.getODataTickets(query)
      setTickets(odataResponse.value || [])
      
      console.log('✅ OData query executed:', odataResponse)
      toast.success(`Found ${odataResponse.value?.length || 0} tickets`)
    } catch (error: any) {
      console.error('❌ OData query failed:', error)
      toast.error("OData query failed: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Get ticket count
  const getTicketCount = async (filter: string = filterQuery) => {
    try {
      setLoading(true)
      console.log('🔄 Getting ticket count with filter:', filter)
      
      const count = await ticketService.getODataTicketsCount(filter)
      setTicketCount(count)
      
      console.log('✅ Ticket count:', count)
      toast.success(`Total tickets: ${count}`)
    } catch (error: any) {
      console.error('❌ Failed to get count:', error)
      toast.error("Failed to get ticket count")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5" />
          <h3 className="text-lg font-semibold">OData API Integration</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Test and explore OData APIs for advanced querying capabilities
        </p>

        {/* Metadata Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Button 
              onClick={loadMetadata} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <Code className="w-4 h-4 mr-2" />
              Load Metadata
            </Button>
            {metadata && (
              <Badge variant="secondary">Metadata Loaded</Badge>
            )}
          </div>
        </div>

        {/* Query Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Query Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="odata-query">OData Query</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="odata-query"
                  placeholder="$filter=Status eq 'Reported'&$top=10"
                  value={odataQuery}
                  onChange={(e) => setOdataQuery(e.target.value)}
                />
                <Button onClick={() => executeQuery()} disabled={loading}>
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="count-filter">Count Filter</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="count-filter"
                  placeholder="Status eq 'Reported'"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
                <Button onClick={() => getTicketCount()} disabled={loading} variant="outline">
                  Count
                </Button>
              </div>
            </div>

            {ticketCount > 0 && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">Total Tickets: {ticketCount}</p>
              </div>
            )}
          </div>

          {/* Sample Queries */}
          <div>
            <Label>Sample Queries</Label>
            <div className="grid gap-2 mt-2">
              {sampleQueries.map((sample, index) => (
                <Card key={index} className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors">
                  <div onClick={() => setOdataQuery(sample.query)}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{sample.name}</p>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          executeQuery(sample.query)
                        }}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{sample.description}</p>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {sample.query || "(no query)"}
                    </code>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      {tickets.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Query Results ({tickets.length} tickets)</h4>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.ticketId} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">#{ticket.ticketId.slice(-6)} - {ticket.title}</p>
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{ticket.status}</Badge>
                  <Badge variant="secondary">{ticket.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {ticket.room?.name || 'Unknown Room'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Metadata Viewer */}
      {metadata && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">OData Metadata</h4>
          <Textarea
            value={metadata}
            readOnly
            className="min-h-[200px] font-mono text-xs"
            placeholder="OData metadata will appear here..."
          />
        </Card>
      )}
    </div>
  )
}