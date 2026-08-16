"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Users,
  Calendar,
  UserPlus,
  Award,
  Image,
  Mail,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardStats {
  totalUsers: number
  upcomingEvents: number
  ongoingEvents: number
  totalRegistrations: number
  teamMembers: number
  unreadMessages: number
  recruitmentApplications: number
  totalEvents: number
}

interface RecentActivity {
  id: string
  action: string
  targetType: string
  targetId: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  admin: { name: string }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    totalRegistrations: 0,
    teamMembers: 0,
    unreadMessages: 0,
    recruitmentApplications: 0,
    totalEvents: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Array<{
    id: string
    title: string
    slug: string
    registrationDeadline: string | null
    startDate: string
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, deadlinesRes] = await Promise.all([
        fetch("/api/admin/dashboard/stats"),
        fetch("/api/admin/dashboard/activity"),
        fetch("/api/admin/dashboard/deadlines"),
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats)
      }
      if (activityRes.ok) {
        const data = await activityRes.json()
        setRecentActivity(data.activity || [])
      }
      if (deadlinesRes.ok) {
        const data = await deadlinesRes.json()
        setUpcomingDeadlines(data.deadlines || [])
      }
    } catch {
      console.error("Failed to fetch dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData()
  }, [])

  const statCards = [
    { label: "TOTAL USERS", value: stats.totalUsers, icon: Users, color: "bg-blue-500/20 text-blue-400", href: "/admin?tab=users" },
    { label: "UPCOMING EVENTS", value: stats.upcomingEvents, icon: Calendar, color: "bg-green-500/20 text-green-400", href: "/admin/events?status=upcoming" },
    { label: "ONGOING EVENTS", value: stats.ongoingEvents, icon: Clock, color: "bg-red-500/20 text-red-400", href: "/admin/events?status=ongoing" },
    { label: "TOTAL REGISTRATIONS", value: stats.totalRegistrations, icon: UserPlus, color: "bg-purple-500/20 text-purple-400", href: "/admin/registrations" },
    { label: "TEAM MEMBERS", value: stats.teamMembers, icon: Users, color: "bg-orange-500/20 text-orange-400", href: "/admin/team" },
    { label: "UNREAD MESSAGES", value: stats.unreadMessages, icon: Mail, color: "bg-yellow-500/20 text-yellow-400", href: "/admin/messages?status=new" },
    { label: "RECRUITMENT APPS", value: stats.recruitmentApplications, icon: UserPlus, color: "bg-pink-500/20 text-pink-400", href: "/admin/recruitment" },
    { label: "TOTAL EVENTS", value: stats.totalEvents, icon: Calendar, color: "bg-gray-500/20 text-gray-400", href: "/admin/events" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4"
      >
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight uppercase">
            CONTROL<br />
            <span className="text-primary">ROOM</span>
            <span className="text-foreground">;</span>
          </h1>
          <p className="text-muted-foreground font-sans mt-2">
            Manage your TechTrack community and events
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/events/new"
            className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-display text-lg uppercase tracking-widest hover:bg-white hover:text-background transition-colors border-2 border-primary hover:border-white"
          >
            <span className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">+</span>
            CREATE EVENT
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={cn(
              "group bg-secondary border border-border p-6 transition-colors hover:border-primary",
              isLoading && "animate-pulse"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color)}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </div>
            <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
              {isLoading ? "—" : stat.value}
            </div>
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/events/new"
              className="bg-secondary border border-border p-6 hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground">CREATE EVENT</h3>
                  <p className="text-sm text-muted-foreground">Add a new event to the calendar</p>
                </div>
              </div>
              <ArrowUpRight className="absolute right-6 bottom-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </Link>

            <Link
              href="/admin/team"
              className="bg-secondary border border-border p-6 hover:border-primary transition-colors group relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground">MANAGE TEAM</h3>
                  <p className="text-sm text-muted-foreground">Add or update team members</p>
                </div>
              </div>
              <ArrowUpRight className="absolute right-6 bottom-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </Link>

            <Link
              href="/admin/registrations"
              className="bg-secondary border border-border p-6 hover:border-primary transition-colors group relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground">VIEW REGISTRATIONS</h3>
                  <p className="text-sm text-muted-foreground">Manage event registrations</p>
                </div>
              </div>
              <ArrowUpRight className="absolute right-6 bottom-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </Link>

            <Link
              href="/admin/announcements"
              className="bg-secondary border border-border p-6 hover:border-primary transition-colors group relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground">POST ANNOUNCEMENT</h3>
                  <p className="text-sm text-muted-foreground">Share updates with the community</p>
                </div>
              </div>
              <ArrowUpRight className="absolute right-6 bottom-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </Link>
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest">RECENT ACTIVITY</h2>
            <Link
              href="/admin/activity"
              className="font-mono text-xs text-primary uppercase tracking-widest hover:underline"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="bg-secondary border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-background/50 rounded animate-pulse" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentActivity.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-background/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                          {activity.action.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.admin.name}</p>
                          <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
                            {activity.action.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(activity.createdAt).toLocaleString()}
                      </time>
                    </div>
                    {activity.metadata && activity.targetType && (
                      <p className="mt-2 text-sm text-muted-foreground font-mono">
                        {activity.targetType}: {JSON.stringify(activity.metadata).slice(0, 100)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">UPCOMING DEADLINES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingDeadlines.slice(0, 6).map((event) => (
              <Link
                key={event.id}
                href={`/admin/events/${event.id}/edit`}
                className="bg-secondary border border-border p-6 hover:border-primary transition-colors group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-primary text-xs uppercase tracking-widest">
                    {event.registrationDeadline ? "REG DEADLINE" : "EVENT STARTS"}
                  </span>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                  <Calendar size={14} />
                  <span>
                    {event.registrationDeadline
                      ? `Reg closes: ${new Date(event.registrationDeadline).toLocaleDateString()}`
                      : `Starts: ${new Date(event.startDate).toLocaleDateString()}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}