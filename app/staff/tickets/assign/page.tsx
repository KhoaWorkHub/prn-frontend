"use client"

import { useState } from "react"
import { ArrowLeft, UserPlus, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

const unassignedTickets = [
  {
    id: "TK001",
    title: "Projector not working",
    room: "A101",
    facility: "Projector",
    priority: "high",
    createdAt: "09:30",
    issueType: "No Signal",
  },
  {
    id: "TK002",
    title: "WiFi down",
    room: "B202",
    facility: "WiFi",
    priority: "critical",
    createdAt: "14:20",
    issueType: "Low Speed",
  },
  {
    id: "TK005",
    title: "AC leaking",
    room: "C303",
    facility: "AC",
    priority: "high",
    createdAt: "08:15",
    issueType: "Water Leak",
  },
]

const technicians = [
  { id: 1, name: "John Doe", currentLoad: 3, expertise: ["Projector", "WiFi"] },
  { id: 2, name: "Jane Smith", currentLoad: 2, expertise: ["AC", "Electrical"] },
  { id: 3, name: "Mike Johnson", currentLoad: 5, expertise: ["All"] },
]

export default function AssignTicketPage() {
  const router = useRouter()
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [selectedTechnician, setSelectedTechnician] = useState("")

  const handleAssign = () => {
    if (selectedTicket && selectedTechnician) {
      console.log(`Assigned ${selectedTicket} to technician ${selectedTechnician}`)
      setSelectedTicket(null)
      setSelectedTechnician("")
    }
  }

  const priorityColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Assign Tickets</h1>
          <p className="text-slate-600">Distribute tickets to technicians</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Unassigned Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Tickets</CardTitle>
              <CardDescription>Tickets awaiting assignment ({unassignedTickets.length})</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unassignedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium text-blue-600">{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.room}</TableCell>
                      <TableCell>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                      <TableCell>
                        <input
                          type="radio"
                          name="ticket"
                          value={ticket.id}
                          checked={selectedTicket === ticket.id}
                          onChange={() => setSelectedTicket(ticket.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Panel */}
        <div className="space-y-4">
          {selectedTicket ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-blue-600 mb-2">{selectedTicket}</p>
                  <p className="text-sm text-slate-600">
                    {unassignedTickets.find((t) => t.id === selectedTicket)?.title}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assign To</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician..." />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id.toString()}>
                          {tech.name} (Load: {tech.currentLoad})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedTechnician && (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm space-y-2">
                      <p className="font-medium">
                        {technicians.find((t) => t.id.toString() === selectedTechnician)?.name}
                      </p>
                      <div>
                        <p className="text-slate-600">
                          Current workload:{" "}
                          {technicians.find((t) => t.id.toString() === selectedTechnician)?.currentLoad} tickets
                        </p>
                        <p className="text-slate-600">
                          Expertise:{" "}
                          {technicians.find((t) => t.id.toString() === selectedTechnician)?.expertise.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleAssign} disabled={!selectedTechnician} className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assign Ticket
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>Select a ticket to assign it to a technician</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Technician Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technician Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {technicians.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tech.name}</p>
                    <p className="text-xs text-slate-600">Tickets: {tech.currentLoad}</p>
                  </div>
                  <Badge variant={tech.currentLoad <= 3 ? "default" : "secondary"}>
                    {tech.currentLoad <= 3 ? "Available" : "Busy"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
