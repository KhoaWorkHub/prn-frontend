"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronRight, Plus, Search, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function UserDashboard() {
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in-progress" | "resolved">("all")

  const t = {
    en: {
      title: "My Tickets",
      welcome: "Welcome, Student",
      newTicket: "New Ticket",
      search: "Search tickets...",
      filter: "Filter by status",
      all: "All",
      open: "Open",
      inProgress: "In Progress",
      resolved: "Resolved",
      noTickets: "No tickets yet",
      createFirst: "Create your first ticket to report an issue",
      status: "Status",
      category: "Category",
      room: "Location",
      priority: "Priority",
      created: "Created",
      sla: "SLA",
      response: "Response Time",
      viewDetails: "View Details",
    },
    vi: {
      title: "Ticket của tôi",
      welcome: "Chào mừng, Sinh viên",
      newTicket: "Yêu cầu mới",
      search: "Tìm ticket...",
      filter: "Lọc theo trạng thái",
      all: "Tất cả",
      open: "Chưa xử lý",
      inProgress: "Đang xử lý",
      resolved: "Đã giải quyết",
      noTickets: "Chưa có ticket nào",
      createFirst: "Tạo ticket đầu tiên để báo cáo vấn đề",
      status: "Trạng thái",
      category: "Loại vấn đề",
      room: "Vị trí",
      priority: "Mức độ ưu tiên",
      created: "Ngày tạo",
      sla: "SLA",
      response: "Thời gian phản hồi",
      viewDetails: "Xem chi tiết",
    },
  }

  const content = t[language]

  // Mock data
  const userTickets = [
    {
      id: "TK-001",
      title: "WiFi not working in Room A301",
      category: "WiFi",
      room: "A301",
      status: "open" as const,
      priority: "high",
      created: "2025-12-05",
      sla: "2 hours",
      responseTime: "15 mins",
    },
    {
      id: "TK-002",
      title: "AC is too cold",
      category: "Air Conditioning",
      room: "B502",
      status: "in-progress" as const,
      priority: "medium",
      created: "2025-12-04",
      sla: "4 hours",
      responseTime: "1 hour",
    },
    {
      id: "TK-003",
      title: "Projector lamp needs replacement",
      category: "Equipment",
      room: "C201",
      status: "resolved" as const,
      priority: "low",
      created: "2025-12-02",
      sla: "8 hours",
      responseTime: "Resolved in 3 hours",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: content.open,
      "in-progress": content.inProgress,
      resolved: content.resolved,
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">FPT</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{content.title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{content.welcome}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "vi" : "en")}
              className="px-2 py-1 rounded text-xs bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {language === "en" ? "VI" : "EN"}
            </button>
            <Link href="/user/tickets/new">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                {content.newTicket}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder={content.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              {["all", "open", "in-progress", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {status === "all"
                    ? content.all
                    : status === "open"
                      ? content.open
                      : status === "in-progress"
                        ? content.inProgress
                        : content.resolved}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {userTickets.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-3">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-semibold text-lg">{content.noTickets}</h3>
              <p className="text-muted-foreground text-sm">{content.createFirst}</p>
              <Link href="/user/tickets/new">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  {content.newTicket}
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {userTickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <Link href={`/user/tickets/${ticket.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-semibold text-primary">{ticket.id}</span>
                        <Badge variant="outline">{ticket.category}</Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority.toUpperCase()}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getStatusIcon(ticket.status)}
                          {getStatusLabel(ticket.status)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 truncate">{ticket.title}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">{content.room}:</span> {ticket.room}
                        </div>
                        <div>
                          <span className="font-medium">{content.created}:</span> {ticket.created}
                        </div>
                        <div>
                          <span className="font-medium">{content.sla}:</span> {ticket.sla}
                        </div>
                        <div>
                          <span className="font-medium">{content.response}:</span> {ticket.responseTime}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
