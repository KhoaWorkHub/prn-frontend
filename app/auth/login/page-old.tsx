"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, Building2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [language, setLanguage] = useState("en")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication - replace with real auth
    localStorage.setItem("userRole", role)
    localStorage.setItem("language", language)

    if (role === "student" || role === "staff") {
      router.push("/user/dashboard")
    } else if (role === "technician") {
      router.push("/staff/dashboard")
    } else {
      router.push("/admin/dashboard")
    }
  }

  const roleDescriptions: Record<string, string> = {
    student: language === "en" ? "Submit & track facility tickets" : "Gửi & theo dõi ticket CSVC",
    staff: language === "en" ? "Submit & track facility tickets" : "Gửi & theo dõi ticket CSVC",
    technician: language === "en" ? "Resolve tickets, track SLA" : "Xử lý ticket, theo dõi SLA",
    admin: language === "en" ? "Full system management & reporting" : "Quản lý toàn bộ hệ thống",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-primary rounded-lg p-3">
            <Building2 className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-lg font-bold text-white">FPT Helpdesk</h1>
              <p className="text-xs text-blue-100">Facility Management System</p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle>{language === "en" ? "Sign In" : "Đăng Nhập"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Access the facility helpdesk system" : "Truy cập hệ thống quản lý CSVC"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === "en" ? "Email" : "Email"}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="name@fpt.edu.vn"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === "en" ? "Password" : "Mật khẩu"}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === "en" ? "Select Role" : "Chọn Vai Trò"}</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">{language === "en" ? "Student" : "Sinh viên"}</SelectItem>
                    <SelectItem value="staff">{language === "en" ? "Staff" : "Nhân viên"}</SelectItem>
                    <SelectItem value="technician">{language === "en" ? "Technician" : "Kỹ thuật viên"}</SelectItem>
                    <SelectItem value="admin">{language === "en" ? "Administrator" : "Quản trị viên"}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">{roleDescriptions[role]}</p>
              </div>

              <Button type="submit" className="w-full">
                {language === "en" ? "Sign In" : "Đăng Nhập"}
              </Button>
            </form>

            {/* Language Switcher */}
            <div className="mt-6 pt-6 border-t flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
                className="flex-1"
              >
                English
              </Button>
              <Button
                variant={language === "vi" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("vi")}
                className="flex-1"
              >
                Tiếng Việt
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          {language === "en"
            ? "Demo: Use any email/password. For testing, select your role and sign in."
            : "Demo: Sử dụng bất kỳ email/mật khẩu. Để test, chọn vai trò và đăng nhập."}
        </p>
      </div>
    </div>
  )
}
