"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Eye, Edit, Trash2, Clock } from "lucide-react"

interface TicketListProps {
  userRole: string
}

const mockTickets = [
  {
    id: "#1205",
    title: "WiFi not working in A205",
    room: "A205 - Classroom",
    reporter: "Nguyễn Văn A",
    priority: "High",
    status: "Resolving",
    created: "2 hours ago",
    dueIn: "4 hours",
    sla: "On Track",
    assigned: "Tech 01",
  },
  {
    id: "#1204",
    title: "AC leaking water",
    room: "B104 - Meeting Room",
    reporter: "Trần Thị B",
    priority: "Urgent",
    status: "Assigned",
    created: "6 hours ago",
    dueIn: "1 hour",
    sla: "Overdue",
    assigned: "Tech 02",
  },
  {
    id: "#1203",
    title: "Projector bulb burned",
    room: "A101 - Lecture Hall",
    reporter: "Lê Văn C",
    priority: "Medium",
    status: "New",
    created: "8 hours ago",
    dueIn: "8 hours",
    sla: "On Track",
    assigned: "Unassigned",
  },
  {
    id: "#1202",
    title: "Internet slow - WiFi bandwidth issue",
    room: "Computer Lab C",
    reporter: "Phạm Minh D",
    priority: "High",
    status: "Resolved",
    created: "12 hours ago",
    dueIn: "Resolved",
    sla: "On Time",
    assigned: "Tech 03",
  },
]

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Assigned: "bg-yellow-100 text-yellow-800",
  Resolving: "bg-purple-100 text-purple-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
}

const priorityColors: Record<string, string> = {
  Low: "text-blue-600",
  Medium: "text-yellow-600",
  High: "text-orange-600",
  Urgent: "text-red-600",
}

const slaColors: Record<string, string> = {
  "On Track": "text-green-600",
  "On Time": "text-green-600",
  Overdue: "text-red-600",
}

export function TicketList({ userRole }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  return (
    <div className="space-y-4">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={18} className="mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["All", "New", "Assigned", "Resolving", "Resolved"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            <Filter size={16} className="mr-1" />
            {status}
          </Button>
        ))}
      </div>

      {/* Tickets Table */}
      <Card className="bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Ticket ID</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Room</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Reporter</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Priority</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Assigned</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">SLA</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-primary">{ticket.id}</td>
                  <td className="px-6 py-4 text-foreground max-w-xs">{ticket.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ticket.room}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ticket.reporter}</td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{ticket.assigned}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className={slaColors[ticket.sla]} />
                      <span className={`font-semibold ${slaColors[ticket.sla]}`}>{ticket.sla}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
