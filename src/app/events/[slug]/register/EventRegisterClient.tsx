"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Loader2, Check, X, ArrowUpRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { useSession, signIn } from "next-auth/react"

interface EventRegisterClientProps {
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
  }
}

interface TeamMember {
  memberName: string
  email: string
  phone: string
  college: string
  role: string
}

export default function EventRegisterClient({ initialEvent: event }: EventRegisterClientProps) {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [participantType, setParticipantType] = useState<"INDIVIDUAL" | "TEAM">("INDIVIDUAL")
  const [teamName, setTeamName] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [registrationId, setRegistrationId] = useState("")

  const minTeamSize = event.teamMinSize || 1
  const maxTeamSize = event.teamMaxSize || 1

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      const redirectUrl = `/events/${event.slug}/register`
      signIn("credentials", { callbackUrl: redirectUrl })
    }
  }, [authStatus, event.slug])

  // Initialize team members with current user as leader
  useEffect(() => {
    if (session?.user && teamMembers.length === 0) {
      // Use functional update to avoid stale closure
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeamMembers((prev) => {
        if (prev.length > 0) return prev
        return [{
          memberName: session.user.name || "",
          email: session.user.email || "",
          phone: session.user.phone || "",
          college: session.user.college || "",
          role: "Team Leader",
        }]
      })
    }
  }, [session, teamMembers.length])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }

    if (participantType === "TEAM") {
      if (!teamName.trim()) {
        newErrors.teamName = "Team name is required"
      }

      if (teamMembers.length < minTeamSize) {
        newErrors.teamSize = `Minimum team size is ${minTeamSize}`
      }

      if (teamMembers.length > maxTeamSize) {
        newErrors.teamSize = `Maximum team size is ${maxTeamSize}`
      }

      // Check for duplicate emails
      const emails = teamMembers.map(m => m.email.toLowerCase())
      const uniqueEmails = new Set(emails)
      if (emails.length !== uniqueEmails.size) {
        newErrors.duplicateEmail = "Team members must have unique email addresses"
      }

      // Validate each member
      teamMembers.forEach((member, idx) => {
        if (!member.memberName.trim()) {
          newErrors[`member_${idx}_name`] = `Member ${idx + 1} name is required`
        }
        if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
          newErrors[`member_${idx}_email`] = `Member ${idx + 1} email is invalid`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addTeamMember = () => {
    if (teamMembers.length >= maxTeamSize) return
    setTeamMembers([...teamMembers, {
      memberName: "",
      email: "",
      phone: "",
      college: "",
      role: `Member ${teamMembers.length + 1}`,
    }])
  }

  const removeTeamMember = (index: number) => {
    if (teamMembers.length <= minTeamSize) return
    const newMembers = teamMembers.filter((_, i) => i !== index)
    // Reassign roles
    newMembers.forEach((m, i) => {
      if (i === 0) m.role = "Team Leader"
      else m.role = `Member ${i + 1}`
    })
    setTeamMembers(newMembers)
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...teamMembers]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setTeamMembers(newMembers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${event.slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          participantType,
          teamName: participantType === "TEAM" ? teamName : undefined,
          members: participantType === "TEAM" ? teamMembers.slice(1) : undefined, // Exclude leader (already in session)
          agreeToTerms,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.redirect) {
          router.push(data.redirect)
          return
        }
        toast.error(data.error || "Registration failed")
        if (data.details) {
          setErrors(data.details.fieldErrors || {})
        }
        return
      }

      setRegistrationId(data.registrationId)
      setShowSuccess(true)
      toast.success("Registration successful!")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const getEventStatus = () => {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : start

    if (event.status === "CANCELLED") return "CANCELLED"
    if (event.status === "COMPLETED" || now > end) return "COMPLETED"
    if (now >= start && now <= end) return "ONGOING"
    return "UPCOMING"
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="mb-8">
            <Link href="/" className="font-display text-3xl md:text-4xl tracking-tight">
              TECHTRACK <span className="text-primary">;</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary border border-border p-8 md:p-12 space-y-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-primary" />
            </div>

            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight">
              YOU&apos;RE<br />
              <span className="text-primary">IN</span>
              <span className="text-foreground">;</span>
            </h1>

            <p className="text-lg text-muted-foreground font-sans">
              Your registration for <strong className="text-foreground">{event.title}</strong> has been received.
            </p>

            <div className="p-6 bg-background border border-border">
              <p className="font-mono text-primary text-sm uppercase tracking-widest mb-2">REGISTRATION ID</p>
              <p className="font-display text-2xl md:text-3xl text-foreground font-bold">{registrationId}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/profile/events/${registrationId}`}
                className="flex items-center justify-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-display text-lg uppercase tracking-widest hover:bg-white hover:text-background transition-colors border-2 border-primary hover:border-white"
              >
                VIEW REGISTRATION
                <ArrowUpRight size={20} />
              </Link>

              <Link
                href={`/events/${event.slug}`}
                className="flex items-center justify-center gap-2 bg-transparent text-foreground px-6 py-3 font-display text-lg uppercase tracking-widest border-2 border-border hover:border-primary hover:bg-background/50 transition-colors"
              >
                BACK TO EVENT
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (authStatus === "unauthenticated") {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="font-display text-3xl md:text-4xl tracking-tight mb-8 inline-block">
            TECHTRACK <span className="text-primary">;</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:items-start">
            {event.poster && (
              <div className="relative w-full md:w-2/5 aspect-[4/5] flex-shrink-0">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-mono text-primary text-xs uppercase tracking-widest">
                  {event.category}
                </span>
                <span className="px-3 py-1 font-mono text-xs uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                  REGISTRATION OPEN
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight uppercase mb-4">
                {event.title}
              </h1>

              {event.tagline && (
                <p className="text-xl md:text-2xl text-muted-foreground font-sans leading-relaxed mb-6">
                  {event.tagline}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{format(new Date(event.startDate), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{format(new Date(event.startDate), "h:mm a")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{event.venue || "TBA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{minTeamSize === maxTeamSize ? `${minTeamSize}` : `${minTeamSize}-${maxTeamSize}`} members</span>
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-none mb-6">
                  <p className="font-mono text-primary text-sm uppercase tracking-widest mb-1">REGISTRATION DEADLINE</p>
                  <p className="font-display text-xl text-foreground">{format(new Date(event.registrationDeadline), "MMMM d, yyyy")}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-secondary border border-border p-8 md:p-12 space-y-8">
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-8">REGISTRATION DETAILS</h2>

            {/* Participant Type */}
            <div className="space-y-4">
              <label className="font-mono text-primary text-sm uppercase tracking-widest block">PARTICIPANT TYPE</label>
              <div className="flex flex-wrap gap-4">
                <label className={cn(
                  "flex items-center gap-3 px-6 py-4 border-2 cursor-pointer transition-colors",
                  participantType === "INDIVIDUAL"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary"
                )}>
                  <input
                    type="radio"
                    name="participantType"
                    value="INDIVIDUAL"
                    checked={participantType === "INDIVIDUAL"}
                    onChange={() => setParticipantType("INDIVIDUAL")}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">INDIVIDUAL</span>
                    <span className="text-sm text-muted-foreground">Register as a solo participant</span>
                  </div>
                </label>

                {minTeamSize > 1 && (
                  <label className={cn(
                    "flex items-center gap-3 px-6 py-4 border-2 cursor-pointer transition-colors",
                    participantType === "TEAM"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary"
                  )}>
                    <input
                      type="radio"
                      name="participantType"
                      value="TEAM"
                      checked={participantType === "TEAM"}
                      onChange={() => setParticipantType("TEAM")}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">TEAM</span>
                      <span className="text-sm text-muted-foreground">{minTeamSize}-{maxTeamSize} members</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Team Name */}
            {participantType === "TEAM" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-2">
                  <label htmlFor="teamName" className="font-mono text-primary text-sm uppercase tracking-widest block">
                    TEAM NAME
                  </label>
                  <input
                    id="teamName"
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className={cn(
                      "w-full px-4 py-4 bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans",
                      errors.teamName && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Enter your team name"
                  />
                  {errors.teamName && (
                    <motion.p className="text-sm text-red-500 font-sans">{errors.teamName}</motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Team Members */}
            {participantType === "TEAM" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-primary text-sm uppercase tracking-widest">TEAM MEMBERS</label>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      disabled={teamMembers.length >= maxTeamSize}
                      className="flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-border text-foreground hover:border-primary hover:bg-background/50 transition-colors font-mono text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">+</span>
                      ADD MEMBER
                    </button>
                  </div>

                  <div className="space-y-4">
                    {teamMembers.map((member, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-background border border-border p-6 relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-primary text-sm uppercase tracking-widest">
                            {idx === 0 ? "TEAM LEADER" : `MEMBER ${idx}`}
                          </span>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(idx)}
                              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              disabled={teamMembers.length <= minTeamSize}
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">FULL NAME</label>
                            <input
                              type="text"
                              value={member.memberName}
                              onChange={(e) => updateTeamMember(idx, "memberName", e.target.value)}
                              className={cn(
                                "w-full px-4 py-3 bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans",
                                errors[`member_${idx}_name`] && "border-red-500 focus:ring-red-500"
                              )}
                              placeholder={idx === 0 ? "Your name (auto-filled)" : `Member ${idx + 1} name`}
                              disabled={idx === 0}
                            />
                            {errors[`member_${idx}_name`] && (
                              <p className="text-sm text-red-500">{errors[`member_${idx}_name`]}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">EMAIL</label>
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) => updateTeamMember(idx, "email", e.target.value)}
                              className={cn(
                                "w-full px-4 py-3 bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans",
                                errors[`member_${idx}_email`] && "border-red-500 focus:ring-red-500"
                              )}
                              placeholder={idx === 0 ? "Your email (auto-filled)" : `Member ${idx + 1} email`}
                              disabled={idx === 0}
                            />
                            {errors[`member_${idx}_email`] && (
                              <p className="text-sm text-red-500">{errors[`member_${idx}_email`]}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">PHONE</label>
                            <input
                              type="tel"
                              value={member.phone}
                              onChange={(e) => updateTeamMember(idx, "phone", e.target.value)}
                              className="w-full px-4 py-3 bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
                              placeholder="Phone number (optional)"
                              disabled={idx === 0}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">COLLEGE</label>
                            <input
                              type="text"
                              value={member.college}
                              onChange={(e) => updateTeamMember(idx, "college", e.target.value)}
                              className="w-full px-4 py-3 bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
                              placeholder="College name (optional)"
                              disabled={idx === 0}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">ROLE IN TEAM</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMember(idx, "role", e.target.value)}
                              className="w-full px-4 py-3 bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
                              placeholder={idx === 0 ? "Team Leader" : "e.g. Developer, Designer, Presenter"}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {errors.teamSize && (
                    <motion.p className="text-sm text-red-500 font-sans">{errors.teamSize}</motion.p>
                  )}
                  {errors.duplicateEmail && (
                    <motion.p className="text-sm text-red-500 font-sans">{errors.duplicateEmail}</motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Terms */}
            <div className="space-y-4 pt-8 border-t border-border">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-5 h-5 mt-1 border-2 border-border rounded-none bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                />
                <div className="text-sm font-sans text-muted-foreground leading-relaxed">
                  I agree to the <span className="text-foreground font-medium">terms and conditions</span> and confirm that all information provided is accurate. I understand that my registration is subject to verification and approval by the event organizers.
                </div>
              </label>
              {errors.terms && (
                <motion.p className="text-sm text-red-500 font-sans">{errors.terms}</motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 font-display text-xl uppercase tracking-widest hover:bg-white hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary hover:border-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                <>
                  CONFIRM REGISTRATION
                  <ArrowUpRight size={24} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}