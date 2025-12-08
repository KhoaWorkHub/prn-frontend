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
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

const slaReportData = [
  { facility: "WiFi", onTime: 94, overdue: 6 },
  { facility: "AC", onTime: 88, overdue: 12 },
  { facility: "Projector", onTime: 92, overdue: 8 },
  { facility: "Locks", onTime: 85, overdue: 15 },
]

const volumeData = [
  { week: "Week 1", volume: 45, resolved: 42 },
  { week: "Week 2", volume: 52, resolved: 48 },
  { week: "Week 3", volume: 48, resolved: 46 },
  { week: "Week 4", volume: 61, resolved: 55 },
]

const technicianData = [
  { name: "Tech 01", resolved: 24, slaRate: 96 },
  { name: "Tech 02", resolved: 19, slaRate: 89 },
  { name: "Tech 03", resolved: 21, slaRate: 92 },
  { name: "Tech 04", resolved: 18, slaRate: 88 },
]

const COLORS = ["#3b82f6", "#f97316"]

export function ReportDashboard() {
  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">SLA & Performance Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar size={18} className="mr-2" />
            Date Range
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <Download size={18} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* SLA Compliance by Facility */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">SLA Compliance by Facility Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={slaReportData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="onTime" fill="var(--color-chart-3)" />
            <Bar dataKey="overdue" fill="var(--color-destructive)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Ticket Volume Trend */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Ticket Volume & Resolution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="volume" stroke="var(--color-primary)" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="var(--color-chart-3)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Technician Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Technician Performance</h3>
          <div className="space-y-4">
            {technicianData.map((tech) => (
              <div key={tech.name} className="border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{tech.name}</span>
                  <span className="text-sm text-muted-foreground">{tech.resolved} resolved</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${tech.slaRate}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">SLA Compliance: {tech.slaRate}%</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Metrics */}
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Performance Indicators</h3>
          <div className="space-y-4">
            {[
              { label: "Avg Resolution Time", value: "3.2 hours", trend: "↓ 5%" },
              { label: "Overall SLA Compliance", value: "91.2%", trend: "↑ 2%" },
              { label: "Customer Satisfaction", value: "4.6/5", trend: "↑ 0.3" },
              { label: "MTTR (Mean Time To Resolve)", value: "2.8h", trend: "↓ 8%" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">{metric.trend}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
