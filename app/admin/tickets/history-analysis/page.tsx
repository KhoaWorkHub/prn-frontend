"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, TrendingUp, Clock } from "lucide-react"

const ticketHistories = [
  {
    id: "TK001",
    title: "Projector not working",
    totalTime: "2h 45m",
    stateChanges: 4,
    assignmentChanges: 1,
    notes: 3,
    timeline: [
      { time: "09:30", action: "Created", by: "student1", status: "New" },
      { time: "09:45", action: "Assigned", by: "admin1", status: "Assigned", assignee: "tech1" },
      { time: "10:30", action: "Status Changed", by: "tech1", status: "Resolving" },
      { time: "12:15", action: "Resolved", by: "tech1", status: "Resolved" },
    ],
  },
  {
    id: "TK002",
    title: "WiFi down - escalated",
    totalTime: "5h 20m",
    stateChanges: 5,
    assignmentChanges: 2,
    notes: 7,
    timeline: [
      { time: "08:00", action: "Created", by: "student2", status: "New" },
      { time: "08:15", action: "Assigned", by: "admin1", status: "Assigned", assignee: "tech1" },
      { time: "11:00", action: "Reassigned", by: "admin1", status: "Assigned", assignee: "tech2" },
      { time: "12:30", action: "On Hold", by: "tech2", status: "OnHold" },
      { time: "13:20", action: "Resolved", by: "tech2", status: "Resolved" },
    ],
  },
]

export default function HistoryAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ticket History Analysis</h1>
        <p className="text-slate-600">Track ticket lifecycle and changes over time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h 2m</div>
            <p className="text-xs text-slate-600">Across all tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">State Changes</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-slate-600">Avg per ticket</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reassignments</CardTitle>
            <History className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5</div>
            <p className="text-xs text-slate-600">Avg per ticket</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Histories */}
      <div className="space-y-6">
        {ticketHistories.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {ticket.id} - {ticket.title}
                  </CardTitle>
                  <CardDescription>Total resolution time: {ticket.totalTime}</CardDescription>
                </div>
                <div className="flex gap-4 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">{ticket.stateChanges}</span> state changes
                  </div>
                  <div>
                    <span className="font-medium">{ticket.assignmentChanges}</span> reassignments
                  </div>
                  <div>
                    <span className="font-medium">{ticket.notes}</span> notes
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ticket.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4 pb-3 border-b last:border-0 last:pb-0">
                    <div className="min-w-fit">
                      <p className="font-mono text-sm font-medium text-slate-600">{event.time}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{event.action}</p>
                        <Badge className="bg-slate-100 text-slate-800">{event.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        By <span className="font-medium">{event.by}</span>
                        {event.assignee && ` → assigned to ${event.assignee}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
