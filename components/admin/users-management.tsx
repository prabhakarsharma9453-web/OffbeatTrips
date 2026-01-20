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
    <div className="space-y-4 md:space-y-6 w-full overflow-x-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-white">Manage Users</h2>

      <div className="grid gap-3 md:gap-4 w-full">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-card border border-border rounded-xl md:rounded-lg p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full min-w-0 overflow-hidden"
          >
            {/* User Info Section */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || user.email}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base md:text-lg font-semibold text-white truncate">
                    {user.name || "No Name"}
                  </h3>
                  {user.role === "admin" && (
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm md:text-base text-muted-foreground truncate mb-1">
                  {user.email}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Role Select Section */}
            <div className="flex items-center gap-3 sm:ml-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial min-w-0 sm:min-w-[140px]">
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                  disabled={updatingRoles.has(user.id)}
                >
                  <SelectTrigger className="w-full sm:w-[140px] h-10 md:h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {updatingRoles.has(user.id) && (
                <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-base md:text-lg">No users found</p>
        </div>
      )}
    </div>
  )
}
