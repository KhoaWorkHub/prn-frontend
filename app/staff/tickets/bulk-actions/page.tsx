"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockTickets = [
  { id: "TK001", title: "Projector not working", status: "new", priority: "high", room: "A101" },
  { id: "TK002", title: "WiFi down", status: "new", priority: "critical", room: "B202" },
  { id: "TK003", title: "AC leaking", status: "assigned", priority: "high", room: "C303" },
  { id: "TK004", title: "Lighting issue", status: "new", priority: "medium", room: "A202" },
]

export default function BulkActionsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")

  const handleSelectAll = () => {
    if (selected.length === mockTickets.length) {
      setSelected([])
    } else {
      setSelected(mockTickets.map((t) => t.id))
    }
  }

  const handleSelectTicket = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const handleBulkAction = () => {
    if (bulkAction && selected.length > 0) {
      console.log(`Performing ${bulkAction} on ${selected.length} tickets`)
      setSelected([])
      setBulkAction("")
    }
  }

  const statusColors: Record<string, string> = {
    new: "bg-gray-100 text-gray-800",
    assigned: "bg-blue-100 text-blue-800",
    resolving: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Actions</h1>
          <p className="text-slate-600">Perform actions on multiple tickets at once</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>Select tickets to perform bulk actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={selected.length === mockTickets.length && mockTickets.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(ticket.id)}
                          onCheckedChange={() => handleSelectTicket(ticket.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.room}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ticket.priority === "critical" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{selected.length}</p>
                <p className="text-sm text-slate-600">Tickets selected</p>
              </div>

              <div className="border-t pt-3">
                <label className="text-sm font-medium">Bulk Action</label>
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign">Assign to Technician</SelectItem>
                    <SelectItem value="priority">Change Priority</SelectItem>
                    <SelectItem value="status">Change Status</SelectItem>
                    <SelectItem value="category">Change Category</SelectItem>
                    <SelectItem value="close">Close Tickets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleBulkAction} disabled={!bulkAction || selected.length === 0} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply Action
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-slate-600">
              <p>Select tickets using the checkboxes, then choose an action to apply to all selected items.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
