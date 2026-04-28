"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  FileCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

// Demo data
const evaluationsOverTime = [
  { month: "Jan", evaluations: 12, avgScore: 72 },
  { month: "Feb", evaluations: 19, avgScore: 68 },
  { month: "Mar", evaluations: 15, avgScore: 75 },
  { month: "Apr", evaluations: 25, avgScore: 71 },
  { month: "May", evaluations: 32, avgScore: 74 },
  { month: "Jun", evaluations: 28, avgScore: 78 },
]

const scoresByRole = [
  { role: "Software Engineer", avgScore: 76, count: 24 },
  { role: "Product Manager", avgScore: 71, count: 12 },
  { role: "Data Scientist", avgScore: 82, count: 8 },
  { role: "UX Designer", avgScore: 69, count: 15 },
  { role: "DevOps", avgScore: 74, count: 6 },
]

const topMissingSkills = [
  { skill: "AWS", count: 18 },
  { skill: "TypeScript", count: 15 },
  { skill: "System Design", count: 12 },
  { skill: "React", count: 10 },
  { skill: "Docker", count: 8 },
  { skill: "GraphQL", count: 7 },
]

const recommendationDistribution = [
  { name: "Proceed", value: 45, color: "#22c55e" },
  { name: "Maybe", value: 30, color: "#eab308" },
  { name: "No", value: 25, color: "#ef4444" },
]

const chartConfig = {
  evaluations: {
    label: "Evaluations",
    color: "hsl(var(--primary))",
  },
  avgScore: {
    label: "Avg Score",
    color: "hsl(217, 91%, 60%)",
  },
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your hiring pipeline performance
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +23%
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">131</p>
                  <p className="text-sm text-muted-foreground">Total Evaluations</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +5%
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">73%</p>
                  <p className="text-sm text-muted-foreground">Avg Fit Score</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-sm text-muted-foreground">Candidates Screened</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Active Roles</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Evaluations Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Evaluations Over Time</CardTitle>
                <CardDescription>Monthly evaluation count and average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={evaluationsOverTime}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="evaluations"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendation Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Distribution</CardTitle>
                <CardDescription>Breakdown of evaluation recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recommendationDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {recommendationDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scores by Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Average Score by Role</CardTitle>
                <CardDescription>Performance across different job positions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={scoresByRole} layout="vertical">
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="role" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Missing Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Missing Skills</CardTitle>
                <CardDescription>Most common skill gaps across evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMissingSkills.map((skill, index) => (
                    <div key={skill.skill} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-8 text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{skill.skill}</span>
                          <span className="text-sm text-muted-foreground">
                            {skill.count} candidates
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(skill.count / 20) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
