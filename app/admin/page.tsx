"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader2, Shield, Hotel, Users, Package, ArrowLeft, MapPin, Globe, LogOut } from "lucide-react"
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
      <div className="pt-20 md:pt-32 pb-6 md:pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-5 md:mb-8">
            <div className="flex items-center justify-between gap-4 mb-4 md:mb-4">
              <Link href="/">
                <Button variant="ghost" className="text-sm md:text-base h-9 md:h-10 -ml-2 md:ml-0">
                  <ArrowLeft className="w-4 h-4 md:w-4 md:h-4 mr-2" />
                  <span className="text-sm md:text-base">Back to Home</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:bg-destructive hover:text-destructive-foreground border-destructive/30 text-destructive text-sm md:text-base h-9 md:h-10"
              >
                <LogOut className="w-4 h-4 md:w-4 md:h-4 mr-2" />
                <span className="text-sm md:text-base">Logout</span>
              </Button>
            </div>
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-muted-foreground">Manage resorts, packages, and users</p>
              </div>
            </div>
            <div className="p-4 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
              <p className="text-sm md:text-base text-muted-foreground">
                Logged in as: <span className="text-white font-semibold break-all">{session.user.email}</span>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-5 md:mb-8 w-full">
              {/* Mobile: Scrollable horizontal tabs */}
              <div className="block md:hidden overflow-x-auto -mx-4 px-4 pb-3 scrollbar-hide">
                <TabsList className="inline-flex h-auto p-2 gap-2.5 w-max min-w-full bg-muted/80 backdrop-blur-sm border border-border/50 shadow-lg">
                  <TabsTrigger 
                    value="resorts" 
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 flex-shrink-0 min-w-[110px] h-11"
                  >
                    <Hotel className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Resort</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="packages" 
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 flex-shrink-0 min-w-[110px] h-11"
                  >
                    <Package className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Packages</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="trips" 
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 flex-shrink-0 min-w-[110px] h-11"
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Trip</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="destinations" 
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 flex-shrink-0 min-w-[120px] h-11"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Destination</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 flex-shrink-0 min-w-[110px] h-11"
                  >
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Users</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Desktop: Grid layout */}
              <div className="hidden md:block">
                <TabsList className="grid w-full max-w-4xl grid-cols-5 h-auto p-2 gap-3 bg-muted/80 backdrop-blur-sm border border-border/50 shadow-lg">
                  <TabsTrigger 
                    value="resorts" 
                    className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 h-12"
                  >
                    <Hotel className="w-4 h-4 flex-shrink-0" />
                    <span>Resorts</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="packages" 
                    className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 h-12"
                  >
                    <Package className="w-4 h-4 flex-shrink-0" />
                    <span>Packages</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="trips" 
                    className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 h-12"
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>Trips</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="destinations" 
                    className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 h-12"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span>Destinations</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 h-12"
                  >
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>Users</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

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
