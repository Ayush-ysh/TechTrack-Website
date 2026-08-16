"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, Clock, Users, Share2, Download, ArrowUpRight, X, Loader2, Copy, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import toast from "react-hot-toast"
import QRCode from "qrcode"
import { useSession } from "next-auth/react"

interface EventDetailClientProps {
  initialEvent: {
    id: string
    slug: string
    title: string
    subtitle: string | null
    tagline: string | null
    shortDescription: string | null
    description: string
    category: string
    status: string
    poster: string | null
    banner: string | null
    startDate: Date
    endDate: Date | null
    registrationOpenDate: Date | null
    registrationDeadline: Date | null
    registrationUrl: string | null
    internalRegistrationEnabled: boolean
    venue: string | null
    room: string | null
    onlineUrl: string | null
    teamMinSize: number | null
    teamMaxSize: number | null
    participantLimit: number | null
    allowWaitlist: boolean
    prize: string | null
    rules: string[]
    eligibility: string | null
    schedule: string | null
    rounds: Array<{ name: string; description: string }> | null
    organizer: string | null
    contactInformation: string | null
    featured: boolean
    published: boolean
    cancelledReason: string | null
    coordinators: Array<{ id: string; name: string; contact: string; role: string | null; order: number }>
    scheduleItems: Array<{ id: string; title: string; description: string | null; startTime: Date; endTime: Date | null; location: string | null; order: number }>
  }
  derivedStatus: string
  registrationCount: number
  isRegistrationOpen: boolean
  isFull: boolean
}

