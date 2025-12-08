"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Award, Target } from "lucide-react"

const performanceData = [
  { name: "Tech 1", resolved: 25, ontime: 24, late: 1, avgTime: 2.5 },
  { name: "Tech 2", resolved: 20, ontime: 17, late: 3, avgTime: 3.2 },
  { name: "Tech 3", resolved: 22, ontime: 21, late: 1, avgTime: 2.8 },
  { name: "Tech 4", resolved: 18, ontime: 15, late: 3, avgTime: 3.5 },
]

const weeklyData = [
  { day: "Mon", tech1: 4, tech2: 3, tech3: 3, tech4: 2 },
  { day: "Tue", tech1: 5, tech2: 4, tech3: 4, tech4: 3 },
  { day: "Wed", tech1: 4, tech2: 4, tech3: 5, tech4: 3 },
  { day: "Thu", tech1: 5, tech2: 3, tech3: 3, tech4: 4 },
  { day: "Fri", tech1: 7, tech2: 6, tech3: 7, tech4: 6 },
]

const efficiencyData = [
  { tickets: 25, time: 2.5, technician: "Tech 1" },
  { tickets: 20, time: 3.2, technician: "Tech 2" },
  { tickets: 22, time: 2.8, technician: "Tech 3" },
  { tickets: 18, time: 3.5, technician: "Tech 4" },
]

export default function TechnicianPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Technician Performance</h1>
        <p className="text-slate-600">Track individual and team performance metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tech 1</div>
            <p className="text-xs text-slate-600">96% SLA compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Target className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.0h</div>
            <p className="text-xs text-slate-600">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resolved</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-slate-600">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tickets Resolved by Technician</CardTitle>
            <CardDescription>Weekly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tech1" fill="#3b82f6" name="Tech 1" />
                <Bar dataKey="tech2" fill="#f97316" name="Tech 2" />
                <Bar dataKey="tech3" fill="#8b5cf6" name="Tech 3" />
                <Bar dataKey="tech4" fill="#ec4899" name="Tech 4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Analysis</CardTitle>
            <CardDescription>Tickets vs Resolution Time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tickets" name="Tickets Resolved" />
                <YAxis dataKey="time" name="Avg Time (hours)" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Technicians" data={efficiencyData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance</CardTitle>
          <CardDescription>Detailed metrics per technician</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead className="text-right">Resolved</TableHead>
                <TableHead className="text-right">On-Time</TableHead>
                <TableHead className="text-right">Late</TableHead>
                <TableHead className="text-right">Compliance</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((tech) => {
                const compliance = Math.round((tech.ontime / tech.resolved) * 100)
                return (
                  <TableRow key={tech.name}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell className="text-right">{tech.resolved}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">{tech.ontime}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">{tech.late}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={compliance >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                      >
                        {compliance}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{tech.avgTime}h</TableCell>
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
