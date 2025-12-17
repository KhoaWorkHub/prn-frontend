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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TicketSeverity } from "@/types/ticket"
import { ticketService } from "@/lib/api/ticket.service"
import { toast } from "sonner"
import { Loader2, AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react"

// Mock data based on backend enums
const MOCK_CAMPUSES = [
  { id: "1", name: "HCM Campus", value: "1" },
  { id: "2", name: "Hanoi Campus", value: "2" },
  { id: "3", name: "Da Nang Campus", value: "3" },
  { id: "4", name: "Can Tho Campus", value: "4" },
];

const MOCK_ROOMS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Room A101 - HCM", campusId: "1" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Room B201 - HCM", campusId: "1" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Room C101 - Hanoi", campusId: "2" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Room D301 - Hanoi", campusId: "2" },
];

const MOCK_FACILITY_TYPES = [
  { id: "12345678-1234-1234-1234-123456780001", name: "Electrical", value: "0" },
  { id: "12345678-1234-1234-1234-123456780002", name: "Plumbing", value: "1" },
  { id: "12345678-1234-1234-1234-123456780003", name: "Air Conditioning", value: "2" },
  { id: "12345678-1234-1234-1234-123456780004", name: "Furniture", value: "3" },
  { id: "12345678-1234-1234-1234-123456780005", name: "IT Equipment", value: "4" },
  { id: "12345678-1234-1234-1234-123456780006", name: "Lighting", value: "5" },
  { id: "12345678-1234-1234-1234-123456780007", name: "Security", value: "6" },
  { id: "12345678-1234-1234-1234-123456780008", name: "Water System", value: "7" },
  { id: "12345678-1234-1234-1234-123456780009", name: "Cleaning", value: "8" },
  { id: "12345678-1234-1234-1234-123456780010", name: "Other", value: "9" },
];

const MOCK_ISSUE_TYPES = [
  { id: "87654321-4321-4321-4321-210987654321", name: "Power Failure", facilityTypeId: "12345678-1234-1234-1234-123456780001" },
  { id: "87654321-4321-4321-4321-210987654322", name: "Socket Not Working", facilityTypeId: "12345678-1234-1234-1234-123456780001" },
  { id: "87654321-4321-4321-4321-210987654323", name: "Water Leak", facilityTypeId: "12345678-1234-1234-1234-123456780002" },
  { id: "87654321-4321-4321-4321-210987654324", name: "AC Not Cooling", facilityTypeId: "12345678-1234-1234-1234-123456780003" },
  { id: "87654321-4321-4321-4321-210987654325", name: "Computer Not Working", facilityTypeId: "12345678-1234-1234-1234-123456780005" },
];

export default function CreateTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<TicketSeverity>(TicketSeverity.B)
  const [selectedCampus, setSelectedCampus] = useState("")
  const [roomId, setRoomId] = useState("")
  const [facilityTypeId, setFacilityTypeId] = useState("")
  const [issueTypeIds, setIssueTypeIds] = useState<string[]>([""])

  const filteredRooms = MOCK_ROOMS.filter(room => 
    selectedCampus ? room.campusId === selectedCampus : true
  )

  const filteredIssueTypes = MOCK_ISSUE_TYPES.filter(issue => 
    facilityTypeId ? issue.facilityTypeId === facilityTypeId : true
  )

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
    if (!selectedCampus) {
      setError("Vui lòng chọn campus")
      return
    }
    if (!roomId) {
      setError("Vui lòng chọn phòng")
      return
    }
    if (!facilityTypeId) {
      setError("Vui lòng chọn loại thiết bị")
      return
    }
    
    const validIssueTypeIds = issueTypeIds.filter(id => id.trim())
    if (validIssueTypeIds.length === 0) {
      setError("Vui lòng chọn ít nhất 1 loại sự cố")
      return
    }

    setLoading(true)
    
    try {
      await ticketService.createTicket({
        title: title.trim(),
        description: description.trim(),
        severity,
        roomId: roomId,
        facilityTypeId: facilityTypeId,
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

            {/* Campus Selection */}
            <div className="space-y-2">
              <Label>
                Campus <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn campus" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CAMPUSES.map((campus) => (
                    <SelectItem key={campus.id} value={campus.value}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <Label>
                Phòng <span className="text-red-500">*</span>
              </Label>
              <Select value={roomId} onValueChange={setRoomId} disabled={loading || !selectedCampus}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedCampus ? "Chọn phòng" : "Chọn campus trước"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Facility Type Selection */}
            <div className="space-y-2">
              <Label>
                Loại thiết bị <span className="text-red-500">*</span>
              </Label>
              <Select value={facilityTypeId} onValueChange={(value) => {
                setFacilityTypeId(value)
                setIssueTypeIds([""])  // Reset issue types when facility type changes
              }} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_FACILITY_TYPES.map((facilityType) => (
                    <SelectItem key={facilityType.id} value={facilityType.id}>
                      {facilityType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Type Selection */}
            <div className="space-y-2">
              <Label>
                Loại sự cố <span className="text-red-500">*</span>
              </Label>
              {issueTypeIds.map((id, index) => (
                <div key={index} className="flex gap-2">
                  <Select 
                    value={id} 
                    onValueChange={(value) => handleIssueTypeChange(index, value)}
                    disabled={loading || !facilityTypeId}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={facilityTypeId ? "Chọn loại sự cố" : "Chọn thiết bị trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredIssueTypes.map((issueType) => (
                        <SelectItem key={issueType.id} value={issueType.id}>
                          {issueType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              {filteredIssueTypes.length > issueTypeIds.filter(id => id).length && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddIssueType}
                  disabled={loading || !facilityTypeId}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm loại sự cố khác
                </Button>
              )}
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
