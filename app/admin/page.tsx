"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader2, Shield, Hotel, Users, Package, ArrowLeft, MapPin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ResortForm from "@/components/admin/resort-form"
import PackageForm from "@/components/admin/package-form"
import UsersManagement from "@/components/admin/users-management"
import TripForm from "@/components/admin/trip-form"
import DestinationForm from "@/components/admin/destination-form"
import DestinationTripsForm from "@/components/admin/destination-trips-form"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("resorts")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session || session.user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage resorts, packages, and users</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="text-white font-semibold">{session.user.email}</span>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-4xl grid-cols-5 mb-8">
              <TabsTrigger value="resorts" className="flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                Resorts
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Packages
              </TabsTrigger>
              <TabsTrigger value="trips" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Trips
              </TabsTrigger>
              <TabsTrigger value="destinations" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Destinations
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resorts">
              <ResortForm />
            </TabsContent>

            <TabsContent value="packages">
              <PackageForm />
            </TabsContent>

            <TabsContent value="trips">
              <TripForm />
            </TabsContent>

            <TabsContent value="destinations">
              <div className="space-y-8">
                <DestinationForm />
                <div className="border-t border-border pt-8">
                  <DestinationTripsForm />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
