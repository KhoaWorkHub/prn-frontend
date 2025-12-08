"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function TicketDetailsPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const [comment, setComment] = useState("")

  const t = {
    en: {
      details: "Ticket Details",
      status: "Status",
      priority: "Priority",
      category: "Category",
      room: "Room",
      created: "Created",
      updated: "Last Updated",
      sla: "SLA",
      assignedTo: "Assigned To",
      description: "Description",
      timeline: "Timeline",
      comments: "Comments",
      addComment: "Add Comment",
      send: "Send",
      noComments: "No comments yet",
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    vi: {
      details: "Chi tiết Ticket",
      status: "Trạng thái",
      priority: "Mức độ ưu tiên",
      category: "Loại vấn đề",
      room: "Phòng",
      created: "Ngày tạo",
      updated: "Cập nhật lần cuối",
      sla: "SLA",
      assignedTo: "Được giao cho",
      description: "Mô tả",
      timeline: "Tiến độ",
      comments: "Bình luận",
      addComment: "Thêm bình luận",
      send: "Gửi",
      noComments: "Chưa có bình luận nào",
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
    },
  }

  const content = t[language]

  // Mock data
  const ticket = {
    id: "TK-001",
    title: "WiFi not working in Room A301",
    description: "The WiFi connection is completely down in room A301. No internet access at all.",
    category: "WiFi",
    room: "A301",
    status: "in-progress",
    priority: "high",
    created: "2025-12-05 10:30 AM",
    updated: "2025-12-05 02:15 PM",
    sla: "2 hours",
    assignedTo: "John Smith",
    timeline: [
      { time: "10:30 AM", action: "Ticket created", status: "open" },
      { time: "10:45 AM", action: "Ticket assigned to John Smith", status: "assigned" },
      { time: "02:15 PM", action: "In progress - checking WiFi router", status: "in-progress" },
    ],
    comments: [
      {
        author: "John Smith",
        role: "Technician",
        time: "02:15 PM",
        text: "I am currently investigating the WiFi issue. Will update you shortly.",
      },
    ],
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Comment submitted:", comment)
    setComment("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/user/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg">{content.details}</h1>
              <p className="text-xs text-muted-foreground">{ticket.id}</p>
            </div>
          </div>
          <button
            onClick={() => setLanguage(language === "en" ? "vi" : "en")}
            className="px-2 py-1 rounded text-xs bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {language === "en" ? "VI" : "EN"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Ticket Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">{ticket.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{content.status}</p>
              <Badge variant="outline" className="capitalize">
                {ticket.status}
              </Badge>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{content.priority}</p>
              <Badge className="bg-red-100 text-red-800">{content.high}</Badge>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{content.category}</p>
              <Badge variant="secondary">{ticket.category}</Badge>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{content.room}</p>
              <p className="font-semibold text-sm">{ticket.room}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{content.sla}</p>
              <p className="font-semibold text-sm">{ticket.sla}</p>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-3">{content.description}</h3>
          <p className="text-muted-foreground text-sm">{ticket.description}</p>
          <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{content.created}</p>
              <p className="font-medium">{ticket.created}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{content.updated}</p>
              <p className="font-medium">{ticket.updated}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{content.assignedTo}</p>
              <p className="font-medium">{ticket.assignedTo}</p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">{content.timeline}</h3>
          <div className="space-y-4">
            {ticket.timeline.map((event, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                <div className="flex flex-col items-center">
                  {event.status === "in-progress" ? (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  ) : event.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.action}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Comments */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {content.comments}
          </h3>

          {/* Comments List */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{content.noComments}</p>
            ) : (
              ticket.comments.map((cmt, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">{cmt.author.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{cmt.author}</p>
                      <Badge variant="outline" className="text-xs">
                        {cmt.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{cmt.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{cmt.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={content.addComment}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!comment.trim()} size="sm">
                {content.send}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
