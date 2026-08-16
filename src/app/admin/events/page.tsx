"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Plus, Search, Filter, ChevronDown, Edit, Trash2, Eye, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import toast from "react-hot-toast"

interface Event {
  id: string
  slug: string
  title: string
  category: string
  status: string
  featured: boolean
  published: boolean
  startDate: string
  registrationDeadline: string | null
  _count: {
    registrations: number
    teamRegistrations: number
  }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      })
      const response = await fetch(`/api/admin/events?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
      }
    } catch {
      toast.error("Failed to fetch events")
    } finally {
      setIsLoading(false)
    }
  }, [page, search, statusFilter, categoryFilter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents()
  }, [fetchEvents])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This will mark it as cancelled.")) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/events/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Event deleted")
        fetchEvents()
      } else {
        toast.error("Failed to delete event")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`)
      if (!response.ok) throw new Error("Failed to fetch event")

      const { event } = await response.json()
      const { id: _, createdAt, updatedAt, ...eventData } = event
      eventData.title = `${eventData.title} (Copy)`
      eventData.slug = undefined
      eventData.published = false
      eventData.featured = false
      eventData.status = "DRAFT"

      const createResponse = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (createResponse.ok) {
        toast.success("Event duplicated")
        fetchEvents()
      } else {
        toast.error("Failed to duplicate event")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/events/${slug}`)
    toast.success("Event URL copied!")
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    UPCOMING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    REGISTRATION_OPEN: "bg-green-500/20 text-green-400 border-green-500/30",
    ONGOING: "bg-red-500/20 text-red-400 border-red-500/30",
    COMPLETED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight uppercase">
            EVENTS<br />
            <span className="text-primary">MANAGEMENT</span>
            <span className="text-foreground">;</span>
          </h1>
          <p className="text-muted-foreground font-sans mt-2">
            Create, edit, and manage all TechTrack events
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-display text-lg uppercase tracking-widest hover:bg-white hover:text-background transition-colors border-2 border-primary hover:border-white"
        >
          <Plus size={20} />
          CREATE EVENT
        </Link>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-secondary border border-border p-6"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setPage(1)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-background border border-border text-foreground hover:border-primary transition-colors font-mono text-sm uppercase tracking-widest"
            >
              <Filter size={20} />
              FILTERS
              <ChevronDown className={cn("transition-transform", showFilters && "rotate-180")} size={16} />
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-4 lg:ml-auto"
                >
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                  >
                    <option value="all">ALL STATUSES</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                    className="px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                  >
                    <option value="all">ALL CATEGORIES</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="IDEATHON">IDEATHON</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="COMPETITION">COMPETITION</option>
                    <option value="MEETUP">MEETUP</option>
                    <option value="SEMINAR">SEMINAR</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary border border-border overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-background/50 rounded animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No events found. <Link href="/admin/events/new" className="text-primary hover:underline">Create your first event</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground uppercase tracking-widest">EVENT</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground uppercase tracking-widest hidden md:table-cell">CATEGORY</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground uppercase tracking-widest">STATUS</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground uppercase tracking-widest hidden lg:table-cell">REGISTRATIONS</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground uppercase tracking-widest hidden lg:table-cell">DATES</th>
                    <th className="px-6 py-4 text-right font-mono text-xs text-muted-foreground uppercase tracking-widest">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <Link href={`/events/${event.slug}`} target="_blank" className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors">
                            {event.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
                            <span>Slug: {event.slug}</span>
                            {event.featured && <span className="text-primary">★ FEATURED</span>}
                            {!event.published && <span className="text-gray-500">DRAFT</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell font-mono text-sm uppercase tracking-widest text-primary">
                        {event.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 font-mono text-xs uppercase tracking-widest rounded-full border",
                          statusColors[event.status] || statusColors.DRAFT
                        )}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell font-mono text-sm text-muted-foreground">
                        {event._count.registrations + event._count.teamRegistrations} registered
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell font-mono text-sm text-muted-foreground">
                        <div>{format(new Date(event.startDate), "MMM d, yyyy")}</div>
                        {event.registrationDeadline && (
                          <div className="text-primary">Reg: {format(new Date(event.registrationDeadline), "MMM d")}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copySlug(event.slug)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-background/50 transition-colors"
                            title="Copy URL"
                          >
                            <Copy size={18} />
                          </button>
                          <Link
                            href={`/events/${event.slug}`}
                            target="_blank"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-background/50 transition-colors"
                            title="View Public"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-background/50 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(event.id)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-background/50 transition-colors"
                            title="Duplicate"
                          >
                            <span className="w-5 h-5 border-2 border-current rounded flex items-center justify-center text-[8px] font-bold">+</span>
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            {deletingId === event.id ? <span className="w-5 h-5 animate-spin border-2 border-primary border-t-transparent rounded-full" /> : <Trash2 size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <p className="font-mono text-sm text-muted-foreground">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} events
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-background border border-border text-foreground hover:border-primary transition-colors font-mono text-sm uppercase tracking-widest disabled:opacity-50"
                  >
                    PREVIOUS
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-background border border-border text-foreground hover:border-primary transition-colors font-mono text-sm uppercase tracking-widest disabled:opacity-50"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}