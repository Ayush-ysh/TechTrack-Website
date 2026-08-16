"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, User, Mail, Lock, Building2, GraduationCap, Calendar, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/profile"

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    course: "",
    branch: "",
    year: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Full name is required"
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.college) newErrors.college = "College is required"
    if (!formData.course) newErrors.course = "Course is required"
    if (!formData.branch) newErrors.branch = "Branch is required"
    if (!formData.year) newErrors.year = "Academic year is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, redirect }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Registration failed")
        if (data.details) {
          setErrors(data.details.fieldErrors || {})
        }
        return
      }

      toast.success("Account created successfully!")

      // Sign in automatically
      const signInResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, redirect }),
      })

      if (signInResponse.ok) {
        router.push(data.redirect || redirect)
        router.refresh()
      } else {
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const inputFields = [
    { name: "name", label: "FULL NAME", icon: User, placeholder: "Your full name", type: "text" },
    { name: "email", label: "EMAIL", icon: Mail, placeholder: "you@college.edu", type: "email" },
    { name: "password", label: "PASSWORD", icon: Lock, placeholder: "••••••••", type: "password", showToggle: true },
    { name: "confirmPassword", label: "CONFIRM PASSWORD", icon: Lock, placeholder: "••••••••", type: "password", showToggle: true },
    { name: "college", label: "COLLEGE", icon: Building2, placeholder: "Your college name", type: "text" },
    { name: "course", label: "COURSE", icon: GraduationCap, placeholder: "e.g. B.Tech, M.Tech", type: "text" },
    { name: "branch", label: "BRANCH", icon: GraduationCap, placeholder: "e.g. Computer Science", type: "text" },
    { name: "year", label: "ACADEMIC YEAR", icon: Calendar, placeholder: "e.g. 2024, 2025", type: "text" },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 border-4 border-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border-4 border-primary rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-4xl md:text-5xl tracking-tight">
            TECHTRACK <span className="text-primary">;</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tight uppercase"
          >
            JOIN THE<br />
            <span className="text-primary">TRACK</span>
            <span className="text-foreground">;</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground font-sans"
          >
            Create your account to start your journey
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary border border-border p-8 md:p-10 space-y-5"
        >
          {inputFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="font-mono text-primary text-sm uppercase tracking-widest block"
              >
                {field.label}
              </label>
              <div className="relative">
                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  id={field.name}
                  type={field.type === "password" && !showPassword ? "password" : field.type}
                  name={field.name}
                  autoComplete={field.name === "password" ? "new-password" : field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 bg-background border border-border text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "font-sans text-base",
                    field.showToggle && "pr-12",
                    errors[field.name] && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder={field.placeholder}
                  disabled={isLoading}
                />
                {field.showToggle && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
              {errors[field.name] && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 font-sans"
                >
                  {errors[field.name]}
                </motion.p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 font-display text-xl uppercase tracking-widest hover:bg-white hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary hover:border-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                CREATING ACCOUNT...
              </>
            ) : (
              <>
                CREATE ACCOUNT
                <span className="text-2xl">→</span>
              </>
            )}
          </button>
        </motion.form>

        {/* Footer links */}
        <div className="mt-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-sans text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              href={`/login${redirect !== "/profile" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="text-primary hover:underline font-bold"
            >
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}