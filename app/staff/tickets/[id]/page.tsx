"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [ticket, setTicket] = useState({
    id: params.id,
    title: "Projector not working",
    description: "No signal detected on projector in room A101",
    status: "assigned",
    priority: "high",
    room: "A101 (Campus A)",
    facility: "Projector",
    issueType: "No Signal",
    createdAt: "2024-01-15 09:30",
    assignedAt: "2024-01-15 09:45",
    reporter: "student1@fpt.edu.vn",
    assignedTo: "technician1@fpt.edu.vn",
    dueAt: "2024-01-15 11:30",
    slaStatus: "on-time",
    slaRemaining: "1h 45m",
  })

  const [newStatus, setNewStatus] = useState(ticket.status)
  const [notes, setNotes] = useState("")

  const statusColors: Record<string, string> = {
    new: "bg-gray-100 text-gray-800",
    assigned: "bg-blue-100 text-blue-800",
    resolving: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-slate-100 text-slate-800",
    onhold: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const priorityColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  const handleStatusChange = (newStat: string) => {
    setNewStatus(newStat)
    // Add to history
  }

  const handleAddNote = () => {
    if (notes.trim()) {
      // Save note and add to history
      setNotes("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ticket #{ticket.id}</h1>
          <p className="text-slate-600">{ticket.title}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SLA Alert */}
          {ticket.slaStatus === "on-time" && (
            <Alert className="border-green-200 bg-green-50">
              <Clock className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                SLA Status: On Time - {ticket.slaRemaining} remaining
              </AlertDescription>
            </Alert>
          )}

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Priority</p>
                  <Badge className={priorityColors[ticket.priority]}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Room</p>
                  <p className="font-medium">{ticket.room}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Facility</p>
                  <p className="font-medium">{ticket.facility}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Issue Type</p>
                  <p className="font-medium">{ticket.issueType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Due At</p>
                  <p className="font-medium">{ticket.dueAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change ticket status and add notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="resolving">Resolving</SelectItem>
                    <SelectItem value="onhold">On Hold</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  placeholder="Add notes about the resolution..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleAddNote} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Update Ticket
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div className="w-0.5 h-12 bg-slate-200" />
                  </div>
                  <div>
                    <p className="font-medium">Assigned</p>
                    <p className="text-sm text-slate-600">Assigned to technician1@fpt.edu.vn</p>
                    <p className="text-xs text-slate-500">2024-01-15 09:45</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-slate-600">Ticket created by student1@fpt.edu.vn</p>
                    <p className="text-xs text-slate-500">2024-01-15 09:30</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Reporter</p>
                <p className="font-medium">{ticket.reporter}</p>
              </div>
              <div>
                <p className="text-slate-600">Assigned To</p>
                <p className="font-medium">{ticket.assignedTo}</p>
              </div>
              <div>
                <p className="text-slate-600">Created</p>
                <p className="font-medium">{ticket.createdAt}</p>
              </div>
              <div>
                <p className="text-slate-600">Assigned At</p>
                <p className="font-medium">{ticket.assignedAt}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SLA Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Status</p>
                <Badge className="bg-green-100 text-green-800">On Time</Badge>
              </div>
              <div>
                <p className="text-slate-600">Remaining Time</p>
                <p className="font-bold text-lg text-green-600">{ticket.slaRemaining}</p>
              </div>
              <div>
                <p className="text-slate-600">Due At</p>
                <p className="font-medium">{ticket.dueAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
