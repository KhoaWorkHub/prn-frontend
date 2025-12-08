"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockUserTickets = [
  {
    id: "TK001",
    title: "Projector not working",
    room: "A101",
    facility: "Projector",
    status: "assigned",
    priority: "high",
    createdAt: "2024-01-15 09:30",
    dueAt: "2024-01-15 11:30",
    slaStatus: "on-time",
  },
  {
    id: "TK002",
    title: "AC dripping",
    room: "A202",
    facility: "Air Conditioner",
    status: "resolving",
    priority: "high",
    createdAt: "2024-01-14 14:20",
    dueAt: "2024-01-14 19:20",
    slaStatus: "on-time",
  },
  {
    id: "TK003",
    title: "Internet slow",
    room: "B303",
    facility: "WiFi Router",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-13 10:00",
    dueAt: "2024-01-13 11:00",
    slaStatus: "on-time",
  },
]

export default function UserTicketsPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const statusColors: Record<string, string> = {
    new: "bg-gray-100 text-gray-800",
    assigned: "bg-blue-100 text-blue-800",
    resolving: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-slate-100 text-slate-800",
  }

  const priorityColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  const filteredTickets = mockUserTickets.filter((ticket) => {
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-slate-600">View and track your facility requests</p>
        </div>
        <Button onClick={() => router.push("/user/tickets/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by ticket ID or title..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolving">Resolving</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No tickets found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => router.push(`/user/tickets/${ticket.id}`)}
                  >
                    <TableCell className="font-medium text-blue-600">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.room}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[ticket.status]}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[ticket.priority]}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.createdAt}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{ticket.slaStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
