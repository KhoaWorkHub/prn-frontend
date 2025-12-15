"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TicketSeverity } from "@/types/ticket"
import { ticketService } from "@/lib/api/ticket.service"
import { toast } from "sonner"
import { Loader2, AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react"

export default function CreateTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<TicketSeverity>(TicketSeverity.B)
  const [roomId, setRoomId] = useState("")
  const [facilityTypeId, setFacilityTypeId] = useState("")
  const [issueTypeIds, setIssueTypeIds] = useState<string[]>([""])

  const handleAddIssueType = () => {
    setIssueTypeIds([...issueTypeIds, ""])
  }

  const handleRemoveIssueType = (index: number) => {
    setIssueTypeIds(issueTypeIds.filter((_, i) => i !== index))
  }

  const handleIssueTypeChange = (index: number, value: string) => {
    const updated = [...issueTypeIds]
    updated[index] = value
    setIssueTypeIds(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!title.trim()) {
      setError("Tiêu đề không được để trống")
      return
    }
    if (!description.trim()) {
      setError("Mô tả không được để trống")
      return
    }
    if (!roomId.trim()) {
      setError("Vui lòng nhập Room ID")
      return
    }
    if (!facilityTypeId.trim()) {
      setError("Vui lòng nhập Facility Type ID")
      return
    }
    
    const validIssueTypeIds = issueTypeIds.filter(id => id.trim())
    if (validIssueTypeIds.length === 0) {
      setError("Vui lòng nhập ít nhất 1 Issue Type ID")
      return
    }

    setLoading(true)
    
    try {
      await ticketService.createTicket({
        title: title.trim(),
        description: description.trim(),
        severity,
        roomId: roomId.trim(),
        facilityTypeId: facilityTypeId.trim(),
        issueTypeIds: validIssueTypeIds,
      })
      
      toast.success("Tạo ticket thành công!", {
        description: "Ticket của bạn đã được gửi và đang chờ xử lý."
      })
      
      router.push("/user/dashboard")
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Không thể tạo ticket. Vui lòng thử lại."
      setError(errorMsg)
      toast.error("Lỗi", { description: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={['Reporter']} title="Tạo Ticket Mới">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Báo Cáo Sự Cố Cơ Sở Vật Chất</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Máy chiếu không hoạt động"
                disabled={loading}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                rows={5}
                disabled={loading}
                required
              />
              <p className="text-sm text-gray-500">
                Hãy mô tả cụ thể: khi nào xảy ra, triệu chứng, đã thử cách nào chưa, etc.
              </p>
            </div>

            {/* Severity */}
            <div className="space-y-3">
              <Label>
                Mức độ ưu tiên <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={severity}
                onValueChange={(value) => setSeverity(value as TicketSeverity)}
                disabled={loading}
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value={TicketSeverity.A} id="severity-a" />
                  <Label htmlFor="severity-a" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-red-600">A - Cao nhất</div>
                    <div className="text-sm text-gray-600">Khẩn cấp, ảnh hưởng nghiêm trọng</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value={TicketSeverity.B} id="severity-b" />
                  <Label htmlFor="severity-b" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-orange-600">B - Trung bình</div>
                    <div className="text-sm text-gray-600">Cần xử lý sớm</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value={TicketSeverity.C} id="severity-c" />
                  <Label htmlFor="severity-c" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-blue-600">C - Thấp</div>
                    <div className="text-sm text-gray-600">Không gấp</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Room ID (temporary - will be dropdown when backend API ready) */}
            <div className="space-y-2">
              <Label htmlFor="roomId">
                Room ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Nhập GUID của phòng (tạm thời)"
                disabled={loading}
                required
              />
              <p className="text-xs text-amber-600">
                ⚠️ Tạm thời nhập GUID. Sẽ có dropdown khi backend cung cấp API GET /api/rooms
              </p>
            </div>

            {/* Facility Type ID (temporary) */}
            <div className="space-y-2">
              <Label htmlFor="facilityTypeId">
                Facility Type ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="facilityTypeId"
                value={facilityTypeId}
                onChange={(e) => setFacilityTypeId(e.target.value)}
                placeholder="Nhập GUID của loại thiết bị (tạm thời)"
                disabled={loading}
                required
              />
              <p className="text-xs text-amber-600">
                ⚠️ Tạm thời nhập GUID. Sẽ có dropdown khi backend cung cấp API GET /api/facility-types
              </p>
            </div>

            {/* Issue Type IDs (temporary) */}
            <div className="space-y-2">
              <Label>
                Issue Type IDs <span className="text-red-500">*</span>
              </Label>
              {issueTypeIds.map((id, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={id}
                    onChange={(e) => handleIssueTypeChange(index, e.target.value)}
                    placeholder="Nhập GUID của issue type"
                    disabled={loading}
                  />
                  {issueTypeIds.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveIssueType(index)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddIssueType}
                disabled={loading}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm Issue Type
              </Button>
              <p className="text-xs text-amber-600">
                ⚠️ Tạm thời nhập GUIDs. Sẽ có multi-select khi backend cung cấp API GET /api/issue-types
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Tạo Ticket"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
