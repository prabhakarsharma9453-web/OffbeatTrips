"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Calendar,
  Camera,
  Save,
  Loader2,
  Edit2,
  X,
  Check,
  Settings,
  Shield,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SessionTimeout from "@/components/session-timeout"

interface UserProfile {
  id: string
  email: string
  name: string
  username: string
  image: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export default function DashboardPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    username: "",
  })

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    fetchProfile()
  }, [session, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const result = await response.json()

      if (result.success) {
        setProfile(result.data)
        setEditData({
          name: result.data.name || "",
          username: result.data.username || "",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        // Update profile with new image
        const updateResponse = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: uploadResult.path }),
        })

        const updateResult = await updateResponse.json()

        if (updateResult.success) {
          setProfile((prev) => (prev ? { ...prev, image: uploadResult.path } : null))
          await update() // Update session
          toast({
            title: "Success",
            description: "Profile image updated successfully",
          })
        } else {
          throw new Error(updateResult.error || "Failed to update profile")
        }
      } else {
        throw new Error(uploadResult.error || "Upload failed")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      const result = await response.json()

      if (result.success) {
        setProfile(result.data)
        setIsEditing(false)
        await update() // Update session
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditData({
        name: profile.name || "",
        username: profile.username || "",
      })
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-8 px-4 sm:px-6 lg:px-8">
      <SessionTimeout />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="relative inline-block mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20">
                      <AvatarImage
                        src={profile.image || "/placeholder.svg"}
                        alt={profile.name || "Profile"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {getInitials(profile.name, profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-4 border-background shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      aria-label="Upload profile image"
                      title="Upload profile image"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                      ) : (
                        <Camera className="w-4 h-4 text-primary-foreground" />
                      )}
                    </motion.button>
                  </motion.div>
                  <label htmlFor="profile-image-upload" className="sr-only">
                    Upload profile image
                  </label>
                  <input
                    id="profile-image-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <CardTitle className="text-2xl">{profile.name || "User"}</CardTitle>
                <CardDescription className="text-sm">{profile.email}</CardDescription>
                {profile.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
                  >
                    <Shield className="w-3 h-3" />
                    Admin
                  </motion.div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Username</p>
                    <p className="text-white font-medium">{profile.username || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-white font-medium">{profile.email}</p>
                  </div>
                </div>
                {profile.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Member since</p>
                      <p className="text-white font-medium">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Full Name
                        </label>
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="Enter your name"
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Username
                        </label>
                        <Input
                          value={editData.username}
                          onChange={(e) =>
                            setEditData({ ...editData, username: e.target.value })
                          }
                          placeholder="Enter username"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-background/30 border border-border">
                          <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                          <p className="text-white font-medium">{profile.name || "Not set"}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/30 border border-border">
                          <p className="text-sm text-muted-foreground mb-1">Username</p>
                          <p className="text-white font-medium">
                            {profile.username || "Not set"}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/30 border border-border">
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="text-white font-medium">{profile.email}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/30 border border-border">
                          <p className="text-sm text-muted-foreground mb-1">Role</p>
                          <p className="text-white font-medium capitalize">{profile.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-2xl font-bold text-white mt-1">Active</p>
                </div>
                <div className="p-3 rounded-full bg-green-500/20">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {profile.createdAt
                      ? new Date(profile.createdAt).getFullYear()
                      : "N/A"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Complete</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {profile.name && profile.username ? "100%" : "50%"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/20">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
