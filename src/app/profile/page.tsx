"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Users, Clock, Loader2, LogOut, Settings, User, Mail, Building2, GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import toast from "react-hot-toast"

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  WAITLISTED: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  ATTENDED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  WAITLISTED: "WAITLISTED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  ATTENDED: "ATTENDED",
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"profile" | "events" | "settings">("profile")
  const [registrations, setRegistrations] = useState<Array<{
    id: string
    registrationNumber: string
    participantType: string
    teamName: string | null
    status: string
    createdAt: string
    event: {
      id: string
      title: string
      slug: string
      startDate: string
      endDate: string | null
      venue: string | null
      category: string
      status: string
      registrationOpenDate: string | null
      registrationDeadline: string | null
    }
    teamMembers: Array<{
      memberName: string
      email: string
      role: string | null
    }>
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  // Create typed version for use in components
  type Registration = typeof registrations[0]

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/me/registrations")
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      }
    } catch {
      toast.error("Failed to load registrations")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRegistrations()
    }
  }, [session])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
    router.push("/")
    router.refresh()
  }

  const getEventStatus = (event: Registration["event"]) => {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : start

    if (event.status === "CANCELLED") return "CANCELLED"
    if (event.status === "COMPLETED" || now > end) return "COMPLETED"
    if (now >= start && now <= end) return "ONGOING"
    if (event.registrationOpenDate && event.registrationDeadline &&
        now >= new Date(event.registrationOpenDate) && now <= new Date(event.registrationDeadline)) {
      return "REGISTRATION_OPEN"
    }
    return "UPCOMING"
  }

  const upcomingRegistrations = registrations.filter(r => {
    const eventStatus = getEventStatus(r.event)
    return eventStatus === "UPCOMING" || eventStatus === "ONGOING" || eventStatus === "REGISTRATION_OPEN"
  })

  const pastRegistrations = registrations.filter(r => {
    const eventStatus = getEventStatus(r.event)
    return eventStatus === "COMPLETED" || eventStatus === "CANCELLED"
  })

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="font-display text-3xl md:text-4xl tracking-tight"
            >
              TECHTRACK <span className="text-primary">;</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-transparent border-2 border-border text-foreground px-4 py-2 font-mono text-sm uppercase tracking-widest hover:border-primary hover:bg-background/50 transition-colors"
            >
              <LogOut size={18} />
              LOGOUT
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-secondary border border-border overflow-hidden flex-shrink-0">
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full text-muted-foreground flex items-center justify-center" />
              )}
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight">
                {session?.user?.name || "User"}
              </h1>
              <p className="text-muted-foreground font-sans mt-1">{session?.user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-sans text-muted-foreground">
                {session?.user?.college && (
                  <span className="flex items-center gap-1"><Building2 size={14} /> {session.user.college}</span>
                )}
                {session?.user?.course && (
                  <span className="flex items-center gap-1"><GraduationCap size={14} /> {session.user.course}</span>
                )}
                {session?.user?.branch && (
                  <span className="flex items-center gap-1"><GraduationCap size={14} /> {session.user.branch}</span>
                )}
                {session?.user?.year && (
                  <span className="flex items-center gap-1"><Calendar size={14} /> Year: {session.user.year}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-b border-border mb-12"
        >
          <nav className="flex gap-8" role="tablist">
            {[
              { id: "profile", label: "PROFILE", icon: User },
              { id: "events", label: "MY EVENTS", icon: Calendar },
              { id: "settings", label: "SETTINGS", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 pb-4 font-mono text-lg uppercase tracking-widest border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "profile" && (
              <ProfileContent user={session?.user} />
            )}
            {activeTab === "events" && (
              <EventsContent
                registrations={registrations}
                isLoading={isLoading}
                upcomingRegistrations={upcomingRegistrations}
                pastRegistrations={pastRegistrations}
                getEventStatus={getEventStatus}
              />
            )}
            {activeTab === "settings" && (
              <SettingsContent user={session?.user} update={update} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProfileContent({ user }: { user?: { name?: string | null; email?: string | null; image?: string | null; phone?: string | null; college?: string | null; course?: string | null; branch?: string | null; year?: string | null; createdAt?: string } }) {
  return (
    <div className="max-w-2xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary border border-border p-8"
      >
        <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">PROFILE INFORMATION</h2>
        <dl className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">FULL NAME</dt>
              <dd className="font-sans text-lg text-foreground">{user?.name || "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">EMAIL</dt>
              <dd className="font-sans text-lg text-foreground">{user?.email || "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">PHONE</dt>
              <dd className="font-sans text-lg text-foreground">{user?.phone || "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">MEMBER SINCE</dt>
              <dd className="font-sans text-lg text-foreground">
                {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "—"}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">COLLEGE</dt>
              <dd className="font-sans text-lg text-foreground">{user?.college || "—"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">COURSE</dt>
              <dd className="font-sans text-lg text-foreground">{user?.course || "—"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">BRANCH</dt>
              <dd className="font-sans text-lg text-foreground">{user?.branch || "—"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">ACADEMIC YEAR</dt>
              <dd className="font-sans text-lg text-foreground">{user?.year || "—"}</dd>
            </div>
          </div>
        </dl>
      </motion.div>
    </div>
  )
}

function EventsContent({
  registrations,
  isLoading,
  upcomingRegistrations,
  pastRegistrations,
  getEventStatus,
}: {
  registrations: Array<{
    id: string
    registrationNumber: string
    participantType: string
    teamName: string | null
    status: string
    createdAt: string
    event: {
      id: string
      title: string
      slug: string
      startDate: string
      endDate: string | null
      venue: string | null
      category: string
      status: string
      registrationOpenDate: string | null
      registrationDeadline: string | null
    }
    teamMembers: Array<{
      memberName: string
      email: string
      role: string | null
    }>
  }>
  isLoading: boolean
  upcomingRegistrations: Array<{
    id: string
    registrationNumber: string
    participantType: string
    teamName: string | null
    status: string
    createdAt: string
    event: {
      id: string
      title: string
      slug: string
      startDate: string
      endDate: string | null
      venue: string | null
      category: string
      status: string
      registrationOpenDate: string | null
      registrationDeadline: string | null
    }
    teamMembers: Array<{
      memberName: string
      email: string
      role: string | null
    }>
  }>
  pastRegistrations: Array<{
    id: string
    registrationNumber: string
    participantType: string
    teamName: string | null
    status: string
    createdAt: string
    event: {
      id: string
      title: string
      slug: string
      startDate: string
      endDate: string | null
      venue: string | null
      category: string
      status: string
      registrationOpenDate: string | null
      registrationDeadline: string | null
    }
    teamMembers: Array<{
      memberName: string
      email: string
      role: string | null
    }>
  }>
  getEventStatus: (event: {
    id: string
    title: string
    slug: string
    startDate: string
    endDate: string | null
    venue: string | null
    category: string
    status: string
    registrationOpenDate: string | null
    registrationDeadline: string | null
  }) => string
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div key={i} className="bg-secondary border border-border p-6 animate-pulse">
            <div className="h-6 bg-background/50 rounded w-1/4 mb-4" />
            <div className="h-4 bg-background/50 rounded w-1/2" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (registrations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
        <h3 className="font-display text-3xl uppercase tracking-tight mb-2">NO REGISTRATIONS YET</h3>
        <p className="text-muted-foreground font-sans mb-8 max-w-md mx-auto">
          Your next event starts here. Browse upcoming events and register to see them here.
        </p>
        <Link
          href="/#events"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-display text-lg uppercase tracking-widest hover:bg-white hover:text-background transition-colors border-2 border-primary hover:border-white"
        >
          EXPLORE EVENTS <ArrowLeft className="rotate-180" size={20} />
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-12">
      {upcomingRegistrations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-mono text-primary text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            UPCOMING & ONGOING
          </h3>
          <div className="space-y-4">
            {upcomingRegistrations.map((reg) => (
              <EventCard key={reg.id} registration={reg} getEventStatus={getEventStatus} />
            ))}
          </div>
        </motion.div>
      )}

      {pastRegistrations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-mono text-primary text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            PAST EVENTS
          </h3>
          <div className="space-y-4">
            {pastRegistrations.map((reg) => (
              <EventCard key={reg.id} registration={reg} getEventStatus={getEventStatus} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function EventCard({
  registration,
  getEventStatus,
}: {
  registration: {
    id: string
    registrationNumber: string
    participantType: string
    teamName: string | null
    status: string
    createdAt: string
    event: {
      id: string
      title: string
      slug: string
      startDate: string
      endDate: string | null
      venue: string | null
      category: string
      status: string
      registrationOpenDate: string | null
      registrationDeadline: string | null
    }
    teamMembers: Array<{
      memberName: string
      email: string
      role: string | null
    }>
  }
  getEventStatus: (event: {
    id: string
    title: string
    slug: string
    startDate: string
    endDate: string | null
    venue: string | null
    category: string
    status: string
    registrationOpenDate: string | null
    registrationDeadline: string | null
  }) => string
}) {
  const eventStatus = getEventStatus(registration.event)
  const isTeam = registration.participantType === "TEAM"

  return (
    <Link
      href={`/events/${registration.event.slug}`}
      className="group bg-secondary border border-border hover:border-primary transition-colors p-6 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="font-mono text-primary text-xs uppercase tracking-widest">
              {registration.event.category}
            </span>
            <span className={cn(
              "px-3 py-1 font-mono text-xs uppercase tracking-widest rounded-full border",
              statusColors[registration.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
            )}>
              {statusLabels[registration.status] || registration.status}
            </span>
            {eventStatus === "ONGOING" && (
              <span className="flex items-center gap-1 px-3 py-1 font-mono text-xs uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <h4 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
            {registration.event.title}
          </h4>
          <div className="flex flex-wrap gap-4 text-sm font-sans text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(registration.event.startDate), "MMM d, yyyy")}
              {registration.event.endDate && ` - ${format(new Date(registration.event.endDate), "MMM d, yyyy")}`}
            </span>
            {registration.event.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {registration.event.venue}
              </span>
            )}
            {isTeam && registration.teamName && (
              <span className="flex items-center gap-1">
                <Users size={14} />
                Team: {registration.teamName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 md:ml-8">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            REG ID: {registration.registrationNumber}
          </span>
          <ArrowLeft className="text-primary group-hover:translate-x-1 transition-transform" size={24} />
        </div>
      </div>

      {isTeam && registration.teamMembers.length > 1 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
            TEAM MEMBERS
          </div>
          <div className="flex flex-wrap gap-2">
            {registration.teamMembers.map((member, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-background border border-border text-sm font-sans"
              >
                {member.memberName} {member.role ? `(${member.role})` : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </Link>
  )
}

function SettingsContent({ user, update }: { user?: { id: string; role: string; name?: string | null; email?: string | null; image?: string | null; phone?: string | null; college?: string | null; course?: string | null; branch?: string | null; year?: string | null } | null; update?: (data: { name?: string | null; image?: string | null }) => Promise<unknown> }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await update?.({ name: formData.name, image: user?.image })
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      return
    }
    if (formData.newPassword.length < 8) {
      setErrors({ newPassword: "Password must be at least 8 characters" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })
      if (response.ok) {
        toast.success("Password changed successfully")
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to change password")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary border border-border p-8"
      >
        <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">EDIT PROFILE</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label htmlFor="name" className="font-mono text-primary text-sm uppercase tracking-widest block mb-2">
              FULL NAME
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-4 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="font-mono text-primary text-sm uppercase tracking-widest block mb-2">
              EMAIL (CANNOT BE CHANGED)
            </label>
            <input
              type="email"
              value={formData.email}
              className="w-full px-4 py-4 bg-background/50 border border-border text-muted-foreground font-sans cursor-not-allowed"
              disabled
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-3 font-display text-lg uppercase tracking-widest hover:bg-white hover:text-background transition-colors disabled:opacity-50 border-2 border-primary hover:border-white"
          >
            {isLoading ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-secondary border border-border p-8"
      >
        <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">CHANGE PASSWORD</h2>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="font-mono text-primary text-sm uppercase tracking-widest block mb-2">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-4 pr-12 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="font-mono text-primary text-sm uppercase tracking-widest block mb-2">
              NEW PASSWORD
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-4 pr-12 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="font-mono text-primary text-sm uppercase tracking-widest block mb-2">
              CONFIRM NEW PASSWORD
            </label>
            <input
              id="confirmPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-4 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-border text-foreground py-3 font-display text-lg uppercase tracking-widest hover:border-primary hover:bg-background/50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "UPDATING..." : "CHANGE PASSWORD"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}