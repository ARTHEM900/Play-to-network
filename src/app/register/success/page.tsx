"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Check, 
  Home, 
  Eye, 
  ChevronRight, 
  Calendar, 
  User, 
  Users, 
  FileText, 
  HelpCircle,
  MessageSquare,
  Clock,
  AlertCircle
} from "lucide-react"

import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"

function RegisterSuccessContent() {
  const searchParams = useSearchParams()
  
  // Dynamic parameters from the registration flow
  const regType = searchParams.get("type") || "team"
  const entityName = searchParams.get("name") || "Player Squad"
  const email = searchParams.get("email") || "player@playtonetwork.com"
  const feePaid = searchParams.get("fee") || "3000"
  const tournamentId = searchParams.get("tournamentId") || "8681b997-c81b-4395-89f4-2792e3be75e5"
  const preferredNation = searchParams.get("preferredNation") || ""
  
  const [regId, setRegId] = useState("")
  const [submissionDate, setSubmissionDate] = useState("")

  useEffect(() => {
    const registrationNumberParam = searchParams.get("registration_number")
    if (registrationNumberParam) {
      setRegId(registrationNumberParam)
    } else {
      // Generate a fixed, reproducible-looking registration reference
      const randomNum = Math.floor(100000 + Math.random() * 900000)
      const code = regType === "team" ? "TEM" : "IND"
      setRegId(`PTN-3V3-${code}-${randomNum}`)
    }

    // Format current date and time nicely
    const today = new Date()
    const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true }
    setSubmissionDate(`${today.toLocaleDateString("en-US", dateOptions)} at ${today.toLocaleTimeString("en-US", timeOptions)}`)
  }, [regType, searchParams])

  return (
    <div className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full relative z-10 flex flex-col items-center">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* 1. Success Header */}
      <div className="text-center mb-10">
        <div className="relative mb-6 mx-auto w-20 h-20">
          {/* Ring Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-primary/10 blur-xl pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-[#0B0B0B]/90 border border-primary/45 flex items-center justify-center shadow-[0_0_35px_rgba(0,230,118,0.3)]"
          >
            <svg 
              className="w-10 h-10 text-primary" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <motion.path 
                d="M20 6L9 17l-5-5" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
              />
            </svg>
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-heading font-black tracking-wide text-white uppercase bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent"
        >
          🎉 Registration Submitted Successfully
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm font-medium text-white/75 mt-3 max-w-xl mx-auto leading-relaxed space-y-2"
        >
          <p>Your registration has been received successfully.</p>
          <p className="text-white/60 text-xs">Your payment proof has been uploaded and is currently awaiting manual verification by the Play To Network organizing team.</p>
          <p className="text-white/60 text-xs flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-semibold">Verification usually takes 2–12 hours.</span>
          </p>
        </motion.div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Registration Status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Submitted
          </span>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Payment Status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending Verification
          </span>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Tournament Status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/5 text-white/80 border border-white/10">
            Registration Received
          </span>
        </div>
      </div>

      {/* After Verification Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="w-full bg-[#0B0B0B]/60 border border-primary/10 rounded-2xl p-5 space-y-3"
      >
        <h3 className="text-xs font-black tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          After Successful Verification
        </h3>
        <ul className="space-y-2 text-xs text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Your registration will be approved.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>You will be manually added to the official Play To Network WhatsApp Community.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>All tournament updates, fixtures, schedules, venue details and announcements will be shared there.</span>
          </li>
        </ul>
        <p className="text-xs text-white/50 pt-1">You can track your registration status anytime from your Dashboard.</p>
      </motion.div>

      {/* Main Glassmorphic Wrapper Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full bg-[#0B0B0B]/80 border border-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-primary/10 transition-all duration-300 flex flex-col gap-8"
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* 2. Registration Summary */}
        <div>
          <h3 className="text-xs font-black tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Registration Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/45 border border-white/5 p-5 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Tournament Name</span>
              <div className="text-xs font-extrabold text-white">Mini FIFA World Cup 2026</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Registration Number</span>
              <div className="text-xs font-mono font-bold text-primary select-all">{regId}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Registration Type</span>
              <div className="flex items-center gap-1.5">
                {regType === "team" ? <Users className="size-3.5 text-primary" /> : <User className="size-3.5 text-cyan-400" />}
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {regType === "team" ? "Team Registration" : "Individual Player"}
                </span>
              </div>
            </div>

            {regType === "team" && preferredNation && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Preferred Football Nation</span>
                <div className="text-xs font-bold text-primary uppercase tracking-wide">{preferredNation}</div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                {regType === "team" ? "Team Name" : "Player Name"}
              </span>
              <div className="text-xs font-extrabold text-white truncate">{entityName}</div>
            </div>

            {regType === "team" && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Captain Name</span>
                <div className="text-xs font-semibold text-white/80">
                  {searchParams.get("captain") || ""}
                </div>
              </div>
            )}

            <div className="space-y-1 sm:col-span-2 border-t border-white/5 pt-3.5 mt-1 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Submission Date & Time</span>
                <span className="font-semibold text-white/90">{submissionDate}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block">Amount Paid</span>
                <span className="font-bold text-white">₹{feePaid} via UPI</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Verification Timeline */}
        <div>
          <h3 className="text-xs font-black tracking-widest text-primary uppercase mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Verification Timeline
          </h3>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 px-2">
            {/* Connecting line (Desktop) */}
            <div className="absolute top-[16px] left-[10%] right-[10%] h-[2px] bg-white/5 z-0 hidden md:block" />
            
            {/* Step 1 */}
            <div className="flex md:flex-col items-center gap-3 md:gap-2.5 text-left md:text-center z-10 w-full md:w-1/5">
              <div className="size-8 rounded-full bg-primary/25 border-2 border-primary flex items-center justify-center text-primary text-xs font-extrabold shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                ✓
              </div>
              <div className="flex flex-col md:items-center">
                <span className="text-[11px] font-bold text-white">Registration Submitted</span>
                <span className="text-[8px] text-primary font-bold uppercase tracking-wider mt-0.5">COMPLETED</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex md:flex-col items-center gap-3 md:gap-2.5 text-left md:text-center z-10 w-full md:w-1/5">
              <div className="size-8 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-xs font-extrabold animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                2
              </div>
              <div className="flex flex-col md:items-center">
                <span className="text-[11px] font-bold text-white">Payment Verification</span>
                <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">IN PROGRESS</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex md:flex-col items-center gap-3 md:gap-2.5 text-left md:text-center z-10 w-full md:w-1/5">
              <div className="size-8 rounded-full bg-[#161616] border-2 border-white/10 flex items-center justify-center text-white/30 text-xs font-bold">
                3
              </div>
              <div className="flex flex-col md:items-center">
                <span className="text-[11px] font-bold text-white/40">Registration Approval</span>
                <span className="text-[8px] text-white/20 font-bold uppercase tracking-wider mt-0.5">PENDING</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex md:flex-col items-center gap-3 md:gap-2.5 text-left md:text-center z-10 w-full md:w-1/5">
              <div className="size-8 rounded-full bg-[#161616] border-2 border-white/10 flex items-center justify-center text-white/30 text-xs font-bold">
                4
              </div>
              <div className="flex flex-col md:items-center">
                <span className="text-[11px] font-bold text-white/40">Fixtures Released</span>
                <span className="text-[8px] text-white/20 font-bold uppercase tracking-wider mt-0.5">PENDING</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex md:flex-col items-center gap-3 md:gap-2.5 text-left md:text-center z-10 w-full md:w-1/5">
              <div className="size-8 rounded-full bg-[#161616] border-2 border-white/10 flex items-center justify-center text-white/30 text-xs font-bold">
                5
              </div>
              <div className="flex flex-col md:items-center">
                <span className="text-[11px] font-bold text-white/40">Tournament Day</span>
                <span className="text-[8px] text-white/20 font-bold uppercase tracking-wider mt-0.5">PENDING</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. What Happens Next / Notice */}
        <div className="border-t border-white/5 pt-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-2">
          <h3 className="text-xs font-black tracking-widest text-amber-400 uppercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Verification Notice
          </h3>
          <p className="text-xs text-white/75 leading-relaxed">
            Payment verification is usually completed within <strong>2–12 hours</strong>. If your payment is not verified within 24 hours, please contact the organizers.
          </p>
        </div>

        {/* 5. Contact info */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <h3 className="text-xs font-black tracking-widest text-primary uppercase flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Support & Organizer Contacts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/60">
            <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
              <User className="size-4 text-primary shrink-0" />
              <div>
                <p className="font-bold text-white">Pratham Jain</p>
                <p className="text-white/40 font-mono mt-0.5">📞 8766284161</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
              <User className="size-4 text-primary shrink-0" />
              <div>
                <p className="font-bold text-white">Harshit Verma</p>
                <p className="text-white/40 font-mono mt-0.5">📞 9810130848</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full flex flex-col sm:flex-row gap-4 mt-10 justify-center"
      >
        <Link href="/" className="w-full sm:w-1/3">
          <Button 
            variant="outline"
            className="w-full border-white/10 hover:border-white/20 bg-[#0B0B0B]/40 hover:bg-white/5 text-white/90 font-bold h-12 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Home className="size-4" />
            <span>Back To Home</span>
          </Button>
        </Link>

        <Link href={`/tournaments/${tournamentId}`} className="w-full sm:w-1/3">
          <Button 
            className="w-full bg-primary hover:bg-primary/95 text-black font-bold h-12 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(0,230,118,0.15)] transition-all duration-300"
          >
            <Eye className="size-4" />
            <span>View Tournament</span>
          </Button>
        </Link>

        <Link href="/dashboard" className="w-full sm:w-1/3">
          <Button 
            variant="outline"
            className="w-full border-white/10 hover:border-white/20 bg-[#0B0B0B]/45 hover:bg-white/5 text-white/90 font-bold h-12 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
          >
            <MessageSquare className="size-4 text-primary" />
            <span>Go To Dashboard</span>
          </Button>
        </Link>
      </motion.div>

    </div>
  )
}

export default function RegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[450px] h-[450px] rounded-full bg-[#00E676]/5 blur-[120px] pointer-events-none" />

      <PtnNavbar />

      <Suspense fallback={
        <div className="flex-grow pt-32 pb-20 flex flex-col items-center justify-center">
          <div className="text-white/40 animate-pulse text-xs font-bold uppercase tracking-widest">Loading confirmation details...</div>
        </div>
      }>
        <RegisterSuccessContent />
      </Suspense>

      <PtnFooter />
    </main>
  )
}
