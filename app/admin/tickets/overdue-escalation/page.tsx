"use client"

import { AlertTriangle, Bell, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const overdueTickets = [
  {
    id: "TK001",
    room: "A101",
    facility: "Projector",
    status: "Assigned",
    overdueSince: "2h 30m",
    priority: "critical",
  },
  { id: "TK005", room: "B202", facility: "AC", status: "Assigned", overdueSince: "1h 15m", priority: "high" },
  { id: "TK012", room: "C303", facility: "WiFi", status: "Resolving", overdueSince: "45m", priority: "high" },
]

const duplicateTickets = [
  { id: "TK003", id2: "TK004", room: "A101", facility: "Projector", createdDiff: "2h" },
  { id: "TK008", id2: "TK009", room: "B202", facility: "AC", createdDiff: "30m" },
]

export default function OverdueEscalationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SLA Exceptions & Escalation</h1>
        <p className="text-slate-600">Monitor overdue tickets and duplicates</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tickets</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTickets.length}</div>
            <p className="text-xs text-slate-600">Requiring immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Tickets</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{duplicateTickets.length}</div>
            <p className="text-xs text-slate-600">Merged this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Count</CardTitle>
            <Bell className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <p className="text-xs text-slate-600">Pending notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Overdue Tickets</CardTitle>
          <CardDescription>Tickets exceeding SLA time - requires escalation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overdue Since</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-l-4 border-l-red-500">
                  <TableCell className="font-bold text-red-600">{ticket.id}</TableCell>
                  <TableCell>{ticket.room}</TableCell>
                  <TableCell>{ticket.facility}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                      <Clock className="w-4 h-4" />
                      {ticket.overdueSince}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="destructive">
                      Escalate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Duplicate Detection */}
      <Card>
        <CardHeader>
          <CardTitle>Duplicate Tickets Detected</CardTitle>
          <CardDescription>System detected similar tickets that should be merged</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Pair</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Time Diff</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duplicateTickets.map((pair, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    {pair.id} + {pair.id2}
                  </TableCell>
                  <TableCell>{pair.room}</TableCell>
                  <TableCell>{pair.facility}</TableCell>
                  <TableCell>{pair.createdDiff}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline">
                      Compare
                    </Button>
                    <Button size="sm" variant="destructive">
                      Merge
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
