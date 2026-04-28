"use client"

import { motion } from "framer-motion"
import {
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

// Demo stats
const stats = [
  {
    name: "Total Candidates",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Active Job Roles",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: Briefcase,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Evaluations Done",
    value: "47",
    change: "+23%",
    changeType: "positive" as const,
    icon: FileCheck,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Avg Fit Score",
    value: "72%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500",
  },
]

const recentEvaluations = [
  { id: "1", candidateName: "John Doe", role: "Senior Software Engineer", score: 85, status: "PROCEED", date: "2 hours ago" },
  { id: "2", candidateName: "Jane Smith", role: "Product Manager", score: 68, status: "MAYBE", date: "5 hours ago" },
  { id: "3", candidateName: "Alex Johnson", role: "Data Scientist", score: 92, status: "PROCEED", date: "Yesterday" },
  { id: "4", candidateName: "Sarah Williams", role: "UX Designer", score: 45, status: "NO", date: "Yesterday" },
]

const quickActions = [
  { title: "Add New Candidate", description: "Upload CV and extract data", href: "/dashboard/candidates", icon: Users, color: "bg-emerald-500" },
  { title: "Create Job Role", description: "Define requirements and JD", href: "/dashboard/job-roles", icon: Briefcase, color: "bg-blue-500" },
  { title: "Run Evaluation", description: "Match candidate to role", href: "/dashboard/evaluations", icon: FileCheck, color: "bg-purple-500" },
]

export function DashboardHome() {
  const { user } = useSession()
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) return "Good afternoon"
    if (hour >= 17) return "Good evening"
    return "Good morning"
  }, [])

  const statusColors: Record<string, { bg: string; text: string }> = {
    PROCEED: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    MAYBE: { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
    NO: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your hiring pipeline
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/dashboard/evaluations">
            <Button className="gradient-primary text-white btn-premium shadow-lg shadow-primary/25 h-11">
              <Sparkles className="w-4 h-4 mr-2" />
              New Evaluation
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden border-0 shadow-sm group hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {stat.change}
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{stat.name}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Evaluations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-muted/50 to-transparent">
              <div>
                <CardTitle className="text-lg">Recent Evaluations</CardTitle>
                <CardDescription>Latest candidate assessments</CardDescription>
              </div>
              <Link href="/dashboard/evaluations">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentEvaluations.map((evaluation, index) => {
                  const colors = statusColors[evaluation.status]
                  const initials = evaluation.candidateName.split(" ").map(n => n[0]).join("")
                  return (
                    <motion.div
                      key={evaluation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{evaluation.candidateName}</p>
                          <p className="text-xs text-muted-foreground truncate">{evaluation.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold tabular-nums">{evaluation.score}%</p>
                          <Badge variant="outline" className={`text-xs ${colors.bg} ${colors.text} border-0`}>
                            {evaluation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Mobile score display */}
                          <div className="sm:hidden flex items-center gap-2">
                            <span className="font-bold tabular-nums text-sm">{evaluation.score}%</span>
                            <Badge variant="outline" className={`text-xs ${colors.bg} ${colors.text} border-0`}>
                              {evaluation.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{evaluation.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Get started quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-dashed overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  Run your first evaluation in under 5 minutes
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {[
                  { num: "1", label: "Add Role" },
                  { num: "2", label: "Upload CV" },
                  { num: "3", label: "Evaluate" },
                ].map((step, i) => (
                  <div key={step.num} className="flex items-center">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <div className={`w-6 h-6 rounded-full ${i === 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-xs font-medium`}>
                        {step.num}
                      </div>
                      <span className="hidden sm:inline text-muted-foreground">{step.label}</span>
                    </div>
                    {i < 2 && <div className="w-4 sm:w-8 h-px bg-border mx-1 sm:mx-2" />}
                  </div>
                ))}
              </div>
              <Link href="/dashboard/job-roles" className="shrink-0">
                <Button className="gradient-primary text-white">Start Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
