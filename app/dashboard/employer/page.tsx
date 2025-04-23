"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployerJobsTable } from "@/components/employer-jobs-table"
import { EmployerApplicationsTable } from "@/components/employer-applications-table"
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Loader2,
  RefreshCw,
  PlusCircle,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Settings,
} from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function EmployerDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/employer/dashboard")

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh] pt-24">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Use mock data if API fails but doesn't throw an error
  const data = dashboardData || {
    activeJobs: 5,
    activeJobsChange: 20,
    totalApplications: 47,
    applicationsChange: 15,
    newApplications: 12,
    jobViews: 1243,
    viewsChange: 8,
    jobs: [],
    applications: [],
    recentActivity: [
      { type: "application", message: "New application for Senior Frontend Developer", time: "2 hours ago" },
      { type: "view", message: "Your Backend Engineer job has 50 new views", time: "5 hours ago" },
      { type: "application", message: "New application for UX/UI Designer", time: "1 day ago" },
      { type: "status", message: "Interview scheduled with Sarah Johnson", time: "2 days ago" },
    ],
    applicationsByStatus: {
      pending: 25,
      reviewing: 12,
      interview: 8,
      rejected: 2,
      accepted: 0,
    },
    upcomingInterviews: [
      { candidate: "Sarah Johnson", position: "Senior Frontend Developer", date: "Tomorrow, 10:00 AM" },
      { candidate: "Michael Brown", position: "Backend Engineer", date: "May 15, 2:30 PM" },
    ],
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-24">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">Manage your job listings and applications</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Link href="/dashboard/employer/post-job">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Post a New Job
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Dashboard Navigation */}
      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          <Link href="/dashboard/employer">
            <Button variant="link" className="text-primary">
              <Briefcase className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/employer/profile">
            <Button variant="link">
              <User className="h-4 w-4 mr-2" />
              Company Profile
            </Button>
          </Link>
          <Link href="/dashboard/employer/settings">
            <Button variant="link">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <motion.div
          className="mb-8 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="ml-auto">
            Retry
          </Button>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          {
            title: "Active Jobs",
            value: data.activeJobs,
            change: data.activeJobsChange,
            icon: <Briefcase className="h-5 w-5 text-primary" />,
          },
          {
            title: "Total Applications",
            value: data.totalApplications,
            change: data.applicationsChange,
            icon: <Users className="h-5 w-5 text-primary" />,
          },
          {
            title: "New Applications",
            value: data.newApplications,
            subtitle: "In the last 7 days",
            icon: <TrendingUp className="h-5 w-5 text-primary" />,
          },
          {
            title: "Job Views",
            value: data.jobViews,
            change: data.viewsChange,
            icon: <Eye className="h-5 w-5 text-primary" />,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
                {item.change !== undefined ? (
                  <p className="text-xs text-muted-foreground">
                    <span className={item.change > 0 ? "text-green-500" : item.change < 0 ? "text-red-500" : ""}>
                      {item.change > 0 ? "+" : ""}
                      {item.change}%
                    </span>{" "}
                    from last month
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Applications by Status</CardTitle>
              <CardDescription>Overview of all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm font-medium">Pending Review</span>
                    </div>
                    <span className="text-sm font-medium">{data.applicationsByStatus.pending}</span>
                  </div>
                  <Progress
                    value={(data.applicationsByStatus.pending / data.totalApplications) * 100}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm font-medium">In Review</span>
                    </div>
                    <span className="text-sm font-medium">{data.applicationsByStatus.reviewing}</span>
                  </div>
                  <Progress
                    value={(data.applicationsByStatus.reviewing / data.totalApplications) * 100}
                    className="h-2 bg-muted [&>div]:bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm font-medium">Interview</span>
                    </div>
                    <span className="text-sm font-medium">{data.applicationsByStatus.interview}</span>
                  </div>
                  <Progress
                    value={(data.applicationsByStatus.interview / data.totalApplications) * 100}
                    className="h-2 bg-muted [&>div]:bg-yellow-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm font-medium">Rejected</span>
                    </div>
                    <span className="text-sm font-medium">{data.applicationsByStatus.rejected}</span>
                  </div>
                  <Progress
                    value={(data.applicationsByStatus.rejected / data.totalApplications) * 100}
                    className="h-2 bg-muted [&>div]:bg-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">Accepted</span>
                    </div>
                    <span className="text-sm font-medium">{data.applicationsByStatus.accepted}</span>
                  </div>
                  <Progress
                    value={(data.applicationsByStatus.accepted / data.totalApplications) * 100}
                    className="h-2 bg-muted [&>div]:bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="mt-0.5">
                      {activity.type === "application" && <Users className="h-5 w-5 text-primary" />}
                      {activity.type === "view" && <Eye className="h-5 w-5 text-blue-500" />}
                      {activity.type === "status" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Scheduled interviews with candidates</CardDescription>
          </CardHeader>
          <CardContent>
            {data.upcomingInterviews.length > 0 ? (
              <div className="space-y-4">
                {data.upcomingInterviews.map((interview, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{interview.candidate}</p>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-right">
                        <p>{interview.date}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming interviews scheduled</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Schedule Interview
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applications">Recent Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage your active and closed job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployerJobsTable jobs={data.jobs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Review and manage candidate applications</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployerApplicationsTable applications={data.applications} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
