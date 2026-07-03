"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, Radio, Calendar, MapPin, Clock, Plus, Trash2, Edit2, Check, X, 
  ArrowLeft, RefreshCw, Play, Pause, Square, PlusCircle, MinusCircle, Save
} from "lucide-react"
import Link from "next/link"
import { PtnNavbar } from "@/shared/components/ptn-navbar"
import { PtnFooter } from "@/shared/components/ptn-footer"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { MatchRepository } from "@/lib/repositories/match.repository"
import { TeamRepository } from "@/lib/repositories/team.repository"
import { TournamentRepository } from "@/lib/repositories/tournament.repository"
import { 
  createLiveMatchAction, 
  updateLiveMatchAction, 
  deleteLiveMatchAction,
  updateLiveMatchScoreAction,
  changeLiveMatchStatusAction
} from "@/features/admin/actions/live-match.actions"

export default function AdminLiveCenter() {
  const [matches, setMatches] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modals / forms state
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  // Form fields
  const [formData, setFormData] = useState({
    tournament_id: "",
    team1_id: "",
    team2_id: "",
    team1_score: 0,
    team2_score: 0,
    status: "Upcoming",
    minute: 0,
    kickoff_time: "18:00",
    venue: "JLN Stadium Court A",
    group_name: "Group A"
  })

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null)

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const supabase = createClient()

  const refreshData = async () => {
    try {
      const [matchesList, teamsList, tournamentsList] = await Promise.all([
        MatchRepository.getMatches(supabase),
        TeamRepository.getTeams(supabase),
        TournamentRepository.getTournaments(supabase)
      ])
      setMatches(matchesList || [])
      setTeams(teamsList || [])
      setTournaments(tournamentsList || [])
      
      // Update selected match if it is active
      if (selectedMatch) {
        const current = (matchesList || []).find(m => m.id === selectedMatch.id)
        if (current) {
          setSelectedMatch(current)
        }
      }
    } catch (err) {
      console.error(err)
      showToast("Failed to refresh live center data", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 15000)
    return () => clearInterval(interval)
  }, [selectedMatch?.id])

  // Handle Match Creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tournament_id || !formData.team1_id || !formData.team2_id) {
      showToast("Please fill in all team and tournament selections.", "error")
      return
    }

    const res = await createLiveMatchAction(formData)
    if (res.success) {
      showToast("Live match created successfully!", "success")
      setIsCreateOpen(false)
      refreshData()
    } else {
      showToast(res.error || "Failed to create match", "error")
    }
  }

  // Handle Match Save
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMatch) return

    const res = await updateLiveMatchAction(selectedMatch.id, {
      tournament_id: formData.tournament_id,
      team1_id: formData.team1_id,
      team2_id: formData.team2_id,
      venue: formData.venue,
      kickoff_time: formData.kickoff_time,
      group_name: formData.group_name,
      minute: formData.minute,
      status: formData.status
    })

    if (res.success) {
      showToast("Match configuration updated!", "success")
      setIsEditOpen(false)
      refreshData()
    } else {
      showToast(res.error || "Failed to update match config", "error")
    }
  }

  // Handle Match Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return
    const res = await deleteLiveMatchAction(id)
    if (res.success) {
      showToast("Match deleted successfully", "error")
      if (selectedMatch?.id === id) {
        setSelectedMatch(null)
      }
      refreshData()
    } else {
      showToast(res.error || "Failed to delete match", "error")
    }
  }

  // Control Functions
  const handleStartMatch = async (id: string) => {
    const res = await changeLiveMatchStatusAction(id, "Live", 0)
    if (res.success) {
      showToast("Match Started! Status set to Live.", "success")
      refreshData()
    } else {
      showToast(res.error || "Action failed", "error")
    }
  }

  const handleHalfTime = async (id: string) => {
    // We can denote halftime by setting minute to 45
    const res = await changeLiveMatchStatusAction(id, "Live", 45)
    if (res.success) {
      showToast("Match set to Half Time.", "info")
      refreshData()
    } else {
      showToast(res.error || "Action failed", "error")
    }
  }

  const handleResumeMatch = async (id: string) => {
    const res = await changeLiveMatchStatusAction(id, "Live", 46)
    if (res.success) {
      showToast("Match resumed for Second Half.", "success")
      refreshData()
    } else {
      showToast(res.error || "Action failed", "error")
    }
  }

  const handleFullTime = async (id: string) => {
    const res = await changeLiveMatchStatusAction(id, "Completed", 90)
    if (res.success) {
      showToast("Match concluded! Status set to Completed.", "info")
      refreshData()
    } else {
      showToast(res.error || "Action failed", "error")
    }
  }

  const handleScoreChange = async (id: string, s1: number, s2: number) => {
    const res = await updateLiveMatchScoreAction(id, s1, s2)
    if (res.success) {
      showToast("Scores updated successfully", "success")
      refreshData()
    } else {
      showToast(res.error || "Failed to update scores", "error")
    }
  }

  const handleGoalTeam1 = (matchItem: any) => {
    handleScoreChange(matchItem.id, (matchItem.team1_score ?? 0) + 1, matchItem.team2_score ?? 0)
  }

  const handleGoalTeam2 = (matchItem: any) => {
    handleScoreChange(matchItem.id, matchItem.team1_score ?? 0, (matchItem.team2_score ?? 0) + 1)
  }

  const handleResetScore = (matchItem: any) => {
    if (!confirm("Are you sure you want to reset scores to 0 - 0?")) return
    handleScoreChange(matchItem.id, 0, 0)
  }

  const handleSaveMinute = async (id: string, min: number) => {
    const res = await changeLiveMatchStatusAction(id, selectedMatch.status, min)
    if (res.success) {
      showToast("Minute updated!", "success")
      refreshData()
    } else {
      showToast(res.error || "Failed to save minute", "error")
    }
  }

  const handleOpenEdit = (matchItem: any) => {
    setSelectedMatch(matchItem)
    setFormData({
      tournament_id: matchItem.tournament_id || "",
      team1_id: matchItem.team1_id || "",
      team2_id: matchItem.team2_id || "",
      team1_score: matchItem.team1_score || 0,
      team2_score: matchItem.team2_score || 0,
      status: matchItem.status || "Upcoming",
      minute: matchItem.minute || 0,
      kickoff_time: matchItem.kickoff_time || "18:00",
      venue: matchItem.venue || "",
      group_name: matchItem.group_name || ""
    })
    setIsEditOpen(true)
  }

  const handleOpenCreate = () => {
    setFormData({
      tournament_id: tournaments[0]?.id || "",
      team1_id: teams[0]?.id || "",
      team2_id: teams[1]?.id || "",
      team1_score: 0,
      team2_score: 0,
      status: "Upcoming",
      minute: 0,
      kickoff_time: "18:00",
      venue: "JLN Stadium Court A",
      group_name: "Group A"
    })
    setIsCreateOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 pb-20 relative">
      <PtnNavbar />

      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Admin Workspace</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
              Live Score Control Center
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Manual scores updates, status changes, and minute adjustments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleOpenCreate}
              className="bg-primary hover:bg-primary-light text-black font-extrabold gap-2 rounded-lg"
            >
              <Plus className="size-4" />
              <span>Create Match</span>
            </Button>
            <Link href="/ptn-admin">
              <Button variant="outline" className="border-white/10 hover:border-white/20 rounded-lg">
                <ArrowLeft className="size-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/40 text-sm font-medium animate-pulse">
            Loading score center configurations...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Matches List Grid */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/45 mb-2">Active Matches Grid</h2>
              {matches.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 bg-[#0B0B0B]/30 rounded-xl text-white/40 text-sm font-medium">
                  No matches loaded in database. Create one to begin scoring!
                </div>
              ) : (
                matches.map((m) => {
                  const isCurrent = selectedMatch?.id === m.id
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMatch(m)}
                      className={`cursor-pointer transition-all duration-300 p-5 rounded-2xl border bg-[#0B0B0B]/50 hover:bg-[#0B0B0B]/80 flex flex-col justify-between ${
                        isCurrent ? "border-primary bg-[#0B0B0B]/90 shadow-[0_0_15px_rgba(0,230,118,0.05)]" : "border-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">
                          {m.tournaments?.name} • {m.group_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            m.status === "Live" ? "bg-red-500/10 text-red-500 animate-pulse" :
                            m.status === "Upcoming" ? "bg-white/5 text-white/50" : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {m.status} {m.status === "Live" && `(${m.minute}')`}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenEdit(m)
                            }}
                            className="p-1 hover:text-primary transition-colors text-white/45"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(m.id)
                            }}
                            className="p-1 hover:text-red-500 transition-colors text-white/45"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2 px-1">
                        <span className="font-extrabold text-sm text-white flex-1">{m.team1?.team_name || "TBD"}</span>
                        <span className="text-lg font-black text-primary px-4 bg-white/5 rounded-lg border border-white/5 py-1">
                          {m.team1_score ?? 0} - {m.team2_score ?? 0}
                        </span>
                        <span className="font-extrabold text-sm text-white flex-1 text-right">{m.team2?.team_name || "TBD"}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/45">
                        <span className="flex items-center gap-1"><MapPin className="size-3" /> {m.venue}</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" /> {m.kickoff_time}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Match Action Panel */}
            <div className="lg:col-span-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/45 mb-4">Controller Panel</h2>
              {selectedMatch ? (
                <div className="bg-[#0B0B0B]/80 border border-white/10 rounded-3xl p-6 space-y-6">
                  {/* Selected Info Header */}
                  <div>
                    <h3 className="text-base font-extrabold text-white mb-1">
                      {selectedMatch.team1?.team_name || "TBD"} vs {selectedMatch.team2?.team_name || "TBD"}
                    </h3>
                    <p className="text-xs text-white/50">
                      ID: <span className="text-primary font-mono select-all">{selectedMatch.id}</span>
                    </p>
                  </div>

                  {/* Manual Score Incrementor */}
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">Update Score Board</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Team 1 Goals */}
                      <div className="flex flex-col items-center gap-2.5 p-3 border border-white/5 rounded-xl bg-white/2">
                        <span className="text-xs font-extrabold text-white/70 truncate w-full text-center">
                          {selectedMatch.team1?.team_name || "TBD"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(selectedMatch.id, Math.max(0, (selectedMatch.team1_score ?? 0) - 1), selectedMatch.team2_score ?? 0)}
                            className="p-1 hover:text-red-500 text-white/40 transition-colors"
                          >
                            <MinusCircle className="size-6" />
                          </button>
                          <span className="text-2xl font-black text-white">{selectedMatch.team1_score ?? 0}</span>
                          <button
                            onClick={() => handleGoalTeam1(selectedMatch)}
                            className="p-1 hover:text-primary text-white/40 transition-colors"
                          >
                            <PlusCircle className="size-6" />
                          </button>
                        </div>
                      </div>

                      {/* Team 2 Goals */}
                      <div className="flex flex-col items-center gap-2.5 p-3 border border-white/5 rounded-xl bg-white/2">
                        <span className="text-xs font-extrabold text-white/70 truncate w-full text-center">
                          {selectedMatch.team2?.team_name || "TBD"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(selectedMatch.id, selectedMatch.team1_score ?? 0, Math.max(0, (selectedMatch.team2_score ?? 0) - 1))}
                            className="p-1 hover:text-red-500 text-white/40 transition-colors"
                          >
                            <MinusCircle className="size-6" />
                          </button>
                          <span className="text-2xl font-black text-white">{selectedMatch.team2_score ?? 0}</span>
                          <button
                            onClick={() => handleGoalTeam2(selectedMatch)}
                            className="p-1 hover:text-primary text-white/40 transition-colors"
                          >
                            <PlusCircle className="size-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => handleResetScore(selectedMatch)}
                      className="w-full py-2.5 border border-red-500/20 hover:border-red-500/40 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      Reset Scores
                    </button>
                  </div>

                  {/* Manual Minute Form */}
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">Adjust Live Minute</h4>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={selectedMatch.minute ?? 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setMatches(prev => prev.map(m => m.id === selectedMatch.id ? { ...m, minute: val } : m))
                          setSelectedMatch(prev => prev ? { ...prev, minute: val } : null)
                        }}
                        className="bg-black/50 border-white/10 rounded-lg text-white"
                      />
                      <Button
                        onClick={() => handleSaveMinute(selectedMatch.id, selectedMatch.minute)}
                        className="bg-primary hover:bg-primary-light text-black font-extrabold rounded-lg gap-2"
                      >
                        <Save className="size-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  </div>

                  {/* Quick State Transitions */}
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">Status Controls</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStartMatch(selectedMatch.id)}
                        className="py-3 px-2 border border-white/5 hover:border-primary/40 bg-white/2 hover:bg-primary/5 text-[10px] font-black uppercase text-white hover:text-primary transition-all rounded-xl flex flex-col items-center gap-1.5"
                      >
                        <Play className="size-4" />
                        <span>Kick Off</span>
                      </button>

                      <button
                        onClick={() => handleHalfTime(selectedMatch.id)}
                        className="py-3 px-2 border border-white/5 hover:border-amber-500/40 bg-white/2 hover:bg-amber-500/5 text-[10px] font-black uppercase text-white hover:text-amber-500 transition-all rounded-xl flex flex-col items-center gap-1.5"
                      >
                        <Pause className="size-4" />
                        <span>Half Time</span>
                      </button>

                      <button
                        onClick={() => handleResumeMatch(selectedMatch.id)}
                        className="py-3 px-2 border border-white/5 hover:border-primary/40 bg-white/2 hover:bg-primary/5 text-[10px] font-black uppercase text-white hover:text-primary transition-all rounded-xl flex flex-col items-center gap-1.5"
                      >
                        <Play className="size-4" />
                        <span>2nd Half</span>
                      </button>

                      <button
                        onClick={() => handleFullTime(selectedMatch.id)}
                        className="py-3 px-2 border border-white/5 hover:border-red-500/40 bg-white/2 hover:bg-red-500/5 text-[10px] font-black uppercase text-white hover:text-red-500 transition-all rounded-xl flex flex-col items-center gap-1.5"
                      >
                        <Square className="size-4" />
                        <span>Full Time</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0B0B0B]/30 border border-dashed border-white/5 rounded-3xl p-12 text-center text-white/40 text-xs font-semibold uppercase tracking-wider">
                  Select a match to open scoreboard controls.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE DIALOG MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0B0B] border border-white/10 p-6 rounded-3xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-lg font-extrabold text-white">Create New Match</h3>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Tournament</label>
                  <select
                    value={formData.tournament_id}
                    onChange={(e) => setFormData({ ...formData, tournament_id: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="" disabled>Select Tournament</option>
                    {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Team 1</label>
                  <select
                    value={formData.team1_id}
                    onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="" disabled>Select Team 1</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Team 2</label>
                  <select
                    value={formData.team2_id}
                    onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="" disabled>Select Team 2</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-white/50">Kickoff Time</label>
                    <Input
                      type="text"
                      placeholder="e.g. 18:00"
                      value={formData.kickoff_time}
                      onChange={(e) => setFormData({ ...formData, kickoff_time: e.target.value })}
                      className="bg-[#050505] border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-white/50">Group Name</label>
                    <Input
                      type="text"
                      placeholder="Group A"
                      value={formData.group_name}
                      onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                      className="bg-[#050505] border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Venue</label>
                  <Input
                    type="text"
                    placeholder="Venue location"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="bg-[#050505] border-white/10 rounded-lg text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-black font-extrabold rounded-lg py-3 mt-4"
                >
                  Create Match Record
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CONFIG DIALOG MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0B0B] border border-white/10 p-6 rounded-3xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-lg font-extrabold text-white">Edit Match Details</h3>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Tournament</label>
                  <select
                    value={formData.tournament_id}
                    onChange={(e) => setFormData({ ...formData, tournament_id: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white"
                  >
                    {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Team 1</label>
                  <select
                    value={formData.team1_id}
                    onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white"
                  >
                    {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Team 2</label>
                  <select
                    value={formData.team2_id}
                    onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-white"
                  >
                    {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-white/50">Kickoff Time</label>
                    <Input
                      type="text"
                      value={formData.kickoff_time}
                      onChange={(e) => setFormData({ ...formData, kickoff_time: e.target.value })}
                      className="bg-[#050505] border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-white/50">Group Name</label>
                    <Input
                      type="text"
                      value={formData.group_name}
                      onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                      className="bg-[#050505] border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-white/50">Venue</label>
                  <Input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="bg-[#050505] border-white/10 rounded-lg text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-black font-extrabold rounded-lg py-3 mt-4"
                >
                  Save Changes
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Floating Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md ${
              toastMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
              toastMessage.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
              "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            {toastMessage.type === "success" ? <Check className="size-4" /> : <X className="size-4" />}
            <span className="text-xs font-bold uppercase tracking-wider">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-24">
        <PtnFooter />
      </div>
    </main>
  )
}
