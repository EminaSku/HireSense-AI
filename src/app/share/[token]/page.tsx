"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Brain,
  MessageSquare,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Fit Score Ring Component
function FitScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return "#22c55e"
    if (score >= 60) return "#eab308"
    if (score >= 40) return "#f97316"
    return "#ef4444"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        <circle
          className="text-muted"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1000 ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={getColor(score)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold" style={{ color: getColor(score) }}>
          {score}%
        </span>
        <span className="text-sm text-muted-foreground">Fit Score</span>
      </div>
    </div>
  )
}

// Category Score Bar
function CategoryScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

const parseJsonSafe = (json: string | null) => {
  if (!json) return []
  try {
    return JSON.parse(json)
  } catch {
    return []
  }
}

export default function SharedEvaluationPage() {
  const params = useParams()
  const token = params.token as string
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvaluation()
  }, [token])

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/share/${token}`)
      if (!response.ok) {
        if (response.status === 410) {
          setError("This share link has expired")
        } else {
          setError("Evaluation not found")
        }
        return
      }
      const data = await response.json()
      setEvaluation(data)
    } catch (err) {
      setError("Failed to load evaluation")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-pattern">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading evaluation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-pattern px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">{error}</h1>
            <p className="text-muted-foreground">
              Please contact the recruiter for a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recommendationColors: Record<string, string> = {
    PROCEED: "badge-success",
    MAYBE: "badge-warning",
    NO: "badge-danger",
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">HireSense AI</span>
          </div>
          <Badge variant="outline">Shared Evaluation</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <FitScoreRing score={evaluation.fitScore} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold">
                  {evaluation.candidate?.name || "Unknown Candidate"}
                </h1>
                <Badge
                  variant="outline"
                  className={recommendationColors[evaluation.recommendation || ""]}
                >
                  {evaluation.recommendation}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                for <span className="font-medium">{evaluation.jobRole?.title}</span>
              </p>
              {evaluation.confidence && (
                <p className="text-sm text-muted-foreground mt-1">
                  Confidence: {evaluation.confidence}%
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          {evaluation.summaryText && (
            <Card className="glass-card">
              <CardContent className="p-4">
                <p className="text-sm">{evaluation.summaryText}</p>
              </CardContent>
            </Card>
          )}

          {/* Category Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const scores = parseJsonSafe(evaluation.categoryScores)
                return (
                  <>
                    <CategoryScoreBar label="Skills Match" score={scores.skillsMatch || 0} color="bg-emerald-500" />
                    <CategoryScoreBar label="Experience Relevance" score={scores.experienceRelevance || 0} color="bg-blue-500" />
                    <CategoryScoreBar label="Seniority Fit" score={scores.seniorityFit || 0} color="bg-purple-500" />
                    <CategoryScoreBar label="Domain Fit" score={scores.domainFit || 0} color="bg-orange-500" />
                    <CategoryScoreBar label="Communication" score={scores.communication || 0} color="bg-pink-500" />
                    <CategoryScoreBar label="Culture Signals" score={scores.cultureSignals || 0} color="bg-cyan-500" />
                  </>
                )
              })()}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="why">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="why">Why This Score</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="gaps">Gaps</TabsTrigger>
              <TabsTrigger value="interview">Interview Kit</TabsTrigger>
            </TabsList>

            <TabsContent value="why" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {parseJsonSafe(evaluation.whyThisScore).map((reason: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strengths" className="mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-emerald-500 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parseJsonSafe(evaluation.strengths).map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-amber-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Concerns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parseJsonSafe(evaluation.concerns).map((concern: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gaps" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Missing Skills / Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonSafe(evaluation.gaps).length > 0 ? (
                      parseJsonSafe(evaluation.gaps).map((gap: string, i: number) => (
                        <Badge key={i} variant="outline" className="badge-warning">
                          {gap}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No significant gaps identified</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Matched Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonSafe(evaluation.matchedKeywords).length > 0 ? (
                      parseJsonSafe(evaluation.matchedKeywords).map((keyword: string, i: number) => (
                        <Badge key={i} variant="outline" className="badge-success">
                          {keyword}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No keywords matched</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interview" className="mt-4">
              {(() => {
                const kit = parseJsonSafe(evaluation.interviewKitJson)
                return (
                  <div className="space-y-4">
                    {kit.technical?.length > 0 && (
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-primary" />
                              Technical Questions ({kit.technical.length})
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-3 pl-4 pt-2">
                            {kit.technical.map((q: any, i: number) => (
                              <Card key={i}>
                                <CardContent className="p-4">
                                  <p className="font-medium mb-2">{q.question}</p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Tests:</strong> {q.tests}
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
                          <Button variant="ghost" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-purple-500" />
                              Behavioral Questions ({kit.behavioral.length})
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-3 pl-4 pt-2">
                            {kit.behavioral.map((q: any, i: number) => (
                              <Card key={i}>
                                <CardContent className="p-4">
                                  <p className="font-medium mb-2">{q.question}</p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Tests:</strong> {q.tests}
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

          {/* Disclaimer */}
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This evaluation is AI-generated and intended to assist recruiters, 
                not replace human judgment. Always verify information and conduct proper interviews before making hiring decisions. 
                The AI does not infer protected characteristics such as age, gender, race, or disability.
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Generated by HireSense AI on {new Date(evaluation.createdAt).toLocaleString()}</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
