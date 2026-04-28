"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  MoreHorizontal,
  Briefcase,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface JobRole {
  id: string
  title: string
  department: string | null
  seniority: string | null
  location: string | null
  remoteType: string | null
  jdText: string
  requiredSkills: string
  createdAt: string
}

export default function JobRolesPage() {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<JobRole | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    seniority: "",
    location: "",
    remoteType: "Remote",
    jdText: "",
    requiredSkills: "",
    niceToHaveSkills: "",
    yearsExperience: "",
    salaryMin: "",
    salaryMax: "",
  })

  useEffect(() => {
    fetchJobRoles()
  }, [])

  const fetchJobRoles = async () => {
    try {
      const response = await fetch("/api/job-roles")
      if (response.ok) {
        const data = await response.json()
        setJobRoles(data)
      }
    } catch (error) {
      console.error("Error fetching job roles:", error)
      toast.error("Failed to load job roles")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        niceToHaveSkills: formData.niceToHaveSkills.split(",").map(s => s.trim()).filter(Boolean),
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
      }

      const url = editingRole ? `/api/job-roles/${editingRole.id}` : "/api/job-roles"
      const method = editingRole ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingRole ? "Job role updated" : "Job role created")
        setIsDialogOpen(false)
        resetForm()
        fetchJobRoles()
      } else {
        toast.error("Failed to save job role")
      }
    } catch (error) {
      console.error("Error saving job role:", error)
      toast.error("Failed to save job role")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job role?")) return

    try {
      const response = await fetch(`/api/job-roles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Job role deleted")
        fetchJobRoles()
      } else {
        toast.error("Failed to delete job role")
      }
    } catch (error) {
      console.error("Error deleting job role:", error)
      toast.error("Failed to delete job role")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      seniority: "",
      location: "",
      remoteType: "Remote",
      jdText: "",
      requiredSkills: "",
      niceToHaveSkills: "",
      yearsExperience: "",
      salaryMin: "",
      salaryMax: "",
    })
    setEditingRole(null)
  }

  const openEditDialog = (role: JobRole) => {
    const parsed = JSON.parse(role.requiredSkills || "[]")
    setFormData({
      title: role.title,
      department: role.department || "",
      seniority: role.seniority || "",
      location: role.location || "",
      remoteType: role.remoteType || "Remote",
      jdText: role.jdText,
      requiredSkills: Array.isArray(parsed) ? parsed.join(", ") : "",
      niceToHaveSkills: "",
      yearsExperience: "",
      salaryMin: "",
      salaryMax: "",
    })
    setEditingRole(role)
    setIsDialogOpen(true)
  }

  const filteredRoles = jobRoles.filter((role) =>
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.department?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const seniorityColors: Record<string, string> = {
    Junior: "badge-success",
    Mid: "badge-warning",
    Senior: "badge-danger",
    Lead: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Principal: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Job Roles</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job requirements and descriptions
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="gradient-primary text-white btn-premium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search job roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Job Roles Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRoles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No job roles yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first job role to start evaluating candidates
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Role
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="card-hover group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {role.department && (
                            <span className="text-xs">{role.department}</span>
                          )}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(role)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(role.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {role.seniority && (
                        <Badge
                          variant="outline"
                          className={seniorityColors[role.seniority] || ""}
                        >
                          {role.seniority}
                        </Badge>
                      )}
                      {role.remoteType && (
                        <Badge variant="outline">{role.remoteType}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {role.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {role.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(role.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {role.jdText && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {role.jdText.substring(0, 100)}...
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? "Edit Job Role" : "Create New Job Role"}
              </DialogTitle>
              <DialogDescription>
                Define the job requirements and description
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seniority">Seniority</Label>
                  <select
                    id="seniority"
                    value={formData.seniority}
                    onChange={(e) =>
                      setFormData({ ...formData, seniority: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md border bg-background"
                  >
                    <option value="">Select level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Principal">Principal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remoteType">Work Type</Label>
                  <select
                    id="remoteType"
                    value={formData.remoteType}
                    onChange={(e) =>
                      setFormData({ ...formData, remoteType: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md border bg-background"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jdText">Job Description</Label>
                <Textarea
                  id="jdText"
                  value={formData.jdText}
                  onChange={(e) =>
                    setFormData({ ...formData, jdText: e.target.value })
                  }
                  placeholder="Paste the full job description here..."
                  rows={6}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">Required Skills</Label>
                  <Input
                    id="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredSkills: e.target.value })
                    }
                    placeholder="React, TypeScript, Node.js (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niceToHaveSkills">Nice-to-Have Skills</Label>
                  <Input
                    id="niceToHaveSkills"
                    value={formData.niceToHaveSkills}
                    onChange={(e) =>
                      setFormData({ ...formData, niceToHaveSkills: e.target.value })
                    }
                    placeholder="AWS, Docker, GraphQL (comma separated)"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      setFormData({ ...formData, yearsExperience: e.target.value })
                    }
                    placeholder="e.g., 3-5 years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Min Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryMin: e.target.value })
                    }
                    placeholder="100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Max Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryMax: e.target.value })
                    }
                    placeholder="150000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-white">
                  {editingRole ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
