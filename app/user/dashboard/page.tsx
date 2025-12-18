"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { ticketService } from "@/lib/api/ticket.service"
import { TicketResponse, TicketStatus, TicketSeverity } from "@/types/ticket"
import { Plus, AlertCircle, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function UserDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return
      
      try {
        console.log('🔄 Loading reporter tickets for user:', user.id)
        const data = await ticketService.getReporterReportedTickets()
        console.log('✅ Reporter tickets loaded:', data)
        setTickets(data)
      } catch (error: any) {
        toast.error("Không thể tải danh sách ticket", {
          description: error.response?.data?.message || "Vui lòng thử lại sau"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [user])

  const getStatusBadge = (status: TicketStatus) => {
    const colors = {
      [TicketStatus.REPORTED]: "bg-yellow-100 text-yellow-800",
      [TicketStatus.WAITING_FOR_ASSIGNMENT]: "bg-orange-100 text-orange-800",
      [TicketStatus.ASSIGNED]: "bg-blue-100 text-blue-800",
      [TicketStatus.REVIEWING]: "bg-purple-100 text-purple-800",
      [TicketStatus.IN_PROGRESS]: "bg-indigo-100 text-indigo-800",
      [TicketStatus.WAITING_FOR_PART_APPROVAL]: "bg-amber-100 text-amber-800",
      [TicketStatus.WAITING_FOR_PARTS]: "bg-pink-100 text-pink-800",
      [TicketStatus.WAITING_FOR_CLOSE_APPROVAL]: "bg-teal-100 text-teal-800",
      [TicketStatus.CLOSED]: "bg-green-100 text-green-800",
    }
    
    const labels = {
      [TicketStatus.REPORTED]: "Đã báo cáo",
      [TicketStatus.WAITING_FOR_ASSIGNMENT]: "Chờ phân công",
      [TicketStatus.ASSIGNED]: "Đã phân công",
      [TicketStatus.REVIEWING]: "Đang xem xét",
      [TicketStatus.IN_PROGRESS]: "Đang xử lý",
      [TicketStatus.WAITING_FOR_PART_APPROVAL]: "Chờ duyệt linh kiện",
      [TicketStatus.WAITING_FOR_PARTS]: "Chờ linh kiện",
      [TicketStatus.WAITING_FOR_CLOSE_APPROVAL]: "Chờ duyệt đóng",
      [TicketStatus.CLOSED]: "Đã đóng",
    }

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getSeverityBadge = (severity: TicketSeverity) => {
    const colors = {
      [TicketSeverity.A]: "bg-red-100 text-red-800 border-red-300",
      [TicketSeverity.B]: "bg-orange-100 text-orange-800 border-orange-300",
      [TicketSeverity.C]: "bg-blue-100 text-blue-800 border-blue-300",
    }

    return (
      <Badge variant="outline" className={colors[severity]}>
        Mức {severity}
      </Badge>
    )
  }

  return (
    <DashboardLayout allowedRoles={['Reporter']} title="Quản Lý Ticket">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ticket Của Tôi</h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý các báo cáo sự cố</p>
          </div>
          <Link href="/user/tickets/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              Tạo Ticket Mới
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có ticket nào</h3>
            <p className="text-gray-600 mb-6">
              Tạo ticket đầu tiên để báo cáo sự cố cơ sở vật chất
            </p>
            <Link href="/user/tickets/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo Ticket Đầu Tiên
              </Button>
            </Link>
          </Card>
        )}

        {/* Tickets List */}
        {!loading && tickets.length > 0 && (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link key={ticket.ticketId} href={`/user/tickets/${ticket.ticketId}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {getStatusBadge(ticket.status)}
                      {getSeverityBadge(ticket.severity)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Tạo: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {ticket.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Hạn: {new Date(ticket.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Phòng:</span> {ticket.room?.name || 'N/A'}
                    </div>
                    {ticket.assignedToUser && (
                      <div>
                        <span className="font-medium">Được giao:</span> {ticket.assignedToUser.userName}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
