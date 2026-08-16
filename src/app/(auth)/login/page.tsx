"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/profile"

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
      } else {
        toast.success("Welcome back!")
        router.push(redirect)
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: redirect })
  }

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
            WELCOME<br />
            <span className="text-primary">BACK</span>
            <span className="text-foreground">;</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground font-sans"
          >
            Continue where you left off.
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary border border-border p-8 md:p-10 space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="font-mono text-primary text-sm uppercase tracking-widest block">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-4 py-4 bg-background border border-border text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "font-sans text-base",
                  errors.email && "border-red-500 focus:ring-red-500"
                )}
                placeholder="you@college.edu"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 font-sans"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="font-mono text-primary text-sm uppercase tracking-widest block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-12 py-4 bg-background border border-border text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "font-sans text-base",
                  errors.password && "border-red-500 focus:ring-red-500"
                )}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 font-sans"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 font-display text-xl uppercase tracking-widest hover:bg-white hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary hover:border-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                SIGNING IN...
              </>
            ) : (
              <>
                LOGIN
                <span className="text-2xl">→</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-secondary px-4 text-muted-foreground font-mono uppercase tracking-widest">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            className="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-border text-foreground py-4 font-bold text-lg hover:border-primary hover:bg-background/50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            GOOGLE
          </button>
        </motion.form>

        {/* Footer links */}
        <div className="mt-8 space-y-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-sans text-muted-foreground"
          >
            <Link
              href="/forgot-password"
              className="text-primary hover:underline font-mono text-sm uppercase tracking-widest"
            >
              Forgot password?
            </Link>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-sans text-muted-foreground"
          >
            New here?{" "}
            <Link
              href={`/register${redirect !== "/profile" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="text-primary hover:underline font-bold"
            >
              Create account
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}