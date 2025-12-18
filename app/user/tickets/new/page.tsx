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

import { useEffect } from "react"
import { metadataService } from "@/lib/api/metadata.service"

export default function CreateTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingMetadata, setLoadingMetadata] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<TicketSeverity>(TicketSeverity.B)
  const [selectedCampus, setSelectedCampus] = useState("")
  const [roomId, setRoomId] = useState("")
  const [facilityTypeId, setFacilityTypeId] = useState("")
  const [issueTypeIds, setIssueTypeIds] = useState<string[]>([""])

  // Real data from backend
  const [campuses, setCampuses] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [facilityTypes, setFacilityTypes] = useState<any[]>([])
  const [issueTypes, setIssueTypes] = useState<any[]>([])

  // Load metadata from backend
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoadingMetadata(true)
        const metadata = await metadataService.getMetadata()
        setCampuses(metadata.campuses || [])
        setRooms(metadata.rooms || [])
        setFacilityTypes(metadata.facilityTypes || [])
        setIssueTypes(metadata.issueTypes || [])
        
        // Check if using fallback data
        if (metadata.campuses.length > 0 && metadata.campuses[0].campusId === "11111111-1111-1111-1111-111111111111") {
          console.info("Using fallback seed data - backend metadata API not available")
        }
      } catch (error) {
        console.error('Failed to load metadata:', error)
        setError("Không thể tải dữ liệu từ server")
      } finally {
        setLoadingMetadata(false)
      }
    }
    
    loadMetadata()
  }, [])

  const filteredRooms = rooms.filter(room => 
    selectedCampus ? room.campus.campusId === selectedCampus : true
  )

  const filteredIssueTypes = issueTypes.filter(issue => 
    facilityTypeId ? true : true  // All issue types available regardless of facility type for now
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

          {loadingMetadata && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              <span>Đang tải dữ liệu từ server...</span>
            </div>
          )}

          {!loadingMetadata && campuses.length === 0 && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Không thể tải dữ liệu từ server hoặc chưa có dữ liệu campus/phòng/thiết bị. 
                Vui lòng liên hệ admin để thiết lập dữ liệu cơ bản.
              </AlertDescription>
            </Alert>
          )}

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
              <Select value={selectedCampus} onValueChange={setSelectedCampus} disabled={loading || loadingMetadata}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingMetadata ? "Đang tải..." : "Chọn campus"} />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus.campusId} value={campus.campusId}>
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
              <Select value={roomId} onValueChange={setRoomId} disabled={loading || loadingMetadata || !selectedCampus}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingMetadata ? "Đang tải..." : selectedCampus ? "Chọn phòng" : "Chọn campus trước"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map((room) => (
                    <SelectItem key={room.roomId} value={room.roomId}>
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
              }} disabled={loading || loadingMetadata}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingMetadata ? "Đang tải..." : "Chọn loại thiết bị"} />
                </SelectTrigger>
                <SelectContent>
                  {facilityTypes.map((facilityType) => (
                    <SelectItem key={facilityType.facilityTypeId} value={facilityType.facilityTypeId}>
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
                    disabled={loading || loadingMetadata || !facilityTypeId}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={facilityTypeId ? "Chọn loại sự cố" : "Chọn thiết bị trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredIssueTypes.map((issueType) => (
                        <SelectItem key={issueType.issueTypeId} value={issueType.issueTypeId}>
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
                  disabled={loading || loadingMetadata || !facilityTypeId}
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
