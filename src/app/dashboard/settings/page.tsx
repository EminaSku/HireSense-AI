"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Users,
  Key,
  Globe,
  Save,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Settings saved successfully")
    setIsLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback className="gradient-primary text-white text-2xl">
                        {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        defaultValue={user?.name || ""}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email || ""}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your company name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Badge variant="outline" className="capitalize">
                      {user?.role || "Recruiter"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the app looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred color scheme
                      </p>
                    </div>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your evaluations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly summary of your hiring pipeline
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Settings Tab */}
          <TabsContent value="ai">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    AI Provider Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your AI provider settings. These are set via environment variables.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">AI Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {process.env.NODE_ENV === "development" ? "Cloud LLM" : "Configured via ENV"}
                      </p>
                    </div>
                    <Badge className="badge-success">Active</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Environment Variables</Label>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 font-mono text-sm">
                      <p><span className="text-muted-foreground">AI_MODE=</span>cloud | local</p>
                      <p><span className="text-muted-foreground">OPENAI_API_KEY=</span>your-api-key</p>
                      <p><span className="text-muted-foreground">OPENAI_BASE_URL=</span>https://api.openai.com/v1</p>
                      <p><span className="text-muted-foreground">LOCAL_LLM_BASE_URL=</span>http://localhost:1234/v1</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Set these in your .env file. Restart the server after changes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    AI Guardrails
                  </CardTitle>
                  <CardDescription>
                    Safety and fairness settings for AI evaluations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Protected Attributes Filter</Label>
                      <p className="text-sm text-muted-foreground">
                        Never infer gender, age, race, or other protected characteristics
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Assistive Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        All outputs are suggestions, not absolute decisions
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Confidence Scores</Label>
                      <p className="text-sm text-muted-foreground">
                        Display AI confidence level for each evaluation
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Manage your team and their access levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Current user */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user?.image || ""} />
                          <AvatarFallback className="gradient-primary text-white">
                            {user?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name || "You"}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {user?.role || "Recruiter"}
                      </Badge>
                    </div>

                    {/* Placeholder for other team members */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">No other team members</p>
                          <p className="text-sm text-muted-foreground">
                            Invite your team to collaborate
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <Label>Invite Team Member</Label>
                    <div className="flex gap-2">
                      <Input placeholder="colleague@email.com" type="email" />
                      <Button className="gradient-primary text-white">Invite</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Team members will have Recruiter access by default. Admin can change roles later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Manage your data and retention settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Retention Period</Label>
                      <p className="text-sm text-muted-foreground">
                        How long to keep candidate data
                      </p>
                    </div>
                    <Select defaultValue="12months">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6months">6 months</SelectItem>
                        <SelectItem value="12months">12 months</SelectItem>
                        <SelectItem value="24months">24 months</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export All Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Download all your data in JSON format
                      </p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-destructive">Delete All Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all your data
                      </p>
                    </div>
                    <Button variant="destructive">Delete All</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Privacy & Compliance
                  </CardTitle>
                  <CardDescription>
                    Data privacy and compliance settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>GDPR Compliant Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Additional privacy protections for EU candidates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Anonymize After Rejection</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove PII from rejected candidates after 30 days
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="gradient-primary text-white"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
