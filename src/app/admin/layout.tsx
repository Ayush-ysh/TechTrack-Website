"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  Image,
  Megaphone,
  UserPlus,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  BarChart2,
  ClipboardList,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const adminNavItems = [
  { href: "/admin", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/admin/events", label: "EVENTS", icon: Calendar },
  { href: "/admin/registrations", label: "REGISTRATIONS", icon: ClipboardList },
  { href: "/admin/team", label: "TEAM", icon: Users },
  { href: "/admin/achievements", label: "ACHIEVEMENTS", icon: Award },
  { href: "/admin/gallery", label: "GALLERY", icon: Image },
  { href: "/admin/announcements", label: "ANNOUNCEMENTS", icon: Megaphone },
  { href: "/admin/recruitment", label: "RECRUITMENT", icon: UserPlus },
  { href: "/admin/messages", label: "MESSAGES", icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
    router.push("/")
    router.refresh()
  }

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/90 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: isSidebarOpen ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 z-50 h-full w-72 bg-background border-r border-border lg:translate-x-0"
        >
          <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <Link href="/admin" className="font-display text-2xl md:text-3xl tracking-tight mb-12 flex items-center gap-2">
              TECHTRACK <span className="text-primary">;</span>
              <span className="ml-auto font-mono text-xs text-muted-foreground uppercase tracking-widest">CONTROL ROOM</span>
            </Link>

            {/* Close button (mobile) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-6 right-6 p-2 text-foreground"
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 font-mono text-sm uppercase tracking-widest rounded-none transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Bottom actions */}
            <div className="space-y-3 pt-6 border-t border-border">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors font-mono text-sm uppercase tracking-widest"
              >
                <span className="w-5 h-5 border-2 border-current rounded flex items-center justify-center">
                  <ChevronRight size={12} />
                </span>
                VIEW WEBSITE
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors font-mono text-sm uppercase tracking-widest"
              >
                <LogOut size={20} />
                LOGOUT
              </button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-background/90 backdrop-blur-md border-b border-border px-6 py-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-foreground"
              >
                <Menu size={24} />
              </button>
              <h1 className="font-display text-2xl md:text-3xl tracking-tight">
                {adminNavItems.find(item => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))?.label || "DASHBOARD"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
                {session?.user?.name}
              </span>
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}