const statusLabels: Record<string, { label: string; color: string }> = {
  UPCOMING: { label: "UPCOMING", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  REGISTRATION_OPEN: { label: "REGISTRATION OPEN", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  ONGOING: { label: "LIVE NOW", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  COMPLETED: { label: "COMPLETED", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  CANCELLED: { label: "CANCELLED", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  DRAFT: { label: "DRAFT", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
}

export default function EventDetailClient({
  initialEvent: event,
  derivedStatus,
  registrationCount,
  isRegistrationOpen,
  isFull,
}: EventDetailClientProps) {
  const { data: session } = useSession()
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    const targetDate = derivedStatus === "REGISTRATION_OPEN" && event.registrationDeadline
      ? new Date(event.registrationDeadline)
      : new Date(event.startDate)

    const updateCountdown = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown(null)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [derivedStatus, event.registrationDeadline, event.startDate])

  useEffect(() => {
    if (showQR && !qrCode) {
      const url = typeof window !== "undefined" ? `${window.location.origin}/events/${event.slug}` : ""
      QRCode.toDataURL(url, { width: 256, margin: 2 }).then(setQrCode)
    }
  }, [showQR, event.slug])

  const handleShare = async () => {
    const url = `${window.location.origin}/events/${event.slug}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${event.title} | TechTrack`,
          text: event.tagline || event.shortDescription || "",
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Link copied!")
      }
    } catch {
      // User cancelled or error
    }
  }

  const handleAddToCalendar = () => {
    const startDate = format(new Date(event.startDate), "yyyyMMdd'T'HHmmss'Z'")
    const endDate = event.endDate
      ? format(new Date(event.endDate), "yyyyMMdd'T'HHmmss'Z'")
      : format(new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss'Z'")

    const details = [
      `Event: ${event.title}`,
      event.tagline ? `Tagline: ${event.tagline}` : "",
      event.description ? `Description: ${event.description}` : "",
      `Venue: ${event.venue || "TBA"}`,
      event.organizer ? `Organizer: ${event.organizer}` : "",
      `Event URL: ${window.location.origin}/events/${event.slug}`,
    ].filter(Boolean).join("\\n")

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TechTrack//Event//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@techtrack`,
      `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
      event.venue ? `LOCATION:${event.venue}` : "",
      `URL:${window.location.origin}/events/${event.slug}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${event.slug}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Calendar file downloaded!")
  }

  const getCTAContent = () => {
    if (derivedStatus === "CANCELLED") {
      return { label: "EVENT CANCELLED", variant: "cancelled" as const }
    }
    if (derivedStatus === "COMPLETED") {
      return { label: "VIEW RECAP →", variant: "completed" as const, href: `/events/${event.slug}/recap` }
    }
    if (derivedStatus === "ONGOING") {
      return { label: "● LIVE NOW", variant: "live" as const }
    }
    if (derivedStatus === "UPCOMING" && event.registrationOpenDate && new Date() < new Date(event.registrationOpenDate)) {
      return { label: `REGISTRATION OPENS ${format(new Date(event.registrationOpenDate), "MMM d, yyyy")}`, variant: "upcoming" as const }
    }
    if (isRegistrationOpen && !isFull) {
      return { label: "REGISTER NOW →", variant: "register" as const, href: `/events/${event.slug}/register` }
    }
    if (isFull && event.allowWaitlist) {
      return { label: "JOIN WAITLIST →", variant: "waitlist" as const, href: `/events/${event.slug}/register` }
    }
    if (isFull) {
      return { label: "EVENT FULL", variant: "full" as const }
    }
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return { label: "REGISTRATION CLOSED", variant: "closed" as const }
    }
    return { label: "REGISTRATION CLOSED", variant: "closed" as const }
  }

  const cta = getCTAContent()

  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end">
        {event.banner && (
          <div className="absolute inset-0 z-0">
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className={cn(
                "px-4 py-2 font-mono text-sm uppercase tracking-widest border rounded-full",
                statusLabels[derivedStatus]?.color || statusLabels.UPCOMING.color
              )}>
                {derivedStatus === "ONGOING" && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse mr-2 inline-block" />
                    {statusLabels[derivedStatus]?.label}
                  </>
                )}
                {statusLabels[derivedStatus]?.label}
              </span>

              {event.category && (
                <span className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary border border-primary">
                  {event.category}
                </span>
              )}

              {event.featured && (
                <span className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground bg-primary">
                  FEATURED
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] tracking-tight uppercase mb-6">
              {event.title}
            </h1>

            {event.subtitle && (
              <p className="font-display text-2xl md:text-3xl text-primary mb-6 tracking-tight">
                {event.subtitle}
              </p>
            )}

            {event.tagline && (
              <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
                {event.tagline}
              </p>
            )}

            {countdown && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 md:gap-8 mb-8 p-6 bg-secondary border border-border"
              >
                <span className="font-mono text-primary text-sm uppercase tracking-widest">
                  {derivedStatus === "REGISTRATION_OPEN" ? "REGISTRATION CLOSES IN" : "EVENT STARTS IN"}
                </span>
                <div className="flex items-center gap-2 md:gap-4">
                  <CountdownItem value={countdown.days} label="DD" />
                  <span className="text-primary font-mono text-2xl md:text-3xl">:</span>
                  <CountdownItem value={countdown.hours} label="HH" />
                  <span className="text-primary font-mono text-2xl md:text-3xl">:</span>
                  <CountdownItem value={countdown.minutes} label="MM" />
                  <span className="text-primary font-mono text-2xl md:text-3xl">:</span>
                  <CountdownItem value={countdown.seconds} label="SS" />
                </div>
              </motion.div>
            )}

            <div className="flex flex-wrap gap-4">
              {cta.href && (
                <Link
                  href={cta.href}
                  className={cn(
                    "group flex items-center justify-center gap-3 px-8 py-4 font-display text-xl uppercase tracking-widest border-2 transition-colors",
                    cta.variant === "register" && "bg-primary text-primary-foreground hover:bg-white hover:text-background border-primary hover:border-white",
                    cta.variant === "waitlist" && "bg-transparent text-foreground border-border hover:border-primary hover:bg-background/50",
                    cta.variant === "completed" && "bg-transparent text-foreground border-border hover:border-primary hover:bg-background/50",
                  )}
                >
                  {cta.label}
                  {cta.variant !== "completed" && <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={24} />}
                </Link>
              )}

              {cta.variant === "cancelled" || cta.variant === "closed" || cta.variant === "full" || cta.variant === "live" || cta.variant === "upcoming" ? (
                <span className="flex items-center justify-center px-8 py-4 font-display text-xl uppercase tracking-widest border-2 border-border text-muted-foreground">
                  {cta.label}
                </span>
              ) : null}

              <button
                onClick={handleAddToCalendar}
                className="flex items-center gap-3 px-6 py-4 bg-transparent border-2 border-border text-foreground hover:border-primary hover:bg-background/50 transition-colors font-bold text-lg"
              >
                <Calendar size={20} />
                ADD TO CALENDAR
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-3 px-6 py-4 bg-transparent border-2 border-border text-foreground hover:border-primary hover:bg-background/50 transition-colors font-bold text-lg"
              >
                <Share2 size={20} />
                SHARE
              </button>

              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-3 px-6 py-4 bg-transparent border-2 border-border text-foreground hover:border-primary hover:bg-background/50 transition-colors font-bold text-lg"
              >
                <span className="w-5 h-5 border-2 border-current rounded flex items-center justify-center text-[8px] font-mono">
                  QR
                </span>
                SHOW QR
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-16">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {event.shortDescription && (
                <p className="text-xl md:text-2xl text-muted-foreground font-sans leading-relaxed mb-8 max-w-3xl">
                  {event.shortDescription}
                </p>
              )}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </motion.section>

            {event.rounds && event.rounds.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-8">EVENT FORMAT</h2>
                <div className="space-y-8">
                  {event.rounds.map((round, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-l-2 border-primary pl-8"
                    >
                      <h3 className="font-sans text-2xl text-foreground font-bold mb-3">{round.name}</h3>
                      <p className="text-muted-foreground text-lg">{round.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {event.scheduleItems && event.scheduleItems.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-8">SCHEDULE</h2>
                <div className="space-y-6">
                  {event.scheduleItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-secondary border border-border p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="font-sans text-xl text-foreground font-bold mb-2">{item.title}</h3>
                          {item.description && (
                            <p className="text-muted-foreground mb-2">{item.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm font-sans text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {format(new Date(item.startTime), "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {format(new Date(item.startTime), "h:mm a")}
                              {item.endTime && ` - ${format(new Date(item.endTime), "h:mm a")}`}
                            </span>
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {item.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {event.rules && event.rules.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-8">RULES</h2>
                <ul className="list-disc list-inside space-y-4 text-muted-foreground text-lg">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="marker:text-primary">{rule}</li>
                  ))}
                </ul>
              </motion.section>
            )}

            {event.eligibility && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">ELIGIBILITY</h2>
                <p className="text-lg text-muted-foreground">{event.eligibility}</p>
              </motion.section>
            )}

            {event.prize && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-6">PRIZES</h2>
                <div className="p-8 bg-secondary border border-border text-foreground font-sans text-xl text-center">
                  {event.prize}
                </div>
              </motion.section>
            )}

            {event.coordinators && event.coordinators.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-8">CONTACT</h2>
                <div className="space-y-6">
                  {event.coordinators.map((coord, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-foreground font-bold text-lg">{coord.name}</div>
                          {coord.role && <div className="text-sm text-muted-foreground">{coord.role}</div>}
                          <div className="text-muted-foreground mt-1">{coord.contact}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-secondary border border-border p-8 sticky top-24"
            >
              <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-8">EVENT DETAILS</h2>
              <dl className="space-y-8">
                <div>
                  <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar size={16} /> DATE
                  </dt>
                  <dd className="font-sans text-lg text-foreground">
                    {format(new Date(event.startDate), "MMMM d, yyyy")}
                    {event.endDate && ` - ${format(new Date(event.endDate), "MMMM d, yyyy")}`}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock size={16} /> TIME
                  </dt>
                  <dd className="font-sans text-lg text-foreground">
                    {format(new Date(event.startDate), "h:mm a")}
                    {event.endDate && ` - ${format(new Date(event.endDate), "h:mm a")}`}
                  </dd>
                </div>
                {event.venue && (
                  <div>
                    <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <MapPin size={16} /> VENUE
                    </dt>
                    <dd className="font-sans text-lg text-foreground">{event.venue}</dd>
                  </div>
                )}
                {event.room && (
                  <div>
                    <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <MapPin size={16} /> ROOM
                    </dt>
                    <dd className="font-sans text-lg text-foreground">{event.room}</dd>
                  </div>
                )}
                {(event.teamMinSize || event.teamMaxSize) && (
                  <div>
                    <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Users size={16} /> TEAM SIZE
                    </dt>
                    <dd className="font-sans text-lg text-foreground">
                      {event.teamMinSize === event.teamMaxSize
                        ? `${event.teamMinSize} members`
                        : `${event.teamMinSize || 1} - ${event.teamMaxSize || 1} members`}
                    </dd>
                  </div>
                )}
                {event.registrationDeadline && (
                  <div>
                    <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Calendar size={16} /> REGISTRATION DEADLINE
                    </dt>
                    <dd className="font-sans text-lg text-foreground">
                      {format(new Date(event.registrationDeadline), "MMMM d, yyyy")}
                    </dd>
                  </div>
                )}
                {event.participantLimit && (
                  <div>
                    <dt className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Users size={16} /> CAPACITY
                    </dt>
                    <dd className="font-sans text-lg text-foreground">
                      {registrationCount} / {event.participantLimit} registered
                    </dd>
                  </div>
                )}
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="bg-secondary border border-border p-8"
            >
              <button className="w-full flex items-center justify-between p-4 bg-transparent border-2 border-border text-foreground hover:border-primary transition-colors font-bold text-lg group">
                DOWNLOAD RULEBOOK
                <Download className="group-hover:translate-y-1 transition-transform" size={24} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-background border border-border p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 p-2 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="font-mono text-primary text-sm uppercase tracking-widest mb-4">SCAN TO SHARE</h3>
              <p className="text-sm text-muted-foreground mb-6">{event.title}</p>
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="mx-auto mb-6" />
              ) : (
                <div className="w-64 h-64 mx-auto mb-6 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                {window.location.origin}/events/{event.slug}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3 font-mono text-sm uppercase tracking-widest shadow-2xl"
        >
          <Check size={20} />
          LINK COPIED
        </motion.div>
      )}
    </div>
  )
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl md:text-4xl lg:text-5xl text-primary tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
    </div>
  )
}