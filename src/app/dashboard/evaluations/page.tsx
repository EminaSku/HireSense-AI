"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileCheck,
  Search,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Share2,
  Download,
  ChevronRight,
  Loader2,
  Target,
  Brain,
  MessageSquare,
  Users,
  Zap,
  Award,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { cn } from "@/lib/utils"

interface Candidate {
  id: string
  name: string | null
  email: string | null
  skills: string
}

interface JobRole {
  id: string
  title: string
  seniority: string | null
}

interface Evaluation {
  id: string
  fitScore: number
  recommendation: string | null
  createdAt: string
  candidate: { name: string | null; email: string | null }
  jobRole: { title: string; seniority: string | null }
}

interface EvaluationDetail extends Evaluation {
  categoryScores: string
  whyThisScore: string
  matchedKeywords: string
  gaps: string
  riskFlags: string
  strengths: string
  concerns: string
  summaryText: string
  interviewKitJson: string
  confidence: number | null
  candidate: Candidate & { summary: string | null; experience: string; education: string }
  jobRole: JobRole & { jdText: string }
}

// Beautiful Animated Fit Score Ring
function FitScoreRing({ score, size = 180, animated = true }: { score: number; size?: number; animated?: boolean }) {
  const [displayScore, setDisplayScore] = useState(() => animated ? 0 : score)
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayScore / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return { stroke: "#22c55e", bg: "rgba(34, 197, 94, 0.1)", text: "text-emerald-500" }
    if (score >= 60) return { stroke: "#eab308", bg: "rgba(234, 179, 8, 0.1)", text: "text-yellow-500" }
    if (score >= 40) return { stroke: "#f97316", bg: "rgba(249, 115, 22, 0.1)", text: "text-orange-500" }
    return { stroke: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", text: "text-red-500" }
  }

  const colors = getColor(score)

  useEffect(() => {
    if (!animated) return
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(interval)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [score, animated])

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Background glow */}
      <div 
        className="absolute rounded-full blur-2xl opacity-30"
        style={{ 
          width: size * 1.2, 
          height: size * 1.2, 
          background: colors.stroke 
        }}
      />
      
      <svg width={size} height={size} className="relative z-10 -rotate-90">
        {/* Background circle */}
        <circle
          className="text-muted/30"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={colors.stroke}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 8px ${colors.stroke})`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center z-20">
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={cn("text-5xl font-bold tabular-nums", colors.text)}
        >
          {displayScore}
          <span className="text-2xl">%</span>
        </motion.span>
        <span className="text-sm text-muted-foreground font-medium mt-1">Fit Score</span>
      </div>
    </div>
  )
}

// Category Score Card with animated bar
function CategoryScoreCard({ 
  label, 
  score, 
  icon: Icon, 
  color, 
  delay = 0 
}: { 
  label: string
  score: number
  icon: React.ElementType
  color: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-lg font-bold tabular-nums">{score}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
              className={cn("h-full rounded-full", color)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Empty State Component
function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel 
}: { 
  icon: React.ElementType
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">{description}</p>
      {action && actionLabel && (
        <Button onClick={action} className="gradient-primary text-white btn-premium">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

// Evaluation Card Component
function EvaluationCard({ 
  evaluation, 
  index,
  onView,
  onShare 
}: { 
  evaluation: Evaluation
  index: number
  onView: () => void
  onShare: () => void
}) {
  const recommendationColors: Record<string, { bg: string; text: string; border: string }> = {
    PROCEED: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
    MAYBE: { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-500/20" },
    NO: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/20" },
  }
  const colors = recommendationColors[evaluation.recommendation || "MAYBE"]
  const initials = evaluation.candidate.name?.split(" ").map(n => n[0]).join("") || "?"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            {/* Score Section */}
            <div 
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-muted/50 to-muted/30 min-w-[100px]"
              onClick={onView}
            >
              <FitScoreRing score={evaluation.fitScore} size={80} animated={false} />
            </div>
            
            {/* Info Section */}
            <div className="flex-1 p-4 pl-2" onClick={onView}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <h3 className="font-semibold truncate">{evaluation.candidate.name || "Unknown"}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    for <span className="font-medium text-foreground">{evaluation.jobRole.title}</span>
                  </p>
                </div>
                <Badge variant="outline" className={cn("shrink-0", colors.bg, colors.text, colors.border)}>
                  {evaluation.recommendation}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-3 ml-10">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(evaluation.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={(e) => { e.stopPropagation(); onShare() }}
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobRoles, setJobRoles] = useState<JobRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationDetail | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [selectedJobRoleId, setSelectedJobRoleId] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [evalRes, candRes, rolesRes] = await Promise.all([
        fetch("/api/evaluations"),
        fetch("/api/candidates"),
        fetch("/api/job-roles"),
      ])

      if (evalRes.ok) setEvaluations(await evalRes.json())
      if (candRes.ok) setCandidates(await candRes.json())
      if (rolesRes.ok) setJobRoles(await rolesRes.json())
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvaluationDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/evaluations/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedEvaluation(data)
        setIsDetailDialogOpen(true)
      }
    } catch (error) {
      console.error("Error fetching evaluation detail:", error)
      toast.error("Failed to load evaluation details")
    }
  }

  const handleCreateEvaluation = async () => {
    if (!selectedCandidateId || !selectedJobRoleId) {
      toast.error("Please select both a candidate and a job role")
      return
    }

    setIsEvaluating(true)

    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: selectedCandidateId,
          jobRoleId: selectedJobRoleId,
        }),
      })

      if (response.ok) {
        toast.success("Evaluation completed successfully!")
        setIsCreateDialogOpen(false)
        setSelectedCandidateId("")
        setSelectedJobRoleId("")
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create evaluation")
      }
    } catch (error) {
      console.error("Error creating evaluation:", error)
      toast.error("Failed to create evaluation")
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleShare = async (evaluationId: string) => {
    try {
      const response = await fetch(`/api/evaluations/${evaluationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresInDays: 7 }),
      })

      if (response.ok) {
        const { token } = await response.json()
        const shareUrl = `${window.location.origin}/share/${token}`
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Share link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error creating share link:", error)
      toast.error("Failed to create share link")
    }
  }

  const parseJsonSafe = (json: string | null) => {
    if (!json) return []
    try {
      return JSON.parse(json)
    } catch {
      return []
    }
  }

  const filteredEvaluations = evaluations.filter(
    (evaluation) =>
      evaluation.candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.jobRole.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Evaluations</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered candidate screening and insights
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gradient-primary text-white btn-premium shadow-lg shadow-primary/25"
              disabled={candidates.length === 0 || jobRoles.length === 0}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New Evaluation
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: CheckCircle2, label: "Proceed", count: evaluations.filter((e) => e.recommendation === "PROCEED").length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: AlertTriangle, label: "Maybe", count: evaluations.filter((e) => e.recommendation === "MAYBE").length, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { icon: XCircle, label: "No Fit", count: evaluations.filter((e) => e.recommendation === "NO").length, color: "text-red-500", bg: "bg-red-500/10" },
            { icon: TrendingUp, label: "Avg Score", count: evaluations.length > 0 ? Math.round(evaluations.reduce((acc, e) => acc + e.fitScore, 0) / evaluations.length) + "%" : "—", color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold tabular-nums truncate">{stat.count}</p>
                      <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by candidate or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-background"
          />
        </div>

        {/* Evaluations List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-28 bg-muted animate-pulse" />
                  <CardContent className="flex-1 p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <Card className="border-dashed">
            <EmptyState
              icon={FileCheck}
              title="No evaluations yet"
              description={candidates.length === 0 || jobRoles.length === 0 
                ? "Add candidates and job roles first to start evaluating" 
                : "Create your first evaluation to see AI-powered candidate insights"}
              action={candidates.length > 0 && jobRoles.length > 0 ? () => setIsCreateDialogOpen(true) : undefined}
              actionLabel="Create First Evaluation"
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEvaluations.map((evaluation, index) => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                index={index}
                onView={() => fetchEvaluationDetail(evaluation.id)}
                onShare={() => handleShare(evaluation.id)}
              />
            ))}
          </div>
        )}

        {/* Create Evaluation Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                New Evaluation
              </DialogTitle>
              <DialogDescription>
                Select a candidate and job role to start the AI evaluation
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Candidate</Label>
                <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name || "Unknown"} ({candidate.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Job Role</Label>
                <Select value={selectedJobRoleId} onValueChange={setSelectedJobRoleId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.title} {role.seniority && `(${role.seniority})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 text-sm">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  AI Analysis Includes
                </p>
                <ul className="text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Skills match with job requirements</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Experience relevance & seniority fit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Domain knowledge & culture signals</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Potential gaps & risk factors</li>
                </ul>
              </div>

              <Button
                onClick={handleCreateEvaluation}
                disabled={!selectedCandidateId || !selectedJobRoleId || isEvaluating}
                className="w-full gradient-primary text-white h-11"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Candidate...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Evaluation
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Evaluation Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
            {selectedEvaluation && (
              <ScrollArea className="max-h-[90vh]">
                <div className="space-y-0">
                  {/* Hero Section with Score */}
                  <div className="relative bg-gradient-to-br from-muted/50 to-muted/30 p-6 sm:p-8">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
                    <div className="relative flex flex-col lg:flex-row items-center gap-6">
                      {/* Score Ring */}
                      <div className="shrink-0">
                        <FitScoreRing score={selectedEvaluation.fitScore} size={200} />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
                          <h2 className="text-2xl sm:text-3xl font-bold">
                            {selectedEvaluation.candidate.name || "Unknown Candidate"}
                          </h2>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-sm px-3 py-1",
                              selectedEvaluation.recommendation === "PROCEED" 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                : selectedEvaluation.recommendation === "MAYBE" 
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" 
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            )}
                          >
                            {selectedEvaluation.recommendation}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-lg">
                          for <span className="font-semibold text-foreground">{selectedEvaluation.jobRole.title}</span>
                        </p>
                        {selectedEvaluation.confidence && (
                          <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
                            <Award className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              AI Confidence: <span className="font-semibold text-foreground">{selectedEvaluation.confidence}%</span>
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          className="bg-background/50 backdrop-blur"
                          onClick={() => window.open(`/api/evaluations/${selectedEvaluation.id}/pdf`, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button 
                          variant="outline"
                          className="bg-background/50 backdrop-blur"
                          onClick={() => handleShare(selectedEvaluation.id)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  {selectedEvaluation.summaryText && (
                    <div className="p-6 border-b">
                      <Card className="border-0 bg-gradient-to-r from-primary/5 to-transparent">
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed">{selectedEvaluation.summaryText}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Category Scores Grid */}
                  <div className="p-6 border-b">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Category Breakdown
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(() => {
                        const scores = parseJsonSafe(selectedEvaluation.categoryScores)
                        const categories = [
                          { label: "Skills Match", score: scores.skillsMatch || 0, icon: Zap, color: "bg-emerald-500" },
                          { label: "Experience", score: scores.experienceRelevance || 0, icon: TrendingUp, color: "bg-blue-500" },
                          { label: "Seniority Fit", score: scores.seniorityFit || 0, icon: Award, color: "bg-purple-500" },
                          { label: "Domain Fit", score: scores.domainFit || 0, icon: Target, color: "bg-orange-500" },
                          { label: "Communication", score: scores.communication || 0, icon: MessageSquare, color: "bg-pink-500" },
                          { label: "Culture Signals", score: scores.cultureSignals || 0, icon: Users, color: "bg-cyan-500" },
                        ]
                        return categories.map((cat, i) => (
                          <CategoryScoreCard key={cat.label} {...cat} delay={i * 0.05} />
                        ))
                      })()}
                    </div>
                  </div>

                  {/* Tabs for details */}
                  <div className="p-6">
                    <Tabs defaultValue="why">
                      <TabsList className="grid w-full grid-cols-4 h-11">
                        <TabsTrigger value="why">Why This Score</TabsTrigger>
                        <TabsTrigger value="strengths">Strengths</TabsTrigger>
                        <TabsTrigger value="gaps">Gaps</TabsTrigger>
                        <TabsTrigger value="interview">Interview Kit</TabsTrigger>
                      </TabsList>

                      <TabsContent value="why" className="mt-6">
                        <Card className="border-0 shadow-sm">
                          <CardContent className="p-4">
                            <ul className="space-y-3">
                              {parseJsonSafe(selectedEvaluation.whyThisScore).map((reason: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-start gap-3 text-sm"
                                >
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Target className="w-3 h-3 text-primary" />
                                  </div>
                                  <span>{reason}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="strengths" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="border-0 shadow-sm overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Strengths
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {parseJsonSafe(selectedEvaluation.strengths).map((strength: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card className="border-0 shadow-sm overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Concerns
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {parseJsonSafe(selectedEvaluation.concerns).map((concern: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                    <span>{concern}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="gaps" className="mt-6 space-y-4">
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Missing Skills / Experience</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {parseJsonSafe(selectedEvaluation.gaps).length > 0 ? (
                                parseJsonSafe(selectedEvaluation.gaps).map((gap: string, i: number) => (
                                  <Badge key={i} variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                    {gap}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No significant gaps identified</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Matched Keywords</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {parseJsonSafe(selectedEvaluation.matchedKeywords).length > 0 ? (
                                parseJsonSafe(selectedEvaluation.matchedKeywords).map((keyword: string, i: number) => (
                                  <Badge key={i} variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                    {keyword}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No keywords matched</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Risk Flags</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {parseJsonSafe(selectedEvaluation.riskFlags).length > 0 ? (
                              <ul className="space-y-2">
                                {parseJsonSafe(selectedEvaluation.riskFlags).map((flag: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    <span>{flag}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">No significant risk flags identified</p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="interview" className="mt-6">
                        {(() => {
                          const kit = parseJsonSafe(selectedEvaluation.interviewKitJson)
                          return (
                            <div className="space-y-3">
                              {kit.technical?.length > 0 && (
                                <Collapsible defaultOpen>
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-between h-12 px-4 bg-muted/50 hover:bg-muted">
                                      <span className="flex items-center gap-2 font-medium">
                                        <Brain className="w-4 h-4 text-primary" />
                                        Technical Questions ({kit.technical.length})
                                      </span>
                                      <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]:rotate-90" />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="space-y-3 pt-3 pl-4">
                                      {kit.technical.map((q: { question: string; tests: string; strongAnswerSignals: string }, i: number) => (
                                        <Card key={i} className="border-0 shadow-sm overflow-hidden">
                                          <div className="h-0.5 bg-gradient-to-r from-primary to-primary/50" />
                                          <CardContent className="p-4">
                                            <p className="font-medium mb-2">{q.question}</p>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              <strong className="text-foreground">Tests:</strong> {q.tests}
                                            </p>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                              <strong>Good answer:</strong> {q.strongAnswerSignals}
                                            </p>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {kit.behavioral?.length > 0 && (
                                <Collapsible>
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-between h-12 px-4 bg-muted/50 hover:bg-muted">
                                      <span className="flex items-center gap-2 font-medium">
                                        <MessageSquare className="w-4 h-4 text-purple-500" />
                                        Behavioral Questions ({kit.behavioral.length})
                                      </span>
                                      <ChevronRight className="w-4 h-4" />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="space-y-3 pt-3 pl-4">
                                      {kit.behavioral.map((q: { question: string; tests: string; strongAnswerSignals: string }, i: number) => (
                                        <Card key={i} className="border-0 shadow-sm">
                                          <CardContent className="p-4">
                                            <p className="font-medium mb-2">{q.question}</p>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              <strong className="text-foreground">Tests:</strong> {q.tests}
                                            </p>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                              <strong>Good answer:</strong> {q.strongAnswerSignals}
                                            </p>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {kit.culture?.length > 0 && (
                                <Collapsible>
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-between h-12 px-4 bg-muted/50 hover:bg-muted">
                                      <span className="flex items-center gap-2 font-medium">
                                        <Users className="w-4 h-4 text-cyan-500" />
                                        Culture Questions ({kit.culture.length})
                                      </span>
                                      <ChevronRight className="w-4 h-4" />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="space-y-3 pt-3 pl-4">
                                      {kit.culture.map((q: { question: string; tests: string; strongAnswerSignals: string }, i: number) => (
                                        <Card key={i} className="border-0 shadow-sm">
                                          <CardContent className="p-4">
                                            <p className="font-medium mb-2">{q.question}</p>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              <strong className="text-foreground">Tests:</strong> {q.tests}
                                            </p>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                              <strong>Good answer:</strong> {q.strongAnswerSignals}
                                            </p>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}
                            </div>
                          )
                        })()}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-6 pt-0">
                    <Card className="border-dashed bg-amber-500/5">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-amber-600 dark:text-amber-400">Disclaimer:</strong> This evaluation is AI-generated and intended to assist recruiters, 
                          not replace human judgment. Always verify information and conduct proper interviews before making hiring decisions. 
                          The AI does not infer protected characteristics such as age, gender, race, or disability.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
