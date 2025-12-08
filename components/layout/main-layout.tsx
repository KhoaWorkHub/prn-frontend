"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, Settings, LogOut, Globe } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: any) => void
  userRole: string
  onRoleChange: (role: any) => void
}

export function MainLayout({ children, currentView, onViewChange, userRole, onRoleChange }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [language, setLanguage] = useState<"en" | "vi">("en")

  const navItems = [
    { id: "dashboard", label: language === "en" ? "Dashboard" : "Bảng điều khiển", icon: "📊" },
    { id: "tickets", label: language === "en" ? "Tickets" : "Yêu cầu", icon: "🎫" },
    { id: "categories", label: language === "en" ? "Categories" : "Danh mục", icon: "🏷️" },
    { id: "rooms", label: language === "en" ? "Rooms" : "Phòng/Bộ phận", icon: "🏢" },
    { id: "reports", label: language === "en" ? "Reports" : "Báo cáo", icon: "📈" },
  ]

  const renderIcon = (icon: string) => {
    const iconMap: Record<string, string> = {
      "📊": "dashboard",
      "🎫": "tickets",
      "🏷️": "categories",
      "🏢": "rooms",
      "📈": "reports",
    }
    return icon
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center font-bold text-sidebar-primary-foreground">
                FH
              </div>
              <div>
                <div className="font-bold text-sm">FPT Helpdesk</div>
                <div className="text-xs text-sidebar-foreground/60">CSVC System</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {sidebarOpen && (
            <div className="text-xs text-sidebar-foreground/60 px-2">
              {language === "en" ? "Role" : "Vai trò"}:{" "}
              <span className="font-semibold capitalize text-sidebar-foreground">{userRole}</span>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Settings size={18} />
                {sidebarOpen && <span className="ml-2 text-sm">{language === "en" ? "Settings" : "Cài đặt"}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage(language === "en" ? "vi" : "en")}>
                <Globe size={16} className="mr-2" />
                {language === "en" ? "Tiếng Việt" : "English"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onRoleChange(userRole === "admin" ? "technician" : userRole === "technician" ? "staff" : "admin")
                }
              >
                {language === "en" ? "Switch Role" : "Đổi vai trò"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut size={16} className="mr-2" />
                {language === "en" ? "Logout" : "Đăng xuất"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">FPT University Facility Helpdesk</h1>
            <p className="text-sm text-muted-foreground">Facility Feedback & Issue Management System</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {language === "en" ? "Welcome back" : "Chào mừng trở lại"},{" "}
            <span className="font-semibold">Admin User</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
