"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const { user, loading } = useAuth()
  const router = useRouter()

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role - matching backend exactly
      if (user.roles.includes('Administrator') || user.roles.includes('Manager')) {
        router.push('/admin/dashboard')
      } else if (user.roles.includes('Staff')) {
        router.push('/staff/dashboard')
      } else if (user.roles.includes('Reporter')) {
        router.push('/user/dashboard')
      }
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Only show landing page if NOT logged in
  if (user) {
    return null // Will redirect via useEffect
  }

  const t = {
    en: {
      title: "FPT Facility Helpdesk",
      subtitle: "Hệ thống quản lý CSVC & WiFi",
      description: "Submit facility requests, track your tickets, and resolve issues faster",
      loginStudent: "Login as Student",
      loginStaff: "Login as Staff",
      loginAdmin: "Admin Dashboard",
      features: "Real-time Tracking • SLA Management • Fast Resolution",
    },
    vi: {
      title: "FPT Facility Helpdesk",
      subtitle: "Hệ thống quản lý CSVC & WiFi",
      description: "Gửi yêu cầu CSVC, theo dõi ticket và giải quyết vấn đề nhanh chóng",
      loginStudent: "Đăng nhập - Sinh viên",
      loginStaff: "Đăng nhập - Nhân viên",
      loginAdmin: "Bảng điều khiển Admin",
      features: "Theo dõi thực tế • Quản lý SLA • Giải quyết nhanh",
    },
  }

  const content = t[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">FPT</span>
            </div>
            <h1 className="font-bold text-lg hidden sm:block">Facility Helpdesk</h1>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "vi" : "en")}
            className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            {language === "en" ? "Tiếng Việt" : "English"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">{content.title}</h2>
            <p className="text-base sm:text-lg text-muted-foreground">{content.subtitle}</p>
            <p className="text-sm sm:text-base text-muted-foreground/70 max-w-xl mx-auto">{content.description}</p>
            <p className="text-xs sm:text-sm text-primary font-medium">{content.features}</p>
          </div>

          {/* Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-md mx-auto">
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full h-12 text-base font-semibold" variant="default">
                {language === "en" ? "Login" : "Đăng nhập"}
              </Button>
            </Link>

            <Link href="/auth/register" className="flex-1">
              <Button className="w-full h-12 text-base font-semibold" variant="outline">
                {language === "en" ? "Register" : "Đăng ký"}
              </Button>
            </Link>
          </div>

          {/* Quick Info */}
          <div className="grid sm:grid-cols-3 gap-4 pt-12 border-t border-border/40">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">
                {language === "en" ? "Available Anytime" : "Luôn sẵn sàng"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">SLA</div>
              <div className="text-sm text-muted-foreground">
                {language === "en" ? "Guaranteed Response" : "Cam kết phản hồi"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">Real-time</div>
              <div className="text-sm text-muted-foreground">
                {language === "en" ? "Live Updates" : "Cập nhật trực tiếp"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 FPT University Facility Helpdesk System</p>
        </div>
      </footer>
    </div>
  )
}
