"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ticketService } from "@/lib/api/ticket.service"
import { TicketResponse, TicketStatus, TicketSeverity, IssueStatus } from "@/types/ticket"
import { Loader2, ArrowLeft, Clock, User, MapPin, Wrench, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<TicketResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketService.getTicketById(params.id as string)
        setTicket(data)
      } catch (error: any) {
        toast.error("Không thể tải thông tin ticket", {
          description: error.response?.data?.message || "Vui lòng thử lại"
        })
        router.push("/user/dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTicket()
    }
  }, [params.id, router])

  const getStatusInfo = (status: TicketStatus) => {
    const statusMap = {
      [TicketStatus.REPORTED]: { label: "Đã báo cáo", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      [TicketStatus.WAITING_FOR_ASSIGNMENT]: { label: "Chờ phân công", color: "bg-orange-100 text-orange-800", icon: Clock },
      [TicketStatus.ASSIGNED]: { label: "Đã phân công", color: "bg-blue-100 text-blue-800", icon: User },
      [TicketStatus.REVIEWING]: { label: "Đang xem xét", color: "bg-purple-100 text-purple-800", icon: Clock },
      [TicketStatus.IN_PROGRESS]: { label: "Đang xử lý", color: "bg-indigo-100 text-indigo-800", icon: Wrench },
      [TicketStatus.WAITING_FOR_PART_APPROVAL]: { label: "Chờ duyệt linh kiện", color: "bg-amber-100 text-amber-800", icon: Clock },
      [TicketStatus.WAITING_FOR_PARTS]: { label: "Chờ linh kiện", color: "bg-pink-100 text-pink-800", icon: Clock },
      [TicketStatus.WAITING_FOR_CLOSE_APPROVAL]: { label: "Chờ duyệt đóng", color: "bg-teal-100 text-teal-800", icon: Clock },
      [TicketStatus.CLOSED]: { label: "Đã đóng", color: "bg-green-100 text-green-800", icon: CheckCircle },
    }
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: AlertCircle }
  }

  const getSeverityInfo = (severity: TicketSeverity) => {
    const severityMap = {
      [TicketSeverity.A]: { label: "Mức A - Cao nhất", color: "bg-red-100 text-red-800 border-red-300" },
      [TicketSeverity.B]: { label: "Mức B - Trung bình", color: "bg-orange-100 text-orange-800 border-orange-300" },
      [TicketSeverity.C]: { label: "Mức C - Thấp", color: "bg-blue-100 text-blue-800 border-blue-300" },
    }
    return severityMap[severity] || { label: severity, color: "bg-gray-100 text-gray-800" }
  }

  const getIssueStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return <XCircle className="w-4 h-4 text-red-600" />
      case IssueStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-orange-600" />
      case IssueStatus.RESOLVED:
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['Reporter']} title="Chi Tiết Ticket">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (!ticket) {
    return null
  }

  const statusInfo = getStatusInfo(ticket.status)
  const severityInfo = getSeverityInfo(ticket.severity)
  const StatusIcon = statusInfo.icon

  return (
    <DashboardLayout allowedRoles={['Reporter']} title="Chi Tiết Ticket">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Header Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{ticket.title}</h1>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {statusInfo.label}
                </Badge>
                <Badge variant="outline" className={severityInfo.color}>
                  {severityInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Ticket ID: {ticket.ticketId}</p>
            </div>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </Card>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location & Equipment */}
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Vị Trí & Thiết Bị
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phòng</p>
                <p className="font-medium">{ticket.room?.roomName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại thiết bị</p>
                <p className="font-medium">{ticket.facilityType?.facilityName || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* People */}
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Người Liên Quan
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Người báo cáo</p>
                <p className="font-medium">{ticket.reporter?.userName || 'N/A'}</p>
                <p className="text-sm text-gray-600">{ticket.reporter?.email || ''}</p>
              </div>
              {ticket.resolver && (
                <div>
                  <p className="text-sm text-gray-500">Người xử lý</p>
                  <p className="font-medium">{ticket.resolver.userName}</p>
                  <p className="text-sm text-gray-600">{ticket.resolver.email}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Thời Gian
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">{formatDate(ticket.createdAt)}</p>
              </div>
              {ticket.dueDate && (
                <div>
                  <p className="text-sm text-gray-500">Hạn xử lý</p>
                  <p className="font-medium text-orange-600">{formatDate(ticket.dueDate)}</p>
                </div>
              )}
              {ticket.assignedAt && (
                <div>
                  <p className="text-sm text-gray-500">Ngày phân công</p>
                  <p className="font-medium">{formatDate(ticket.assignedAt)}</p>
                </div>
              )}
              {ticket.closedAt && (
                <div>
                  <p className="text-sm text-gray-500">Ngày đóng</p>
                  <p className="font-medium">{formatDate(ticket.closedAt)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Issues */}
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Các Vấn Đề ({ticket.issues?.length || 0})
            </h2>
            <div className="space-y-2">
              {ticket.issues && ticket.issues.length > 0 ? (
                ticket.issues.map((issue) => (
                  <div key={issue.ticketIssueId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getIssueStatusIcon(issue.status)}
                      <span className="font-medium">{issue.issueType?.issueName || 'N/A'}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {issue.issueType?.estimatedMinutes || 0} phút
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Chưa có thông tin vấn đề</p>
              )}
            </div>
          </Card>
        </div>

        {/* History Timeline */}
        {ticket.histories && ticket.histories.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Lịch Sử Thay Đổi</h2>
            <div className="space-y-4">
              {ticket.histories.map((history, index) => (
                <div key={history.ticketHistoryId}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      {index < ticket.histories.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{history.user?.userName || 'System'}</p>
                        <p className="text-sm text-gray-500">{formatDate(history.changedAt)}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Đổi <span className="font-medium">{history.fieldType}</span>
                        {history.oldValue && (
                          <> từ <span className="text-red-600">{history.oldValue}</span></>
                        )}
                        {history.newValue && (
                          <> thành <span className="text-green-600">{history.newValue}</span></>
                        )}
                      </p>
                    </div>
                  </div>
                  {index < ticket.histories.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
