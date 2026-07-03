"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { 
  Trophy, 
  MapPin, 
  IndianRupee, 
  Users, 
  User, 
  Upload, 
  FileText, 
  Loader2, 
  AlertCircle,
  X,
  ShieldCheck,
  LogIn,
  LayoutDashboard,
  ArrowLeft
} from "lucide-react"

import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

import { config } from "@/lib/config"
import { createClient } from "@/lib/supabase/client"
import { registerPlayerAction } from "@/features/registrations/actions/register.actions"

function RegisterPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Registration Type state
  const [regType, setRegType] = useState<"team" | "individual">("team")
  
  // File upload state
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Auth gate state
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Existing registration check
  const [existingRegistration, setExistingRegistration] = useState<{ registration_status: string; payment_status: string } | null>(null)
  const [checkingRegistration, setCheckingRegistration] = useState(false)

  // Session expiry
  const [sessionExpired, setSessionExpired] = useState(false)

  // Form submitting state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [declaration, setDeclaration] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  // Team Registration Form State
  const [teamForm, setTeamForm] = useState({
    teamName: "",
    captainName: "",
    captainPhone: "",
    player1: "",
    player2: "",
    player3: "",
    player4: "",
    city: "Delhi NCR",
    preferredNation: ""
  })

  // Individual Registration Form State
  const [indForm, setIndForm] = useState({
    fullName: "",
    phone: "",
    position: "Midfielder",
    city: "Delhi NCR"
  })

  // UPI payment amount
  const fee = regType === "team" ? 3000 : 600

  const TOURNAMENT_ID = searchParams.get("tournamentId") || "8681b997-c81b-4395-89f4-2792e3be75e5"

  // Periodic auth check for session expiry
  const checkSessionAlive = useCallback(async () => {
    if (isAuthenticated && !authLoading) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSessionExpired(true)
        setIsAuthenticated(false)
      }
    }
  }, [isAuthenticated, authLoading])

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      setAuthLoading(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)

        if (user) {
          setCheckingRegistration(true)
          const { data: reg } = await supabase
            .from('registrations')
            .select('registration_status, payment_status')
            .eq('user_id', user.id)
            .eq('tournament_id', TOURNAMENT_ID)
            .maybeSingle()
          setExistingRegistration(reg)
          setCheckingRegistration(false)
        }
      } catch {
        setIsAuthenticated(false)
      }
      setAuthChecked(true)
      setAuthLoading(false)
    }
    checkAuth()
  }, [])

  // Periodically check session every 30s while form is open
  useEffect(() => {
    if (!isAuthenticated || authLoading) return
    const interval = setInterval(checkSessionAlive, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, authLoading, checkSessionAlive])

  const handleGoogleLogin = useCallback(async () => {
    try {
      const supabase = createClient()
      const currentPath = window.location.pathname + window.location.search
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      })
      if (error) throw error
    } catch (err: any) {
      console.error("Google OAuth error:", err)
    }
  }, [])

  // Handle inputs changes
  const handleTeamChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTeamForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }, [])

  const handleIndChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIndForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }, [])

  // File drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const validateAndSetFile = useCallback((file: File) => {
    setFileError(null)
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File is too large. Maximum size is 5MB.")
      return
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      setFileError("Invalid format. Only JPG, JPEG, PNG, and PDF are accepted.")
      return
    }

    setScreenshot(file)

    // Generate image preview if it is an image
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setScreenshotPreview(null) // PDF has no image preview
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }, [validateAndSetFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }, [validateAndSetFile])

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setScreenshot(null)
    setScreenshotPreview(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const [copied, setCopied] = useState(false)

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText("harshitarya78@okicici")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  // Handle submit registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent double submission
    if (isSubmitting) return

    // Validate before showing loading state
    const name = regType === "team" ? teamForm.teamName : indForm.fullName
    const phone = regType === "team" ? teamForm.captainPhone : indForm.phone

    if (!screenshot) {
      setFileError("Please upload payment confirmation screenshot to complete registration.")
      document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    if (!declaration) return

    if (!name.trim()) {
      setFileError("Please enter a valid Name.")
      return
    }

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phone.trim() || !phoneRegex.test(phone)) {
      setFileError("Please enter a valid 10-digit Indian mobile number.")
      return
    }

    if (regType === "team") {
      const playerNames = [
        teamForm.captainName.trim().toLowerCase(),
        teamForm.player1.trim().toLowerCase(),
        teamForm.player2.trim().toLowerCase(),
        teamForm.player3.trim().toLowerCase(),
        teamForm.player4.trim().toLowerCase()
      ]
      const uniqueNames = new Set(playerNames)
      if (uniqueNames.size !== playerNames.length) {
        setFileError("All 5 player names must be unique. Please check for duplicate entries.")
        return
      }
    }

    // All validation passed — show loading state immediately
    setIsSubmitting(true)
    setFileError(null)

    if (config.useLiveRegistration) {
      try {
        const supabase = createClient()

        // 0. Ensure the user is authenticated
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) {
          setFileError("You must be logged in to register. Please sign in and try again.")
          setIsSubmitting(false)
          return
        }
        const email = currentUser.email || ""

        // 1. Upload payment screenshot to payment-screenshots bucket (private, user-scoped)
        const fileExt = screenshot.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${currentUser.id}/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('payment-screenshots')
          .upload(filePath, screenshot, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error("Upload error:", uploadError)
          setFileError("Unable to upload payment proof. Please try again.")
          setIsSubmitting(false)
          return
        }

        // 2. Generate a signed URL so the bucket can stay private
        const { data: signedData, error: signedError } = await supabase
          .storage
          .from('payment-screenshots')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7-day expiry

        const payment_screenshot_url = signedData?.signedUrl || ''

        // 2. Call server-side action to insert records securely
        const result = await registerPlayerAction({
          regType,
          paymentScreenshotUrl: payment_screenshot_url,
          teamForm: regType === "team" ? teamForm : undefined,
          indForm: regType === "individual" ? indForm : undefined
        })

        if (!result.success) {
          console.error("Registration action failed:", result.error)
          setFileError(result.error || "Registration could not be completed. Please try again.")
          setIsSubmitting(false)
          return
        }

        setIsSubmitting(false)
        
        // Redirect passing values
        const successParams: Record<string, string> = {
          type: regType,
          name: name,
          email: email,
          fee: String(fee),
          tournamentId: TOURNAMENT_ID,
          registration_number: result.registrationNumber || '',
          ...(regType === "team" ? { captain: teamForm.captainName, preferredNation: teamForm.preferredNation } : { position: indForm.position })
        }
        const successUrl = `/register/success?` + new URLSearchParams(successParams).toString()

        router.push(successUrl)
      } catch (error: any) {
        console.error("Registration error:", error)
        setFileError("Registration could not be completed. Please try again.")
        setIsSubmitting(false)
      }
    } else {
      // Simulate upload delay (2 seconds)
      setTimeout(() => {
        setIsSubmitting(false)
        const randomNum = Math.floor(100000 + Math.random() * 900000)
        const code = regType === "team" ? "TEM" : "IND"
        const registration_number = `PTN-3V3-${code}-${randomNum}`

        const successUrl = `/register/success?` + new URLSearchParams({
          type: regType,
          name: name,
          email: "",
          fee: String(fee),
          tournamentId: TOURNAMENT_ID,
          registration_number: registration_number,
          ...(regType === "team" ? { captain: teamForm.captainName, preferredNation: teamForm.preferredNation } : { position: indForm.position })
        }).toString()

        router.push(successUrl)
      }, 2000)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-100px] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[300px] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00E676]/5 blur-[120px] pointer-events-none"></div>

      <PtnNavbar />

      <div className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full relative z-10">
        
        {/* 1. Tournament Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="will-change-transform text-center mb-10 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5" /> Registration Open
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-wide text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Mini FIFA World Cup 2026
          </h1>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-semibold text-white/60">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Delhi (Near Metro Routes)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 my-auto hidden sm:block"></span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> ₹3000 Per Team</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 my-auto hidden sm:block"></span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary" /> ₹600 Individual Player</span>
          </div>
        </motion.div>

        {/* Form Container Card */}
        <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          {/* Auth Gate - shown when not authenticated */}
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-white/40 text-sm font-semibold">Checking authentication...</p>
            </div>
          ) : sessionExpired ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-heading font-black text-white uppercase tracking-wide mb-3">Session Expired</h2>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Please sign in again to continue your registration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1 flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black font-bold h-12 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </Button>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-6">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-black text-white uppercase tracking-wide mb-3">Sign in Required</h2>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Please sign in with your Google account before registering.
              </p>
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-8 text-left max-w-sm w-full">
                <p className="text-white/50 text-xs mb-3 font-semibold">Signing in allows you to:</p>
                <ul className="space-y-2 text-xs text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Securely register for tournaments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Track your registration status.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>View your registrations from your Dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Prevent duplicate registrations.</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1 flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black font-bold h-12 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1 border-white/10 hover:border-white/20 bg-transparent text-white hover:bg-white/5 font-bold h-12 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : checkingRegistration ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-white/40 text-sm font-semibold">Checking registration status...</p>
            </div>
          ) : existingRegistration ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-heading font-black text-white uppercase tracking-wide mb-3">You're Already Registered</h2>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                You have already submitted a registration for this tournament.
              </p>

              <div className="bg-black/30 border border-white/5 rounded-xl p-5 mb-8 text-left w-full max-w-sm space-y-3">
                <p className="text-white/50 text-xs mb-2 font-semibold uppercase tracking-wider">Current Status</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Registration Status</span>
                  <span className={`font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    existingRegistration.registration_status === 'Approved'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : existingRegistration.registration_status === 'Rejected'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {existingRegistration.registration_status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Payment Status</span>
                  <span className={`font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    existingRegistration.payment_status === 'Verified'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : existingRegistration.payment_status === 'Failed'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {existingRegistration.payment_status}
                  </span>
                </div>
              </div>

              <p className="text-white/40 text-xs mb-6">You can monitor your registration from your Dashboard.</p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-black font-bold h-12 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1 border-white/10 hover:border-white/20 bg-transparent text-white hover:bg-white/5 font-bold h-12 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Event
                </Button>
              </div>
            </div>
          ) : (
          <>
          {/* 2. Registration Type Selector */}
          <div className="flex rounded-xl bg-black/50 border border-white/5 p-1 mb-8 max-w-md mx-auto relative z-10">
            <button
              type="button"
              onClick={() => {
                setRegType("team")
                removeFile()
              }}
              className={`flex-1 py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                regType === "team" 
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(0,230,118,0.25)]" 
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" /> Team Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setRegType("individual")
                removeFile()
              }}
              className={`flex-1 py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                regType === "individual" 
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(0,230,118,0.25)]" 
                  : "text-white/50 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" /> Individual Player
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 3. Dynamic Registration Form - rendered conditionally */}
            {regType === "team" ? (
              <div key="team-form" className="space-y-6">
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 mb-4">
                  Team Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input 
                      id="teamName" 
                      placeholder="e.g. FC Titans" 
                      value={teamForm.teamName}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredNation">Preferred Football Nation *</Label>
                    <select 
                      id="preferredNation" 
                      value={teamForm.preferredNation}
                      onChange={handleTeamChange}
                      required
                      className="flex h-10 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>Select Football Nation</option>
                      <option value="Portugal">Portugal 🇵🇹</option>
                      <option value="Argentina">Argentina 🇦🇷</option>
                      <option value="Brazil">Brazil 🇧🇷</option>
                      <option value="France">France 🇫🇷</option>
                      <option value="Spain">Spain 🇪🇸</option>
                      <option value="Germany">Germany 🇩🇪</option>
                      <option value="Norway">Norway 🇳🇴</option>
                      <option value="Netherlands">Netherlands 🇳🇱</option>
                      <option value="England">England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
                      <option value="USA">USA 🇺🇸</option>
                      <option value="Mexico">Mexico 🇲🇽</option>
                      <option value="Japan">Japan 🇯🇵</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captainName">Player 1 (Captain) *</Label>
                    <Input 
                      id="captainName" 
                      placeholder="e.g. Full Name" 
                      value={teamForm.captainName}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captainPhone">Captain Mobile Number *</Label>
                    <Input 
                      id="captainPhone" 
                      placeholder="e.g. 9876543210" 
                      type="tel"
                      inputMode="numeric"
                      value={teamForm.captainPhone}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>
                </div>

                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 mt-8 mb-4">
                  Squad Roster (5 Players – Captain counts as Player 1)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="player1">Player 2 Name *</Label>
                    <Input 
                      id="player1" 
                      placeholder="Full Name" 
                      value={teamForm.player1}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player2">Player 3 Name *</Label>
                    <Input 
                      id="player2" 
                      placeholder="Full Name" 
                      value={teamForm.player2}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player3">Player 4 Name *</Label>
                    <Input 
                      id="player3" 
                      placeholder="Full Name" 
                      value={teamForm.player3}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player4">Player 5 Name *</Label>
                    <Input 
                      id="player4" 
                      placeholder="Full Name" 
                      value={teamForm.player4}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>
                </div>

                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 mt-8 mb-4">
                  Additional Details
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      value={teamForm.city}
                      onChange={handleTeamChange}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div key="individual-form" className="space-y-6">
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 mb-4">
                  Player Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      placeholder="e.g. Arjun Sharma" 
                      value={indForm.fullName}
                      onChange={handleIndChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number *</Label>
                    <Input 
                      id="phone" 
                      placeholder="e.g. 9876543210" 
                      type="tel"
                      inputMode="numeric"
                      value={indForm.phone}
                      onChange={handleIndChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Preferred Position *</Label>
                    <select 
                      id="position"
                      value={indForm.position}
                      onChange={handleIndChange}
                      className="flex h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Forward">Forward</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Defender">Defender</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Flexible">Flexible / All-Rounder</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      value={indForm.city}
                      onChange={handleIndChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Payment Section */}
            <div id="payment-section" className="border-t border-white/5 pt-8 space-y-6">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" /> Registration Fee & Payment
              </h3>

              <div className="flex flex-col bg-black/30 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                {/* Header / Fee Summary */}
                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-5 mb-6 w-full">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 text-center">
                    <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest block mb-0.5">Team Registration</span>
                    <span className="text-lg font-heading font-black text-white">₹3000</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 text-center">
                    <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest block mb-0.5">Individual Registration</span>
                    <span className="text-lg font-heading font-black text-white">₹600</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                  {/* Left Column: QR (Mobile first, desktop beside) */}
                  <div className="flex flex-col items-center justify-center w-full md:w-auto shrink-0">
                    <div 
                      onClick={() => setIsQrModalOpen(true)}
                      className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-xl bg-white border-4 border-primary/20 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(0,230,118,0.15)] cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                    >
                      {/* Scanner line animation overlay */}
                      <div className="absolute inset-x-3 top-3 h-0.5 bg-primary/70 animate-pulse shadow-[0_0_10px_#00E676] rounded-full"></div>
                      
                      <Image 
                        src="/images/payment/upi-qr.jpeg" 
                        alt="PTN Payment QR Code" 
                        width={300}
                        height={300}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-3">Click QR to enlarge</span>
                  </div>

                  {/* Right Column: Payment Details & Instructions */}
                  <div className="flex-1 w-full space-y-6">
                    {/* Payment Details */}
                    <div className="space-y-3.5 bg-white/5 border border-white/5 rounded-xl p-5">
                      <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5">
                        <span className="text-white/40 font-medium">Account Holder</span>
                        <span className="text-white font-bold">Harshit Verma</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5">
                        <span className="text-white/40 font-medium">UPI ID</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-xs select-all">harshitarya78@okicici</span>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 bg-white/5 text-primary hover:bg-primary/10 hover:border-primary/30 transition-all shrink-0"
                          >
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-start text-sm">
                        <span className="text-white/40 font-medium pt-0.5">Payment Note</span>
                        <span className="text-primary font-bold text-right text-xs bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
                          {regType === "team" ? "Team" : "Indiv"} Registration
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-white/40 leading-relaxed text-center border border-white/5 bg-white/[0.02] rounded-lg px-3 py-2">
                      Please ensure your payment is sent to the UPI ID shown above before uploading the payment screenshot.
                    </p>

                    {/* Payment Instructions */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Instructions</h4>
                      <ol className="space-y-1.5 text-xs text-white/50 pl-4 list-decimal">
                        <li>Scan the QR code.</li>
                        <li>Complete the payment.</li>
                        <li>Save the payment screenshot.</li>
                        <li>Upload the screenshot below.</li>
                        <li>Enter the UPI Transaction ID.</li>
                        <li>Submit your registration.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Screenshot Upload Area */}
              <div className="space-y-2">
                <Label>Upload Payment Screenshot *</Label>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    isDragOver 
                      ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(0,230,118,0.1)]" 
                      : screenshot 
                        ? "border-primary/40 bg-black/20" 
                        : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60"
                  }`}
                >
                  <input 
                    type="file" 
                    id="screenshot-input"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".jpg,.jpeg,.png,.pdf"
                  />

                  {screenshot ? (
                    <div 
                      key="file-info"
                      className="space-y-4 w-full max-w-xs flex flex-col items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {screenshotPreview ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                          <Image 
                            src={screenshotPreview} 
                            alt="Screenshot Preview" 
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                          <FileText className="w-8 h-8" />
                        </div>
                      )}

                      <div className="text-center">
                        <p className="text-sm font-semibold text-white truncate max-w-[240px]">{screenshot.name}</p>
                        <p className="text-[10px] text-white/40 mt-0.5">{(screenshot.size / 1024).toFixed(1)} KB • {screenshot.type.split("/")[1].toUpperCase()}</p>
                      </div>

                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="xs"
                        onClick={removeFile}
                        className="h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/50"
                      >
                        <X className="w-3.5 h-3.5" /> Remove Screenshot
                      </Button>
                    </div>
                  ) : (
                    <div 
                      key="upload-prompt"
                      className="space-y-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mx-auto group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Drag & drop transaction screenshot here</p>
                        <p className="text-xs text-white/40 mt-1">or click to browse local files</p>
                      </div>
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest pt-2">Accepted formats: JPG, JPEG, PNG, PDF (Max 5MB)</p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <div className="flex items-center gap-2 text-xs text-red-400 mt-2 bg-red-950/20 border border-red-500/20 p-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Declaration Checkbox */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="declaration" 
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  required
                  className="w-4 h-4 accent-primary rounded border-white/10 bg-black shrink-0 mt-0.5"
                />
                <label htmlFor="declaration" className="text-xs text-white/60 leading-relaxed cursor-pointer select-none">
                  I hereby declare that all details provided are correct and accurate. I confirm that I have made the required UPI transaction payment and uploaded the correct confirmation screenshot showing the Transaction ID/UTR. I understand that fake screenshot submissions will result in immediate disqualification without refund. *
                </label>
              </div>
            </div>

            {/* 7. Submit Button */}
            <div className="pt-2 space-y-3">
              {regType === "team" && (
                !teamForm.teamName.trim() ||
                !teamForm.captainName.trim() ||
                !teamForm.player1.trim() ||
                !teamForm.player2.trim() ||
                !teamForm.player3.trim() ||
                !teamForm.player4.trim() ||
                !teamForm.preferredNation
              ) && (
                <p className="text-xs text-red-400 text-center font-bold tracking-wide">
                  ⚠️ All 5 players and the preferred football nation are required.
                </p>
              )}
              <Button
                type="submit"
                disabled={
                  isSubmitting || 
                  (regType === "team" && (
                    !teamForm.teamName.trim() ||
                    !teamForm.captainName.trim() ||
                    !teamForm.player1.trim() ||
                    !teamForm.player2.trim() ||
                    !teamForm.player3.trim() ||
                    !teamForm.player4.trim() ||
                    !teamForm.preferredNation
                  ))
                }
                className="w-full bg-primary text-black font-bold hover:bg-primary/90 h-14 rounded-xl text-sm sm:text-base uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:shadow-[0_0_40px_rgba(0,230,118,0.4)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying Screenshot & Creating Entry...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> Submit Registration
                  </>
                )}
              </Button>
            </div>

          </form>
        </>
        )}
        </div>
      </div>

      {/* Lightbox QR Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQrModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="will-change-transform relative max-w-sm w-full aspect-square bg-white rounded-2xl p-6 border-4 border-primary/20 shadow-2xl flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-black/60 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <Image 
                src="/images/payment/upi-qr.jpeg" 
                alt="Enlarged PTN Payment QR Code" 
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PtnFooter />
    </main>
  )
}

export default React.memo(RegisterPageClient)
