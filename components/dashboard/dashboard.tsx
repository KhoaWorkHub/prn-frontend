"use client"

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface DashboardProps {
  userRole: string
}

const statData = [
  { label: "Open Tickets", value: "24", change: "+3", icon: "🎫", color: "text-blue-600" },
  { label: "Overdue", value: "5", change: "+1", icon: "⚠️", color: "text-red-600" },
  { label: "Resolved Today", value: "12", change: "+5", icon: "✓", color: "text-green-600" },
  { label: "SLA Compliance", value: "94%", change: "+2%", icon: "📈", color: "text-purple-600" },
]

const ticketData = [
  { date: "Mon", tickets: 12, resolved: 8 },
  { date: "Tue", tickets: 19, resolved: 15 },
  { date: "Wed", tickets: 15, resolved: 12 },
  { date: "Thu", tickets: 25, resolved: 18 },
  { date: "Fri", tickets: 22, resolved: 20 },
  { date: "Sat", tickets: 8, resolved: 8 },
  { date: "Sun", tickets: 5, resolved: 5 },
]

const issueDistribution = [
  { name: "WiFi Issues", value: 35 },
  { name: "AC Issues", value: 28 },
  { name: "Projector", value: 22 },
  { name: "Other", value: 15 },
]

const COLORS = ["#3b82f6", "#f97316", "#8b5cf6", "#ec4899"]

export function Dashboard({ userRole }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statData.map((stat) => (
          <Card key={stat.label} className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                  <span className="text-sm text-green-600 font-semibold">{stat.change}</span>
                </div>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="p-6 col-span-2 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Ticket Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ticketData}>
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
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)" }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-2)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 bg-card flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-4">Issue Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {issueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock size={20} />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: "Ticket #1205 resolved", time: "2 hours ago", type: "resolved" },
            { action: "WiFi issue escalated in Room A205", time: "4 hours ago", type: "escalated" },
            { action: "AC maintenance completed Room B104", time: "6 hours ago", type: "completed" },
            { action: "New ticket assigned to Tech Team", time: "8 hours ago", type: "assigned" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-3 border-b border-border last:border-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  activity.type === "resolved"
                    ? "bg-green-100 text-green-700"
                    : activity.type === "escalated"
                      ? "bg-red-100 text-red-700"
                      : activity.type === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {activity.type === "resolved"
                  ? "✓"
                  : activity.type === "escalated"
                    ? "!"
                    : activity.type === "completed"
                      ? "•"
                      : "→"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
