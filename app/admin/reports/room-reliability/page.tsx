"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, TrendingDown } from "lucide-react"

const roomReliability = [
  { room: "A101", facility: "Projector", issues: 12, avgResolutionTime: "2.5h", lastIssue: "2025-12-08" },
  { room: "B202", facility: "AC", issues: 18, avgResolutionTime: "3.2h", lastIssue: "2025-12-07" },
  { room: "C303", facility: "WiFi", issues: 25, avgResolutionTime: "1.8h", lastIssue: "2025-12-08" },
  { room: "A202", facility: "Lighting", issues: 8, avgResolutionTime: "1.5h", lastIssue: "2025-12-06" },
  { room: "B101", facility: "Projector", issues: 15, avgResolutionTime: "2.8h", lastIssue: "2025-12-08" },
]

const issueFrequency = [
  { facility: "WiFi", room1: 25, room2: 18, room3: 12, room4: 8 },
  { facility: "Projector", room1: 12, room2: 15, room3: 9, room4: 7 },
  { facility: "AC", room1: 18, room2: 14, room3: 10, room4: 6 },
  { facility: "Lighting", room1: 8, room2: 6, room3: 5, room4: 4 },
]

export default function RoomReliabilityPage() {
  const getReliabilityStatus = (issues: number) => {
    if (issues <= 5) return { color: "bg-green-100 text-green-800", label: "Good" }
    if (issues <= 15) return { color: "bg-yellow-100 text-yellow-800", label: "Fair" }
    return { color: "bg-red-100 text-red-800", label: "Poor" }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Reliability Report</h1>
        <p className="text-slate-600">Track facility issues and room performance</p>
      </div>

      {/* Top Issues */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Problematic Room</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">C303</div>
            <p className="text-xs text-slate-600">25 issues (WiFi)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Reliable</CardTitle>
            <TrendingDown className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A202</div>
            <p className="text-xs text-slate-600">8 issues (Lighting)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Issues/Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.6</div>
            <p className="text-xs text-slate-600">Per facility type</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Frequency by Facility</CardTitle>
          <CardDescription>Across different rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issueFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="facility" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="room1" fill="#ef4444" name="C303" />
              <Bar dataKey="room2" fill="#f97316" name="B202" />
              <Bar dataKey="room3" fill="#eab308" name="A101" />
              <Bar dataKey="room4" fill="#10b981" name="A202" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Performance and reliability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Facility Type</TableHead>
                <TableHead className="text-right">Total Issues</TableHead>
                <TableHead className="text-right">Avg Resolution</TableHead>
                <TableHead>Last Issue</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomReliability.map((room) => {
                const status = getReliabilityStatus(room.issues)
                return (
                  <TableRow key={room.room}>
                    <TableCell className="font-medium">{room.room}</TableCell>
                    <TableCell>{room.facility}</TableCell>
                    <TableCell className="text-right font-medium">{room.issues}</TableCell>
                    <TableCell className="text-right">{room.avgResolutionTime}</TableCell>
                    <TableCell>{room.lastIssue}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
