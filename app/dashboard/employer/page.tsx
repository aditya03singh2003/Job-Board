"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EmployerJobsTable } from "@/components/employer-jobs-table"
import { EmployerApplicationsTable } from "@/components/employer-applications-table"
import { Briefcase, Users, LineChart, PlusCircle, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmployerDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/employer/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-header">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          className="text-3xl font-bold gradient-text"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Employer Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            asChild
            className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 transition-all duration-300"
          >
            <Link href="/dashboard/employer/post-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Job
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-primary mr-2 animate-pulse" />
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalJobs}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-green-500 mr-2 animate-pulse" />
                <div className="text-2xl font-bold">{loading ? "..." : stats.activeJobs}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2 animate-pulse" />
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalApplications}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <LineChart className="h-5 w-5 text-violet-500 mr-2 animate-pulse" />
                <div className="text-2xl font-bold">{loading ? "..." : stats.newApplications}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger
              value="jobs"
              className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="mr-2 h-4 w-4" />
              Applications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployerJobsTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Review and manage applications for your jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployerApplicationsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
