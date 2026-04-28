"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  MapPin,
  Mail,
  Phone,
  Upload,
  FileText,
  Edit,
  Trash2,
  Eye,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { cn } from "@/lib/utils"

interface Candidate {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin: string | null
  summary: string | null
  skills: string
  experience: string
  education: string
  status: string
  createdAt: string
}

interface CandidateDetail extends Candidate {
  website: string | null
  github: string | null
  certifications: string | null
  languages: string | null
  projects: string | null
  cvText: string | null
  extractedJson: string | null
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  SCREENING: "badge-warning",
  INTERVIEW: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  OFFER: "badge-success",
  REJECTED: "badge-danger",
  HIRED: "badge-success",
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetail | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates")
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast.error("Failed to load candidates")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCandidateDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/candidates/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedCandidate(data)
        setIsDetailDialogOpen(true)
      }
    } catch (error) {
      console.error("Error fetching candidate detail:", error)
      toast.error("Failed to load candidate details")
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/candidates", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        toast.success("Candidate uploaded and processed successfully!")
        setIsUploadDialogOpen(false)
        fetchCandidates()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload candidate")
      }
    } catch (error) {
      console.error("Error uploading candidate:", error)
      toast.error("Failed to upload candidate")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0])
      }
    },
    []
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return

    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Candidate deleted")
        fetchCandidates()
      } else {
        toast.error("Failed to delete candidate")
      }
    } catch (error) {
      console.error("Error deleting candidate:", error)
      toast.error("Failed to delete candidate")
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

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground mt-1">
              Manage your candidate pool and CVs
            </p>
          </div>
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="gradient-primary text-white btn-premium"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CV
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No candidates yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first CV to start building your candidate pool
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First CV
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate, index) => {
              const skills = parseJsonSafe(candidate.skills)
              return (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="card-hover group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="flex items-center gap-3 flex-1"
                          onClick={() => fetchCandidateDetail(candidate.id)}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="gradient-primary text-white">
                              {candidate.name?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{candidate.name || "Unknown"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {candidate.email}
                            </p>
                          </div>
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
                            <DropdownMenuItem onClick={() => fetchCandidateDetail(candidate.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(candidate.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {candidate.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />
                          {candidate.location}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-3">
                        {skills.slice(0, 4).map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{skills.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <Badge
                          variant="outline"
                          className={statusColors[candidate.status] || ""}
                        >
                          {candidate.status}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(candidate.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Candidate CV</DialogTitle>
              <DialogDescription>
                Upload a PDF or DOCX file. Our AI will extract candidate information automatically.
              </DialogDescription>
            </DialogHeader>

            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <p className="font-medium">Processing CV...</p>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Extracting candidate information with AI
                  </p>
                </div>
              ) : (
                <>
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <label>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleFileUpload(e.target.files[0])
                      }
                    />
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Candidate Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Candidate Profile</DialogTitle>
            </DialogHeader>

            {selectedCandidate && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6 pr-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="gradient-primary text-white text-xl">
                        {selectedCandidate.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                      {selectedCandidate.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {selectedCandidate.location}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCandidate.email && (
                          <a
                            href={`mailto:${selectedCandidate.email}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Mail className="w-3 h-3" />
                            {selectedCandidate.email}
                          </a>
                        )}
                        {selectedCandidate.phone && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {selectedCandidate.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColors[selectedCandidate.status] || ""}
                    >
                      {selectedCandidate.status}
                    </Badge>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="raw">Raw Data</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      {selectedCandidate.summary && (
                        <div>
                          <h3 className="font-semibold mb-2">Summary</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedCandidate.summary}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {parseJsonSafe(selectedCandidate.skills).map((skill: string) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {parseJsonSafe(selectedCandidate.languages).length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            {parseJsonSafe(selectedCandidate.languages).map((lang: string) => (
                              <Badge key={lang} variant="outline">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4">
                      {parseJsonSafe(selectedCandidate.experience).map(
                        (exp: {
                          title: string
                          company: string
                          startDate: string
                          endDate: string | null
                          description: string
                        }, index: number) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{exp.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {exp.company}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {exp.startDate} - {exp.endDate || "Present"}
                                </p>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {exp.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        )
                      )}
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4">
                      {parseJsonSafe(selectedCandidate.education).map(
                        (edu: {
                          degree: string
                          institution: string
                          year: string
                          field?: string
                        }, index: number) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <h4 className="font-semibold">{edu.degree}</h4>
                              <p className="text-sm text-muted-foreground">
                                {edu.institution}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {edu.year}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </TabsContent>

                    <TabsContent value="raw">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            Extracted JSON Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(
                              JSON.parse(selectedCandidate.extractedJson || "{}"),
                              null,
                              2
                            )}
                          </pre>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
