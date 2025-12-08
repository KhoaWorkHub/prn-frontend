"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const slaComplianceData = [
  { name: "Week 1", compliance: 95, total: 20 },
  { name: "Week 2", compliance: 88, total: 25 },
  { name: "Week 3", compliance: 92, total: 22 },
  { name: "Week 4", compliance: 97, total: 18 },
]

const facilityData = [
  { name: "Projector", compliance: 90, ontime: 18, late: 2 },
  { name: "Air Conditioner", compliance: 85, ontime: 17, late: 3 },
  { name: "WiFi Router", compliance: 92, ontime: 23, late: 2 },
]

const technicianPerformance = [
  { name: "Technician 1", resolved: 25, ontime: 24, late: 1, avgTime: "2.5h" },
  { name: "Technician 2", resolved: 20, ontime: 17, late: 3, avgTime: "3.2h" },
  { name: "Technician 3", resolved: 22, ontime: 21, late: 1, avgTime: "2.8h" },
]

export default function SLAPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SLA Performance Report</h1>
          <p className="text-slate-600">Monitor SLA compliance and performance metrics</p>
        </div>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">93%</div>
            <p className="text-xs text-green-600">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">79</div>
            <p className="text-xs text-slate-600">out of 85 resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.8h</div>
            <p className="text-xs text-slate-600">Target: 3h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">6</div>
            <p className="text-xs text-red-600">Require escalation</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SLA Compliance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>SLA Compliance Trend</CardTitle>
            <CardDescription>Weekly compliance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={slaComplianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="compliance" stroke="#4570c7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Facility Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Facility SLA Compliance</CardTitle>
            <CardDescription>By facility type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ontime" fill="#10b981" />
                <Bar dataKey="late" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Technician Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Performance</CardTitle>
          <CardDescription>Individual metrics and SLA compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead className="text-right">Resolved</TableHead>
                <TableHead className="text-right">On-Time</TableHead>
                <TableHead className="text-right">Late</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
                <TableHead className="text-right">Compliance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicianPerformance.map((tech) => {
                const compliance = Math.round((tech.ontime / tech.resolved) * 100)
                return (
                  <TableRow key={tech.name}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell className="text-right">{tech.resolved}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">{tech.ontime}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">{tech.late}</TableCell>
                    <TableCell className="text-right">{tech.avgTime}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={compliance >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                      >
                        {compliance}%
                      </Badge>
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
