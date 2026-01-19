"use client"

import { useState, useEffect } from "react"
import { Loader2, Shield, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  created_at: string
  updated_at: string
}

export default function UsersManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/users")
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRoles((prev) => new Set(prev).add(userId))

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setUpdatingRoles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Manage Users</h2>

      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-card border border-border rounded-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || user.email}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {user.name || "No Name"}
                  </h3>
                  {user.role === "admin" && (
                    <Shield className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="ml-4">
              <Select
                value={user.role}
                onValueChange={(value) => handleRoleChange(user.id, value)}
                disabled={updatingRoles.has(user.id)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {updatingRoles.has(user.id) && (
                <Loader2 className="w-4 h-4 animate-spin text-primary mt-2 ml-auto" />
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  )
}
