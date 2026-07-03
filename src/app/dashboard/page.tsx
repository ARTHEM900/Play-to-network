"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Activity, 
  Calendar, 
  Clock, 
  Bell, 
  ChevronRight, 
  Plus, 
  Shield, 
  ArrowRight, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  X
} from "lucide-react"
import { Skeleton, SkeletonCard } from "@/shared/components/skeleton"

import { createClient } from "@/lib/supabase/client"
import { ProfileRepository } from "@/lib/repositories/profile.repository"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

// Type Definitions
interface Team {
  id: string
  name: string
  logoInitial: string
  gradient: string
  isCaptain: boolean
  currentTournament: string
}

interface Match {
  id: string
  team1: string
  team2: string
  date: string
  time: string
  tournament: string
  status: "Upcoming" | "Live" | "Completed"
}

interface Tournament {
  id: string
  name: string
  sport: string
  status: "Active" | "Completed"
  progress: number
  resultSummary: string
  nextMatchDate?: string
}

interface PtnNotification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

interface UserProfile {
  name: string
  email: string
  rank: string
  memberSince: string
}

const DashboardPage = memo(function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  
  // Auth state - starts null until Supabase session loads
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  
  // Dashboard state
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [notifications, setNotifications] = useState<PtnNotification[]>([])

  // Modals & Interactivity State
  const [activeTab, setActiveTab] = useState<"Active" | "Completed">("Active")
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showRegisterTeam, setShowRegisterTeam] = useState(false)
  const [showStandings, setShowStandings] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Forms State
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamCaptain, setNewTeamCaptain] = useState(true)
  const [newTeamTourney, setNewTeamTourney] = useState("None")
  
  const [regSelectedTeam, setRegSelectedTeam] = useState(teams[0]?.id || "")
  const [regSelectedTourney, setRegSelectedTourney] = useState("Delhi Esports League")

  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [isRegisteringTeam, setIsRegisteringTeam] = useState(false)

  interface DashboardRegistration {
    id: string
    registrationNumber: string
    type: string
    paymentStatus: string
    status: string
    tournamentName: string
    teamName?: string
    preferredNation?: string | null
    createdAt: string
  }

  const [registrationsList, setRegistrationsList] = useState<DashboardRegistration[]>([])

  // Load actual Supabase session if available
  useEffect(() => {
    async function loadUser() {
      setLoadingDashboard(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        try {
          const userId = session.user.id

          // Parallel: profile + teams + registrations (all depend only on user_id)
          const [profileData, { data: teamsData }, regsResult] = await Promise.all([
            ProfileRepository.getProfileById(supabase, userId),
            supabase.from('teams').select('*').eq('user_id', userId),
            supabase
              .from('registrations')
              .select(`
                id,
                registration_number,
                registration_type,
                payment_status,
                registration_status,
                created_at,
                teams (
                  team_name
                ),
                tournaments (
                  id,
                  name,
                  sport,
                  status,
                  start_date
                )
              `)
              .eq('user_id', userId)
          ])

          setProfile({
            name: profileData?.full_name || session.user.email?.split("@")[0] || '',
            email: session.user.email || '',
            rank: profileData?.city ? `Elite (${profileData.city})` : '',
            memberSince: profileData?.created_at
              ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : ''
          })

          const regsData = regsResult.data

          if (regsData) {
            setRegistrationsList(regsData.map((r: any) => {
              const tName = r.teams?.team_name || ''
              const match = tName.match(/\(([^)]+)\)/)
              const preferredNation = match ? match[1].trim() : null

              let displayStatus = r.registration_status
              if (r.registration_status === 'Pending') {
                displayStatus = 'Submitted'
              } else if (r.registration_status === 'Rejected') {
                displayStatus = 'Action Required'
              }

              let displayPaymentStatus = r.payment_status
              if (r.payment_status === 'Pending') {
                displayPaymentStatus = 'Pending Verification'
              } else if (r.payment_status === 'Failed') {
                displayPaymentStatus = 'Rejected'
              }

              return {
                id: r.id,
                registrationNumber: r.registration_number,
                type: r.registration_type,
                paymentStatus: displayPaymentStatus,
                status: displayStatus,
                tournamentName: r.tournaments?.name || '',
                teamName: r.teams?.team_name || '',
                preferredNation,
                createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ''
              }
            }))

            // Populate tournaments
            const uniqueTourneys = Array.from(new Map(
              regsData.map((r: any) => r.tournaments).filter(Boolean).map((t: any) => [t.id, t])
            ).values())

            setTournaments(uniqueTourneys.map((t: any) => ({
              id: t.id,
              name: t.name,
              sport: t.sport,
              status: t.status === "Registration Open" ? "Active" : "Completed",
              progress: t.status === "Registration Open" ? 10 : 100,
              resultSummary: "Registered",
              nextMatchDate: t.start_date
            })))
          }

          if (teamsData && teamsData.length > 0) {
            setTeams(teamsData.map((t: any) => ({
              id: t.id,
              name: t.team_name,
              logoInitial: (t.team_name || 'T').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "T",
              gradient: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
              isCaptain: true,
              currentTournament: "Mini FIFA"
            })))

            const teamNames = teamsData.map((t: any) => t.team_name).filter(Boolean)

            // Fetch matches in parallel with other processing
            const { data: allMatches } = await supabase
              .from('matches')
              .select('*, tournaments(name)')

            if (allMatches) {
              const filteredMatches = allMatches.filter((m: any) =>
                teamNames.includes(m.team1_name) || teamNames.includes(m.team2_name)
              )
              setMatches(filteredMatches.map((m: any) => ({
                id: m.id,
                team1: m.team1_name || "TBD",
                team2: m.team2_name || "TBD",
                date: m.match_date || "",
                time: m.match_time || "",
                tournament: m.tournaments?.name || m.tournament_name || "",
                status: (m.status as "Live" | "Upcoming" | "Completed") || "Upcoming"
              })))
            }
          }
        } catch (error) {
          console.error("Error loading profile or registrations from repository:", error)
        }
      } else {
        router.push("/login")
        return
      }
      setLoadingDashboard(false)
    }
    loadUser()
  }, [supabase])

  // Helper to trigger floating toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle Team Creation
  const handleCreateTeamSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim() || isCreatingTeam) return

    setIsCreatingTeam(true)

    const gradients = [
      "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
      "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
      "from-red-500/20 to-rose-500/20 border-red-500/30"
    ]
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]

    const newTeam: Team = {
      id: `t_${Date.now()}`,
      name: newTeamName,
      logoInitial: newTeamName.substring(0, 2).toUpperCase(),
      gradient: randomGradient,
      isCaptain: newTeamCaptain,
      currentTournament: newTeamTourney
    }

    setTeams(prev => [newTeam, ...prev])
    
    // If registered to a tournament during creation, reflect it in tournaments
    if (newTeamTourney !== "None") {
      setTournaments(prev => {
        const tourneyExists = prev.find(t => t.name === newTeamTourney)
        if (!tourneyExists) {
          return [
            {
              id: `tr_${Date.now()}`,
              name: newTeamTourney,
              sport: "Football",
              status: "Active",
              progress: 10,
              resultSummary: "Registered"
            },
            ...prev
          ]
        }
        return prev
      })
    }

    // Add notification
    const newNotification: PtnNotification = {
      id: `n_${Date.now()}`,
      title: "Team Created Successfully",
      message: `You created team ${newTeamName} as ${newTeamCaptain ? "Captain" : "Member"}.`,
      time: "Just now",
      unread: true
    }
    setNotifications(prev => [newNotification, ...prev])

    setShowCreateTeam(false)
    setNewTeamName("")
    setNewTeamCaptain(true)
    setNewTeamTourney("None")
    setIsCreatingTeam(false)
    triggerToast(`Team "${newTeamName}" created successfully!`)
  }, [newTeamName, newTeamCaptain, newTeamTourney, isCreatingTeam])

  // Handle Team Registration
  const handleRegisterTeamSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (isRegisteringTeam) return
    const targetTeam = teams.find(t => t.id === regSelectedTeam)
    if (!targetTeam) return

    setIsRegisteringTeam(true)

    // Update team tournament status
    setTeams(prev => prev.map(t => {
      if (t.id === regSelectedTeam) {
        return { ...t, currentTournament: regSelectedTourney }
      }
      return t
    }))

    // Add tournament to active list
    setTournaments(prev => {
      const tourneyExists = prev.find(t => t.name === regSelectedTourney)
      if (!tourneyExists) {
        return [
          {
            id: `tr_${Date.now()}`,
            name: regSelectedTourney,
            sport: "Esports",
            status: "Active",
            progress: 5,
            resultSummary: "Awaiting Group Allocation"
          },
          ...prev
        ]
      }
      return prev
    })

    // Add notification
    const newNotification: PtnNotification = {
      id: `n_${Date.now()}`,
      title: "Tournament Registered",
      message: `Team ${targetTeam.name} has registered for ${regSelectedTourney}.`,
      time: "Just now",
      unread: true
    }
    setNotifications(prev => [newNotification, ...prev])

    setShowRegisterTeam(false)
    setIsRegisteringTeam(false)
    triggerToast(`Successfully registered ${targetTeam.name} for ${regSelectedTourney}!`)
  }, [teams, regSelectedTeam, regSelectedTourney, isRegisteringTeam])

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
    triggerToast("All notifications marked as read.")
  }

  // Single notification toggle
  const toggleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => {
      if (n.id === id) return { ...n, unread: !n.unread }
      return n
    }))
  }

  if (loadingDashboard) {
    return (
      <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
        <PtnNavbar />
        <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 space-y-8">
          <div className="flex items-center gap-5 p-6 rounded-2xl border border-white/5 bg-[#0A0A0A]/40">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <PtnFooter />
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
        <PtnNavbar />
        <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wide mb-2">Could not load profile</h2>
          <p className="text-white/50 text-sm">Please try logging in again.</p>
        </div>
        <PtnFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
      {/* Visual background lights */}
      <div className="absolute top-[-100px] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[400px] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00E676]/5 blur-[150px] pointer-events-none"></div>

      <PtnNavbar />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A0A0A] border border-primary text-white px-5 py-4 rounded-xl shadow-[0_0_30px_rgba(0,230,118,0.25)] backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">

        {/* 1. Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-5">
            {/* Player Avatar with dynamic gradient */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-emerald-600 p-0.5 shadow-[0_0_20px_rgba(0,230,118,0.2)]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center font-heading font-black text-xl text-primary">
                {(profile.name || profile.email || 'U').substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-wide text-white uppercase">{profile.name || 'Player'}</h1>
                {profile.rank && (
                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary tracking-widest uppercase">
                  {profile.rank}
                </span>
                )}
              </div>
              <p className="text-sm text-white/50 mt-1">Play To Network Competitive Player{profile.memberSince ? ` • Member since ${profile.memberSince}` : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-left md:text-right">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Status</span>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Ready for Matches
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Teams Joined",
              value: teams.length,
              icon: Users,
              desc: "Across all sports",
              color: "text-primary hover:border-primary/30"
            },
            {
              title: "Upcoming Matches",
              value: matches.length,
              icon: Calendar,
              desc: "Next: June 23",
              color: "text-blue-400 hover:border-blue-400/30"
            },
            {
              title: "Active Tournaments",
              value: tournaments.filter(t => t.status === "Active").length,
              icon: Trophy,
              desc: "1 Completed",
              color: "text-purple-400 hover:border-purple-400/30"
            },
            {
              title: "Current Ranking",
              value: "#18",
              icon: Target,
              desc: "Top 5% in Delhi NCR",
              color: "text-yellow-400 hover:border-yellow-400/30"
            }
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              key={stat.title}
              className={`p-5 rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md transition-all duration-300 group flex flex-col justify-between min-h-[120px] ${stat.color}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{stat.title}</span>
                <stat.icon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-heading font-black text-white tracking-tight drop-shadow-md">{stat.value}</span>
                <span className="text-[10px] text-white/40 block mt-1">{stat.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT & CENTER PANEL: Teams and Tournaments */}
          <div className="lg:col-span-2 space-y-8">

            {/* My Tournament Registrations Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase">My Registrations</h2>
              </div>

              {registrationsList.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl bg-[#0A0A0A]/20">
                  <Trophy className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white/60 uppercase tracking-wide mb-1">No Registrations Yet</h3>
                  <p className="text-sm text-white/40 max-w-md mx-auto mb-5">
                    You haven't registered for any tournaments yet. Browse upcoming events and join the competition.
                  </p>
                  <Link href="/register" prefetch={true}>
                    <Button className="bg-primary text-black font-bold hover:bg-primary/90 rounded-lg text-xs uppercase tracking-wider">
                      Register for a Tournament
                    </Button>
                  </Link>
                </div>
              ) : (
              <div className="grid grid-cols-1 gap-4">
                  {registrationsList.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-5 rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-white/10 hover:bg-[#0A0A0A]/60 transition-all duration-300"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white">{reg.tournamentName}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                            reg.type === "team" 
                              ? "bg-primary/10 border border-primary/20 text-primary" 
                              : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                          }`}>
                            {reg.type === "team" ? "Team" : "Solo"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-white/50">
                          <div>Reg ID: <strong className="text-white/70 font-mono">{reg.registrationNumber}</strong></div>
                          <div>Team Name: <strong className="text-white/70">{reg.teamName || '—'}</strong></div>
                          <div>Last Updated: <strong className="text-white/70">{reg.createdAt}</strong></div>
                          {reg.type === "team" && reg.preferredNation && (
                            <div>Preferred Nation: <strong className="text-primary uppercase">{reg.preferredNation}</strong></div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {/* Registration Status */}
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-1">Registration Status</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            reg.status === "Approved" 
                              ? "bg-emerald-500/15 text-emerald-400" 
                              : reg.status === "Submitted" || reg.status === "Pending"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-red-500/15 text-red-400"
                          }`}>
                            {reg.status}
                          </span>
                        </div>

                        {/* Payment Status */}
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-1">Payment Status</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            reg.paymentStatus === "Verified" 
                              ? "bg-emerald-500/15 text-emerald-400" 
                              : reg.paymentStatus === "Pending Verification" || reg.paymentStatus === "Pending"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-red-500/15 text-red-400"
                          }`}>
                            {reg.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* 3. My Teams Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase">My Teams</h2>
                </div>
                <Button 
                  onClick={() => setShowCreateTeam(true)}
                  size="sm" 
                  className="bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/30 text-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 h-8 px-3"
                >
                  <Plus className="w-4 h-4" /> Create Team
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="p-5 rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md hover:border-white/10 hover:bg-[#0A0A0A]/60 transition-all duration-300 group flex flex-col"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {/* Logo Initial box */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${team.gradient} border flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <span className="text-base font-heading font-black text-white">{team.logoInitial}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-base font-bold text-white truncate group-hover:text-primary transition-colors">{team.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest select-none ${
                            team.isCaptain 
                              ? "bg-primary/10 border border-primary/20 text-primary" 
                              : "bg-white/5 border border-white/10 text-white/40"
                          }`}>
                            {team.isCaptain ? "Captain" : "Member"}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-white/30 shrink-0" />
                          <span className="truncate">{team.currentTournament !== "None" ? team.currentTournament : "Not Registered"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
                      <span>Roster size: 11 active</span>
                      {team.currentTournament === "None" ? (
                        <button 
                          onClick={() => {
                            setRegSelectedTeam(team.id)
                            setShowRegisterTeam(true)
                          }}
                          className="text-primary font-bold hover:underline uppercase tracking-wider"
                        >
                          Register Team
                        </button>
                      ) : (
                        <span className="text-primary font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-primary" /> Registered
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. My Tournaments Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase">My Tournaments</h2>
                </div>
                
                {/* Tabs */}
                <div className="flex rounded-lg bg-black/40 border border-white/5 p-0.5">
                  {(["Active", "Completed"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                        activeTab === tab 
                          ? "bg-primary text-black" 
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {tournaments.filter(t => t.status === activeTab).map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">{t.name}</h4>
                        <span className="px-2 py-0.5 rounded border border-white/10 text-[9px] uppercase font-bold tracking-widest text-white/50">
                          {t.sport}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>Record: {t.resultSummary}</span>
                        {t.nextMatchDate && (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                            <span>Next Match: {t.nextMatchDate}</span>
                          </>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full max-w-md pt-2">
                        <div className="flex justify-between items-center text-[10px] text-white/40 mb-1.5">
                          <span>Tournament Progress</span>
                          <span>{t.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/50 border border-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${t.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <Link href={`/tournaments/${t.id}`} prefetch={true}>
                        <Button 
                          variant="outline" 
                          className="border-white/10 bg-black/20 hover:bg-black/60 hover:border-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-widest h-10 px-4 group"
                        >
                          Details <ChevronRight className="ml-1.5 w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}

                {tournaments.filter(t => t.status === activeTab).length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-white/40">
                    No {activeTab.toLowerCase()} tournaments found.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT PANEL: Upcoming Matches, Notifications, Quick Actions */}
          <div className="space-y-8">
            
            {/* 7. Quick Actions */}
            <section className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Command Center
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRegisterTeam(true)}
                  className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]/40 hover:bg-[#0A0A0A]/60 hover:border-primary/30 transition-all text-left flex flex-col justify-between min-h-[96px] group cursor-pointer"
                >
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-primary mt-2">Register Team</span>
                </button>

                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]/40 hover:bg-[#0A0A0A]/60 hover:border-primary/30 transition-all text-left flex flex-col justify-between min-h-[96px] group cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-primary" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-primary mt-2">Create Team</span>
                </button>

                <Link href="/events" prefetch={true} className="w-full block">
                  <div className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]/40 hover:bg-[#0A0A0A]/60 hover:border-primary/30 transition-all text-left flex flex-col justify-between min-h-[96px] group cursor-pointer h-full">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-primary mt-2">Browse Events</span>
                  </div>
                </Link>

                <button
                  onClick={() => setShowStandings(true)}
                  className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]/40 hover:bg-[#0A0A0A]/60 hover:border-primary/30 transition-all text-left flex flex-col justify-between min-h-[96px] group cursor-pointer"
                >
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-primary mt-2">View Standings</span>
                </button>
              </div>
            </section>

            {/* 4. Upcoming Matches */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase">Upcoming Matches</h2>
                </div>
              </div>

              <div className="space-y-3">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md flex flex-col hover:border-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center text-[10px] text-white/40 mb-2 pb-2 border-b border-white/5">
                      <span className="truncate max-w-[150px]">{m.tournament}</span>
                      <span className="text-primary font-bold">{m.time}</span>
                    </div>

                    <div className="flex justify-between items-center px-1">
                      <span className="font-semibold text-sm text-white">{m.team1}</span>
                      <span className="text-xs text-white/30 font-heading tracking-widest font-black uppercase mx-2">VS</span>
                      <span className="font-semibold text-sm text-white/80">{m.team2}</span>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[9px] text-white/40">
                      <span>{m.date}</span>
                      <Link href={`/matches/${m.id}`} prefetch={true} className="text-primary font-bold hover:underline flex items-center gap-0.5">
                        Match Center <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Notifications Panel */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading font-bold text-white tracking-wide uppercase">Announcements</h2>
                </div>
                {notifications.some(n => n.unread) && (
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-primary/80 hover:text-primary font-bold uppercase tracking-wider"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md p-4 space-y-4 max-h-[300px] overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => toggleNotificationRead(n.id)}
                    className="group cursor-pointer relative pl-3.5 border-l border-white/5 hover:border-primary/40 transition-colors"
                  >
                    {n.unread && (
                      <span className="absolute left-[-4px] top-[5px] w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,230,118,0.8)]"></span>
                    )}
                    <div className="flex justify-between items-start">
                      <h5 className={`text-xs font-bold uppercase tracking-wide group-hover:text-primary transition-colors ${n.unread ? "text-white" : "text-white/60"}`}>
                        {n.title}
                      </h5>
                      <span className="text-[9px] text-white/30 shrink-0 ml-2">{n.time}</span>
                    </div>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center text-xs text-white/30 py-4">No recent announcements.</div>
                )}
              </div>
            </section>

          </div>
          </div>
      </div>

      <PtnFooter />

      {/* ---------------------------------------------------- */}
      {/* MODAL: Create Team */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showCreateTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateTeam(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <button 
                onClick={() => setShowCreateTeam(false)}
                className="absolute top-4 right-4 p-1 rounded-lg border border-white/5 text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" /> Create New Team
                </h3>
                <p className="text-xs text-white/40 mt-1">Assemble your squad and start managing registrations.</p>
              </div>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input 
                    id="team-name" 
                    placeholder="Enter team name (e.g. Delhi Vipers)" 
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-tourney">Select Tournament (Optional)</Label>
                  <select 
                    id="team-tourney"
                    value={newTeamTourney}
                    onChange={(e) => setNewTeamTourney(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="None">None</option>
                    <option value="Delhi Champions Cup 2026">Delhi Champions Cup 2026</option>
                    <option value="Delhi Futsal Arena">Delhi Futsal Arena</option>
                    <option value="NCR Summer League">NCR Summer League</option>
                    <option value="Delhi Esports League">Delhi Esports League</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input 
                    type="checkbox" 
                    id="team-captain" 
                    checked={newTeamCaptain}
                    onChange={(e) => setNewTeamCaptain(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded border-white/10 bg-black"
                  />
                  <Label htmlFor="team-captain" className="cursor-pointer text-white/80 normal-case tracking-normal">
                    I am the Captain of this squad
                  </Label>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateTeam(false)}
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreatingTeam}
                    className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold disabled:opacity-50"
                  >
                    {isCreatingTeam ? "Creating..." : "Create Squad"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Register Team */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showRegisterTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRegisterTeam(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <button 
                onClick={() => setShowRegisterTeam(false)}
                className="absolute top-4 right-4 p-1 rounded-lg border border-white/5 text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" /> Register for Tournament
                </h3>
                <p className="text-xs text-white/40 mt-1">Enroll your squad into an active Play To Network competitive league.</p>
              </div>

              <form onSubmit={handleRegisterTeamSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-team">Select Squad</Label>
                  <select 
                    id="reg-team"
                    value={regSelectedTeam}
                    onChange={(e) => setRegSelectedTeam(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.isCaptain ? "Captain" : "Member"})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-tourney">Select Tournament</Label>
                  <select 
                    id="reg-tourney"
                    value={regSelectedTourney}
                    onChange={(e) => setRegSelectedTourney(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="Delhi Esports League">Delhi Esports League (FIFA 26)</option>
                    <option value="Winter Futsal Cup">Winter Futsal Cup 2026</option>
                    <option value="Delhi Champions Cup 2026">Delhi Champions Cup 2026</option>
                    <option value="Delhi Basketball Slam">Delhi Basketball Slam</option>
                  </select>
                </div>

                <div className="p-3 bg-primary/5 border border-primary/15 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/60 leading-normal">
                    By registering, you confirm your squad meets the tournament age and roster size criteria. Changes can be made before rosters lock.
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowRegisterTeam(false)}
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isRegisteringTeam}
                    className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold disabled:opacity-50"
                  >
                    {isRegisteringTeam ? "Registering..." : "Confirm Entry"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: View Standings */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showStandings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStandings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <button 
                onClick={() => setShowStandings(false)}
                className="absolute top-4 right-4 p-1 rounded-lg border border-white/5 text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Group Standings Preview
                </h3>
                <p className="text-xs text-white/40 mt-1">Delhi Champions Cup 2026 - Group A Leaderboard</p>
              </div>

              {/* Standing Table */}
              <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-white/40 tracking-wider">
                      <th className="py-3 px-4">Pos</th>
                      <th className="py-3 px-4">Squad</th>
                      <th className="py-3 px-4 text-center">P</th>
                      <th className="py-3 px-4 text-center">W</th>
                      <th className="py-3 px-4 text-center">D</th>
                      <th className="py-3 px-4 text-center">L</th>
                      <th className="py-3 px-4 text-center font-bold text-white">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { pos: 1, name: "FC Titans", p: 3, w: 2, d: 1, l: 0, pts: 7, active: true },
                      { pos: 2, name: "Warriors", p: 3, w: 2, d: 0, l: 1, pts: 6 },
                      { pos: 3, name: "Storm FC", p: 3, w: 1, d: 0, l: 2, pts: 3 },
                      { pos: 4, name: "Red Dragons", p: 3, w: 0, d: 1, l: 2, pts: 1 }
                    ].map((row) => (
                      <tr 
                        key={row.pos} 
                        className={`border-b border-white/5 text-xs transition-colors hover:bg-white/5 ${
                          row.active ? "bg-primary/5 text-white" : "text-white/70"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold">{row.pos}</td>
                        <td className="py-3 px-4 font-medium flex items-center gap-2">
                          {row.active && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-center">{row.p}</td>
                        <td className="py-3 px-4 text-center">{row.w}</td>
                        <td className="py-3 px-4 text-center">{row.d}</td>
                        <td className="py-3 px-4 text-center">{row.l}</td>
                        <td className="py-3 px-4 text-center font-heading font-black text-sm text-primary">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setShowStandings(false)}
                  className="bg-primary text-black hover:bg-primary/90 font-bold px-6"
                >
                  Close Standings
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
})

DashboardPage.displayName = "DashboardPage"

export default DashboardPage
