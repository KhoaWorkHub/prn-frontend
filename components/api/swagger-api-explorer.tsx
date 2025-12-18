"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Code, Database, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { ticketService } from "@/lib/api/ticket.service"
import { toast } from "sonner"

interface APIEndpoint {
  method: 'GET' | 'POST'
  path: string
  description: string
  category: string
  requiresAuth: boolean
  roles?: string[]
  testFunction?: () => Promise<any>
}

interface SwaggerAPIExplorerProps {
  userRole: string
}

export function SwaggerAPIExplorer({ userRole }: SwaggerAPIExplorerProps) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Define all API endpoints from Swagger
  const apiEndpoints: APIEndpoint[] = [
    // OData endpoints
    {
      method: 'GET',
      path: '/odata/$metadata',
      description: 'Get OData metadata schema',
      category: 'OData',
      requiresAuth: false,
      testFunction: () => ticketService.getODataMetadata()
    },
    {
      method: 'GET', 
      path: '/odata/tickets',
      description: 'Get tickets via OData',
      category: 'OData',
      requiresAuth: true,
      testFunction: () => ticketService.getODataTickets()
    },
    {
      method: 'GET',
      path: '/odata/tickets/$count',
      description: 'Get ticket count via OData',
      category: 'OData', 
      requiresAuth: true,
      testFunction: () => ticketService.getODataTicketsCount()
    },

    // Main Ticket endpoints
    {
      method: 'GET',
      path: '/api/tickets',
      description: 'Get all tickets',
      category: 'Tickets',
      requiresAuth: true,
      roles: ['Admin', 'Manager'],
      testFunction: () => ticketService.getTickets()
    },
    {
      method: 'POST',
      path: '/api/tickets',
      description: 'Create new ticket',
      category: 'Tickets',
      requiresAuth: true,
      roles: ['Reporter'],
      testFunction: () => {
        // Sample ticket creation (would need actual form data)
        return Promise.resolve({ message: 'Create ticket requires form data - test skipped' })
      }
    },
    {
      method: 'GET',
      path: '/api/tickets/{id}',
      description: 'Get ticket by ID',
      category: 'Tickets',
      requiresAuth: true,
      testFunction: () => {
        // Would need actual ticket ID
        return Promise.resolve({ message: 'Get ticket by ID requires valid ticket ID - test skipped' })
      }
    },

    // Staff endpoints
    {
      method: 'GET',
      path: '/api/staff-assigned-tickets',
      description: 'Get staff assigned tickets',
      category: 'Staff',
      requiresAuth: true,
      roles: ['Staff'],
      testFunction: () => ticketService.getStaffAssignedTickets()
    },
    {
      method: 'GET',
      path: '/api/staff-assigned-tickets/{ticketId}',
      description: 'Get staff assigned ticket by ID',
      category: 'Staff',
      requiresAuth: true,
      roles: ['Staff'],
      testFunction: () => {
        return Promise.resolve({ message: 'Get staff ticket by ID requires valid ticket ID - test skipped' })
      }
    },

    // Reporter endpoints  
    {
      method: 'GET',
      path: '/api/reporter-reported-tickets',
      description: 'Get reporter reported tickets',
      category: 'Reporter',
      requiresAuth: true,
      roles: ['Reporter'],
      testFunction: () => ticketService.getReporterReportedTickets()
    },
    {
      method: 'GET',
      path: '/api/reporter-reported-tickets/{ticketId}',
      description: 'Get reporter reported ticket by ID',
      category: 'Reporter',
      requiresAuth: true,
      roles: ['Reporter'],
      testFunction: () => {
        return Promise.resolve({ message: 'Get reporter ticket by ID requires valid ticket ID - test skipped' })
      }
    },

    // Approval endpoints
    {
      method: 'POST',
      path: '/api/order-part-approval',
      description: 'Request order part approval',
      category: 'Approval',
      requiresAuth: true,
      roles: ['Staff'],
      testFunction: () => {
        return Promise.resolve({ message: 'Order part approval requires form data - test skipped' })
      }
    },
    {
      method: 'POST',
      path: '/api/review',
      description: 'Review ticket approval',
      category: 'Approval',
      requiresAuth: true,
      roles: ['Manager', 'Admin'],
      testFunction: () => {
        return Promise.resolve({ message: 'Review approval requires form data - test skipped' })
      }
    },
    {
      method: 'POST',
      path: '/api/close-approval',
      description: 'Request close ticket approval',
      category: 'Approval',
      requiresAuth: true,
      roles: ['Staff'],
      testFunction: () => {
        return Promise.resolve({ message: 'Close approval requires form data - test skipped' })
      }
    }
  ]

  const categories = ['All', 'OData', 'Tickets', 'Staff', 'Reporter', 'Approval']

  const testEndpoint = async (endpoint: APIEndpoint) => {
    const key = `${endpoint.method}_${endpoint.path}`
    setLoading(true)
    setErrors(prev => ({ ...prev, [key]: '' }))
    
    try {
      console.log(`🔄 Testing ${endpoint.method} ${endpoint.path}`)
      const result = await endpoint.testFunction!()
      setResults(prev => ({ ...prev, [key]: result }))
      console.log(`✅ ${endpoint.path} succeeded:`, result)
      toast.success(`${endpoint.path} - Success`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      setErrors(prev => ({ ...prev, [key]: errorMessage }))
      console.error(`❌ ${endpoint.path} failed:`, error)
      toast.error(`${endpoint.path} - ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const testAllEndpoints = async () => {
    for (const endpoint of apiEndpoints) {
      if (endpoint.testFunction) {
        await testEndpoint(endpoint)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  const getEndpointStatus = (endpoint: APIEndpoint) => {
    const key = `${endpoint.method}_${endpoint.path}`
    if (errors[key]) return 'error'
    if (results[key]) return 'success' 
    return 'pending'
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code className="w-5 h-5" />
              Swagger API Explorer
            </h3>
            <p className="text-sm text-muted-foreground">
              Test all API endpoints from Swagger documentation
            </p>
          </div>
          <Button onClick={testAllEndpoints} disabled={loading}>
            <Play className="w-4 h-4 mr-2" />
            Test All APIs
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Current Role: <Badge variant="outline">{userRole}</Badge>
            {' '}- Some APIs may return 403 Forbidden based on your role permissions.
          </AlertDescription>
        </Alert>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* API Endpoints */}
        <div className="space-y-4">
          {apiEndpoints
            .filter(endpoint => selectedCategory === 'All' || endpoint.category === selectedCategory)
            .map(endpoint => {
                  const key = `${endpoint.method}_${endpoint.path}`
                  const status = getEndpointStatus(endpoint)
                  const result = results[key]
                  const error = errors[key]

                  return (
                    <Card key={key} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge 
                            variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                            className={endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                          >
                            {endpoint.method}
                          </Badge>
                          <div className="flex-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <p className="text-sm text-muted-foreground mt-1">
                              {endpoint.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {endpoint.roles && (
                            <div className="flex gap-1">
                              {endpoint.roles.map(role => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            {status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => testEndpoint(endpoint)}
                              disabled={loading || !endpoint.testFunction}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {result && (
                        <div className="mt-3">
                          <Label className="text-xs text-green-600 mb-1 block">Response:</Label>
                          <Textarea
                            value={JSON.stringify(result, null, 2)}
                            readOnly
                            className="min-h-[100px] font-mono text-xs bg-green-50 border-green-200"
                          />
                        </div>
                      )}

                      {error && (
                        <div className="mt-3">
                          <Label className="text-xs text-red-600 mb-1 block">Error:</Label>
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            {error}
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })}
        </div>
      </Card>
    </div>
  )
}