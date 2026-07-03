"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  ArrowDownToLine, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  ShieldAlert, 
  DollarSign, 
  Users, 
  Check, 
  X, 
  Copy, 
  ExternalLink, 
  FileText, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Award,
  Smartphone,
  Download
} from "lucide-react"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { LogoutButton } from "@/features/auth/components/logout-button"

import { config } from "@/lib/config"
import { createClient } from "@/lib/supabase/client"
import { RegistrationRepository } from "@/lib/repositories/registration.repository"
import { TeamRepository } from "@/lib/repositories/team.repository"
import { PlayerRepository } from "@/lib/repositories/player.repository"
import { MatchRepository } from "@/lib/repositories/match.repository"
import { updateRegistrationStatusAction } from "@/features/admin/actions/admin.actions"

interface Registration {
  id: string
  rawId?: string
  type: "team" | "individual"
  name: string
  captainName: string
  phone: string
  status: "Approved" | "Pending" | "Rejected"
  paymentStatus?: "Pending" | "Verified" | "Failed"
  date: string
  city: string
  players?: string[]
  player4?: string
  preferredPosition?: string
  gameId?: string
  transactionId: string
  paymentMethod: string
  amount: number
  paymentScreenshotUrl?: string
}



export default function AdminPanelClient() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [widgetTab, setWidgetTab] = useState<"Live" | "Upcoming" | "Completed">("Live")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "team" | "individual">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "Approved" | "Pending" | "Rejected">("all")
  
  // Modals state
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [isConfirmDelete, setIsConfirmDelete] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null)

  // Trigger floating notifications
  const showToast = (text: string, type: "success" | "info" | "error" = "success") => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const supabase = createClient()
    Promise.all([
      RegistrationRepository.getRegistrations(supabase),
      TeamRepository.getTeams(supabase),
      PlayerRepository.getPlayers(supabase),
      MatchRepository.getMatches(supabase)
    ])
      .then(([regsData, teamsData, playersData, matchesData]) => {
        setMatches(matchesData || [])
        const teamMap = new Map(teamsData.map(t => [t.id, t]))
        
        const sortedPlayers = [...playersData].sort((a, b) => 
          (a.created_at || "").localeCompare(b.created_at || "")
        )

        const playersByTeam = new Map<string, string[]>()
        sortedPlayers.forEach(p => {
          if (p.team_id) {
            const list = playersByTeam.get(p.team_id) || []
            list.push(p.player_name)
            playersByTeam.set(p.team_id, list)
          }
        })

        const mapped: Registration[] = regsData.map((r) => {
          const team = r.team_id ? teamMap.get(r.team_id) : null
          const players = r.team_id ? (playersByTeam.get(r.team_id) || []) : []
          
          const isTeam = r.registration_type === "team"
          const otherPlayers = players.filter(pName => pName !== team?.captain_name)

          return {
            id: r.registration_number,
            rawId: r.id || "",
            type: r.registration_type as "team" | "individual",
            name: team?.team_name || (isTeam ? "Unnamed Team" : "Unnamed Player"),
            captainName: isTeam ? (team?.captain_name || "") : "",
            phone: team?.captain_phone || "",
            status: r.registration_status as "Approved" | "Pending" | "Rejected",
            paymentStatus: r.payment_status as "Pending" | "Verified" | "Failed",
            date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : "",
            city: team?.city || "Delhi NCR",
            players: isTeam ? otherPlayers.slice(0, 3) : [],
            player4: isTeam ? (otherPlayers[3] || "") : "",
            preferredPosition: isTeam ? "" : "Flexible",
            gameId: "",
            transactionId: r.payment_screenshot_url ? (r.payment_screenshot_url.split('/').pop() || "screenshot") : "N/A",
            paymentMethod: "UPI Payment",
            amount: isTeam ? 1800 : 600,
            paymentScreenshotUrl: r.payment_screenshot_url || ""
          }
        })
        setRegistrations(mapped)
      })
      .catch((err) => {
        console.error("Failed to load admin registrations:", err)
        showToast("Failed to load data from Supabase", "error")
        setRegistrations([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: "Approved" | "Pending" | "Rejected") => {
    const reg = registrations.find(r => r.id === id)
    const dbId = reg?.rawId || id

    let rejectionReason: string | undefined = undefined
    if (newStatus === "Rejected") {
      const val = prompt("Enter rejection reason (optional):")
      if (val === null) return
      rejectionReason = val || undefined
    }

    try {
      const result = await updateRegistrationStatusAction(dbId, newStatus, rejectionReason)
      if (!result.success) {
        throw new Error(result.error)
      }

      const supabase = createClient()
      const updated = await RegistrationRepository.getRegistrationById(supabase, dbId)
      if (updated) {
        setRegistrations(prev =>
          prev.map(r => r.id === id ? {
            ...r,
            status: updated.registration_status as "Approved" | "Pending" | "Rejected",
            paymentStatus: updated.payment_status as "Pending" | "Verified" | "Failed"
          } : r)
        )
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg(prev => prev ? {
            ...prev,
            status: updated.registration_status as "Approved" | "Pending" | "Rejected",
            paymentStatus: updated.payment_status as "Pending" | "Verified" | "Failed"
          } : null)
        }
      }
    } catch (error: any) {
      console.error("Failed to update status in database:", error)
      showToast(error.message || "Failed to update status in database", "error")
      return
    }
    showToast(`Registration ID ${id} status updated to ${newStatus}`, newStatus === "Approved" ? "success" : newStatus === "Rejected" ? "error" : "info")
  }

  const handleDeleteRegistration = async (id: string) => {
    const reg = registrations.find(r => r.id === id)
    const dbId = reg?.rawId || id

    try {
      const supabase = createClient()
      await RegistrationRepository.deleteRegistration(supabase, dbId)
    } catch (error) {
      console.error("Failed to delete registration in database:", error)
      showToast("Failed to delete record in database", "error")
      return
    }

    setRegistrations(prev => prev.filter(r => r.id !== id))
    setIsConfirmDelete(null)
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg(null)
    }
    showToast(`Registration ID ${id} deleted successfully.`, "error")
  }

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const matchesSearch = 
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.captainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = filterType === "all" ? true : reg.type === filterType
      const matchesStatus = filterStatus === "all" ? true : reg.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [registrations, searchQuery, filterType, filterStatus])

  const stats = useMemo(() => {
    const total = registrations.length
    const teams = registrations.filter(r => r.type === "team").length
    const individuals = registrations.filter(r => r.type === "individual").length
    
    const pendingVerifications = registrations.filter(r => r.status === "Pending").length
    const approvedRegistrations = registrations.filter(r => r.status === "Approved").length

    const approvedTeams = registrations.filter(r => r.type === "team" && r.status === "Approved").length
    const approvedIndividuals = registrations.filter(r => r.type === "individual" && r.status === "Approved").length
    const approvedRevenue = (approvedTeams * 1800) + (approvedIndividuals * 600)
    
    const pendingTeams = registrations.filter(r => r.type === "team" && r.status === "Pending").length
    const pendingIndividuals = registrations.filter(r => r.type === "individual" && r.status === "Pending").length
    const pendingRevenue = (pendingTeams * 1800) + (pendingIndividuals * 600)
    
    return {
      total,
      teams,
      individuals,
      pendingVerifications,
      approvedRegistrations,
      revenue: approvedRevenue,
      approvedRevenue,
      pendingRevenue
    }
  }, [registrations])

  const handleExportCSV = async () => {
    try {
      showToast("Preparing export…", "info")
      const response = await fetch("/api/admin/export-csv")
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.error || `Server responded with ${response.status}`)
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "registrations.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showToast("CSV exported successfully!", "success")
    } catch (err: any) {
      console.error("[handleExportCSV] Export failed:", err)
      showToast(err?.message || "CSV export failed. Please try again.", "error")
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 pb-20 relative">
      <PtnNavbar />

      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Play To Network OPERATING SYSTEM</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
              Tournament Admin Dashboard
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Verify payment receipts, manage participant lists, and approve registrations for Mini FIFA World Cup 2026.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-white/10 hover:border-primary/50 text-white/90 hover:text-primary transition-all duration-300 gap-2 h-10 px-4 bg-[#0B0B0B]/45 rounded-lg"
            >
              <ArrowDownToLine className="size-4" />
              <span>Export CSV</span>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#0B0B0B]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/55 font-semibold">Total Registrations</span>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="size-5" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-white mb-1">{stats.total}</div>
            <div className="text-[10px] text-white/45 flex gap-2 justify-between w-full mt-1 border-t border-white/5 pt-1.5">
              <span>Approved: <strong className="text-emerald-400 font-bold">{stats.approvedRegistrations}</strong></span>
              <span>Pending: <strong className="text-amber-400 font-bold">{stats.pendingVerifications}</strong></span>
            </div>
          </div>

          <div className="bg-[#0B0B0B]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/55 font-semibold">Total Teams</span>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="size-5" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-white mb-1">{stats.teams}</div>
            <div className="text-xs text-white/40">
              <span>₹1,800 entry fee / team</span>
            </div>
          </div>

          <div className="bg-[#0B0B0B]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/55 font-semibold">Individual Players</span>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Award className="size-5" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-white mb-1">{stats.individuals}</div>
            <div className="text-xs text-white/40">
              <span>₹600 entry fee / player</span>
            </div>
          </div>

          <div className="bg-[#0B0B0B]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/55 font-semibold">Expected Revenue</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <DollarSign className="size-5" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-emerald-400 mb-1">
              ₹{stats.revenue.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-white/45 flex flex-wrap gap-2 justify-between">
              <span>Approved: <strong className="text-white/80">₹{stats.approvedRevenue.toLocaleString("en-IN")}</strong></span>
              <span>Pending: <strong className="text-white/80">₹{stats.pendingRevenue.toLocaleString("en-IN")}</strong></span>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0B0B]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl mb-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live Match Center Widget
              </h2>
              <p className="text-xs text-white/50 mt-0.5">Quickly track active, upcoming, and completed match results.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/admin/live">
                <Button size="sm" className="bg-primary hover:bg-primary-light text-black font-extrabold rounded-lg text-xxs tracking-wider uppercase h-9 px-4">
                  Manage Live Matches
                </Button>
              </Link>
              <Link href="/admin/live">
                <Button size="sm" variant="outline" className="border-white/10 hover:border-white/20 rounded-lg text-xxs tracking-wider uppercase h-9 px-4">
                  Create Match
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            {["Live", "Upcoming", "Completed"].map((tab) => {
              const count = matches.filter(m => m.status === tab).length
              return (
                <button
                  key={tab}
                  onClick={() => setWidgetTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    widgetTab === tab 
                      ? "bg-white/10 text-white" 
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab === "Live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2 -mt-0.5 align-middle animate-pulse"></span>}
                  {tab} Matches ({count})
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.filter(m => m.status === widgetTab).length === 0 ? (
              <div className="col-span-full py-8 text-center text-white/40 text-xs font-semibold uppercase tracking-wider border border-dashed border-white/5 rounded-xl bg-black/20">
                No {widgetTab.toLowerCase()} matches found.
              </div>
            ) : (
              matches.filter(m => m.status === widgetTab).map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-white/5 bg-black/30 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider mb-2">
                    <span>{m.tournaments?.name}</span>
                    <span>{m.group_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-1">
                    <span className="font-bold text-xs text-white truncate max-w-[120px]">{m.team1?.team_name || "TBD"}</span>
                    <span className="text-xs font-black text-primary px-2.5 py-0.5 bg-white/5 rounded border border-white/5">
                      {m.team1_score} - {m.team2_score}
                    </span>
                    <span className="font-bold text-xs text-white truncate max-w-[120px] text-right">{m.team2?.team_name || "TBD"}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-white/40">
                    <span>{m.venue}</span>
                    <span>{m.status === "Live" ? `Minute: ${m.minute}'` : m.kickoff_time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0B0B0B]/50 backdrop-blur-xl border border-white/5 p-5 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search by ID, team, or captain..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full bg-black/40 border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider hidden sm:inline">Type:</span>
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 w-full sm:w-auto">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    filterType === "all" ? "bg-primary text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("team")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    filterType === "team" ? "bg-primary text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setFilterType("individual")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    filterType === "individual" ? "bg-primary text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  Solo
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider hidden sm:inline">Status:</span>
              <div className="relative w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  className="w-full sm:w-auto bg-black/45 border border-white/10 text-white rounded-lg h-9 px-3 py-1 text-xs font-bold focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="all">All Payments</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0B0B]/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <span className="text-white/40 text-sm font-semibold animate-pulse">Loading registrations...</span>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <AlertCircle className="size-12 text-white/20 mb-4" />
              <h3 className="text-lg font-bold text-white">No registrations found</h3>
              <p className="text-sm text-white/40 mt-1 max-w-sm">
                Try modifying your query or filters to search through the participant records.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40">Reg ID / Date</th>
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40">Type</th>
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40">Participant / Team Name</th>
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40">Captain / Roster</th>
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40">Contact Info</th>
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40 text-center">Status</th>
                    <th className="py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.map((reg) => (
                    <tr 
                      key={reg.id}
                      className="hover:bg-white/[0.01] transition-all group"
                    >
                      <td className="py-4.5 px-6">
                        <div className="font-mono text-xs font-semibold text-white/90">{reg.id}</div>
                        <div className="text-xxs text-white/40 flex items-center gap-1 mt-1 font-bold uppercase tracking-wider">
                          <Calendar className="size-3" />
                          <span>{reg.date}</span>
                        </div>
                      </td>

                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xxs font-extrabold tracking-wider uppercase ${
                          reg.type === "team" 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}>
                          {reg.type === "team" ? "Team" : "Solo"}
                        </span>
                      </td>

                      <td className="py-4.5 px-6 font-bold text-white group-hover:text-primary transition-colors">
                        {reg.name}
                      </td>

                      <td className="py-4.5 px-6">
                        {reg.type === "team" ? (
                          <div>
                            <span className="text-xs text-white/80 font-semibold">{reg.captainName}</span>
                            <span className="text-xxs text-white/45 ml-1.5 font-bold uppercase tracking-wide bg-white/5 px-1 py-0.5 rounded">Cap</span>
                            <div className="text-xxs text-white/40 mt-1 max-w-[200px] truncate">
                              {reg.players?.join(", ")}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-white/80 font-semibold">{reg.preferredPosition || "Unspecified"}</span>
                            <div className="text-xxs font-mono text-white/40 mt-1">IGN: {reg.gameId || "N/A"}</div>
                          </div>
                        )}
                      </td>

                      <td className="py-4.5 px-6 text-xs text-white/70">
                        <div>{reg.phone}</div>
                      </td>

                      <td className="py-4.5 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xxs font-extrabold uppercase tracking-widest ${
                          reg.status === "Approved" 
                            ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                            : reg.status === "Pending"
                            ? "bg-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                            : "bg-red-500/15 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            reg.status === "Approved" ? "bg-emerald-400 animate-pulse" : reg.status === "Pending" ? "bg-amber-400 animate-pulse" : "bg-red-400"
                          }`} />
                          {reg.status === "Pending" ? "Submitted" : reg.status === "Rejected" ? "Action Required" : reg.status}
                        </span>
                      </td>

                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            title="View Details & Receipt"
                            className="p-1.5 bg-[#0B0B0B] border border-white/5 rounded-lg text-white/70 hover:text-white hover:border-white/20 transition-all"
                          >
                            <Eye className="size-4" />
                          </button>

                          {reg.status !== "Approved" && (
                            <button
                              onClick={() => handleUpdateStatus(reg.id, "Approved")}
                              title="Approve Registration"
                              className="p-1.5 bg-[#0B0B0B] border border-emerald-500/10 rounded-lg text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                            >
                              <Check className="size-4" />
                            </button>
                          )}

                          {reg.status !== "Rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(reg.id, "Rejected")}
                              title="Reject Registration"
                              className="p-1.5 bg-[#0B0B0B] border border-red-500/10 rounded-lg text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                            >
                              <X className="size-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setIsConfirmDelete(reg.id)}
                            title="Delete Record"
                            className="p-1.5 bg-[#0B0B0B] border border-white/5 rounded-lg text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-[#0B0B0B] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-3xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/5 p-6 sticky top-0 bg-[#0B0B0B] z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-extrabold tracking-wider uppercase ${
                    selectedReg.type === "team" ? "bg-primary/20 text-primary" : "bg-cyan-500/20 text-cyan-400"
                  }`}>
                    {selectedReg.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-white/40 font-mono">{selectedReg.id}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedReg.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedReg(null)}
                className="p-2 bg-white/5 border border-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-3">Participant Details</h4>
                  <div className="bg-black/35 p-4 rounded-xl border border-white/5 divide-y divide-white/5 text-sm">
                    {selectedReg.type === "team" ? (
                      <>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-white/40">Captain Name</span>
                          <span className="font-bold text-white">{selectedReg.captainName}</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-white/40">Team Name</span>
                          <span className="font-bold text-white">{selectedReg.name}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-white/40">Full Name</span>
                          <span className="font-bold text-white">{selectedReg.name}</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-white/40">Preferred Position</span>
                          <span className="font-bold text-white">{selectedReg.preferredPosition || "Not Specified"}</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-white/40">In-Game Nickname (IGN)</span>
                          <span className="font-bold font-mono text-white text-xs">{selectedReg.gameId || "N/A"}</span>
                        </div>
                      </>
                    )}
                    <div className="py-2.5 flex justify-between">
                      <span className="text-white/40">Contact Phone</span>
                      <span className="font-semibold text-white">{selectedReg.phone}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-white/40">City</span>
                      <span className="font-semibold text-white">{selectedReg.city}</span>
                    </div>
                  </div>
                </div>

                {selectedReg.type === "team" && (
                  <div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-3">Squad Roster</h4>
                    <div className="bg-black/35 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                      {selectedReg.players?.map((player, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-1">
                          <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xxs font-bold text-primary">
                            P{idx + 1}
                          </div>
                          <span className="text-sm font-semibold text-white/95">{player}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-1">
                        <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xxs font-bold text-primary">
                          P4
                        </div>
                        <span className="text-sm font-semibold text-white/95">
                          {selectedReg.player4}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-3">Verification Actions</h4>
                  <div className="flex gap-3">
                    {selectedReg.status !== "Approved" && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedReg.id, "Approved")}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black h-11 font-bold rounded-xl gap-2 transition-all"
                      >
                        <CheckCircle2 className="size-5" />
                        <span>Approve Payment</span>
                      </Button>
                    )}
                    {selectedReg.status !== "Rejected" && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedReg.id, "Rejected")}
                        variant="destructive"
                        className="flex-1 h-11 font-bold rounded-xl gap-2 transition-all border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500"
                      >
                        <XCircle className="size-5" />
                        <span>Reject Entry</span>
                      </Button>
                    )}
                  </div>
                </div>

              </div>

              <div className="lg:col-span-6 flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary">UPI Payment Screenshot</h4>
                    <span className="text-xxs text-white/40 flex items-center gap-1">
                      <Smartphone className="size-3" />
                      <span>PhonePe / GPay Interface</span>
                    </span>
                  </div>

                  <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] bg-[#0E0F14] border-4 border-[#1E202B] rounded-[36px] overflow-hidden shadow-2xl p-4 flex flex-col gap-4">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1E202B] rounded-full z-10" />

                    <div className="flex flex-col items-center justify-center pt-6 text-center">
                      <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 mt-2">
                        <Check className="size-6 stroke-[3px]" />
                      </div>
                      <div className="text-emerald-400 font-extrabold text-sm uppercase tracking-wide">Transaction Successful</div>
                      <div className="text-white/40 text-xxs mt-0.5">{selectedReg.date} • 14:32:09</div>
                    </div>

                    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <span className="text-white/40 text-xxs uppercase tracking-wider font-semibold">Amount Received</span>
                      <div className="text-2xl font-black text-white mt-1">₹{selectedReg.amount}.00</div>
                      <span className="text-xxs text-primary font-bold mt-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        {selectedReg.paymentMethod}
                      </span>
                    </div>

                    <div className="bg-black/25 rounded-2xl p-4.5 border border-white/5 flex flex-col gap-3.5 text-xs">
                      <div>
                        <div className="text-white/40 text-xxs font-bold uppercase tracking-wider">UPI Transaction ID</div>
                        <div className="text-white font-mono font-medium flex items-center justify-between mt-1 text-xxs">
                          <span>{selectedReg.transactionId}</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedReg.transactionId)
                              showToast("Transaction ID copied to clipboard", "info")
                            }}
                            className="text-primary hover:text-white transition-colors"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-white/40 text-xxs font-bold uppercase tracking-wider">Debit Bank</div>
                          <div className="text-white/90 font-semibold mt-1">HDFC Bank</div>
                        </div>
                        <div>
                          <div className="text-white/40 text-xxs font-bold uppercase tracking-wider">UPI Ref Number</div>
                          <div className="text-white/90 font-mono mt-1 text-xxs">929402948293</div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3.5">
                        <div className="text-white/40 text-xxs font-bold uppercase tracking-wider">Paid To</div>
                        <div className="text-white font-semibold mt-1 flex items-center justify-between">
                          <span>PLAY TO NETWORK OS</span>
                          <span className="text-xxs text-primary font-bold">verified@ptn</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={selectedReg.paymentScreenshotUrl || "/receipt.png"}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/20 transition-all text-center"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>View Payment Proof</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0B0B0B] border border-red-500/20 rounded-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4">
              <ShieldAlert className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
            <p className="text-sm text-white/50 mt-2">
              Are you sure you want to permanently delete registration record <strong className="text-white font-mono">{isConfirmDelete}</strong>? This action will remove all team and payment roster data.
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setIsConfirmDelete(null)}
                variant="outline"
                className="flex-1 rounded-xl h-10 border-white/10 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteRegistration(isConfirmDelete)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-black font-bold h-10 rounded-xl"
              >
                Delete Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0B0B0B] border border-white/10 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className={`p-1.5 rounded-lg ${
            toastMessage.type === "success" 
              ? "bg-emerald-500/10 text-emerald-400" 
              : toastMessage.type === "error"
              ? "bg-red-500/10 text-red-400"
              : "bg-primary/10 text-primary"
          }`}>
            {toastMessage.type === "success" ? (
              <Check className="size-4" />
            ) : toastMessage.type === "error" ? (
              <X className="size-4" />
            ) : (
              <AlertCircle className="size-4" />
            )}
          </div>
          <span className="text-sm font-semibold text-white/95">{toastMessage.text}</span>
        </div>
      )}

      <PtnFooter />
    </main>
  )
}
