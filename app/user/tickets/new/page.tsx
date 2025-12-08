"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Send } from "lucide-react"

export default function NewTicketPage() {
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "wifi",
    room: "",
    priority: "medium",
    phone: "",
  })

  const t = {
    en: {
      title: "Create New Ticket",
      back: "Back",
      form: {
        title: "Issue Title",
        titlePlaceholder: "e.g., WiFi not working",
        description: "Description",
        descriptionPlaceholder: "Describe the issue in detail...",
        category: "Category",
        room: "Room / Location",
        roomPlaceholder: "e.g., A301",
        priority: "Priority",
        phone: "Phone Number",
        phonePlaceholder: "Your phone number",
        submit: "Submit Ticket",
        cancel: "Cancel",
      },
      categories: {
        wifi: "WiFi Connectivity",
        ac: "Air Conditioning",
        projector: "Projector / Equipment",
        furniture: "Furniture",
        lighting: "Lighting",
        other: "Other",
      },
      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
      },
    },
    vi: {
      title: "Tạo Ticket Mới",
      back: "Quay lại",
      form: {
        title: "Tiêu đề vấn đề",
        titlePlaceholder: "vd: WiFi không hoạt động",
        description: "Mô tả chi tiết",
        descriptionPlaceholder: "Mô tả vấn đề một cách chi tiết...",
        category: "Loại vấn đề",
        room: "Phòng / Vị trí",
        roomPlaceholder: "vd: A301",
        priority: "Mức độ ưu tiên",
        phone: "Số điện thoại",
        phonePlaceholder: "Số điện thoại của bạn",
        submit: "Gửi Ticket",
        cancel: "Hủy",
      },
      categories: {
        wifi: "Kết nối WiFi",
        ac: "Điều hòa không khí",
        projector: "Máy chiếu / Thiết bị",
        furniture: "Đồ dùng",
        lighting: "Chiếu sáng",
        other: "Khác",
      },
      priorities: {
        low: "Thấp",
        medium: "Trung bình",
        high: "Cao",
      },
    },
  }

  const content = t[language]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Ticket submitted:", formData)
    // TODO: Send to API
    alert("Ticket submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/user/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg">{content.title}</h1>
          </div>
          <button
            onClick={() => setLanguage(language === "en" ? "vi" : "en")}
            className="px-2 py-1 rounded text-xs bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {language === "en" ? "VI" : "EN"}
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">{content.form.title}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={content.form.titlePlaceholder}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">{content.form.description}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={content.form.descriptionPlaceholder}
                required
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{content.form.category}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {Object.entries(content.categories).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{content.form.priority}</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {Object.entries(content.priorities).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{content.form.room}</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder={content.form.roomPlaceholder}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{content.form.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={content.form.phonePlaceholder}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Link href="/user/dashboard">
                <Button variant="outline">{content.form.cancel}</Button>
              </Link>
              <Button type="submit" className="gap-2">
                <Send className="w-4 h-4" />
                {content.form.submit}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
