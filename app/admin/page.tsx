"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminUsersTable } from "@/components/admin-users-table"
import { AdminJobsTable } from "@/components/admin-jobs-table"
import { AdminCompaniesTable } from "@/components/admin-companies-table"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Briefcase, Building, FileText, AlertTriangle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/dashboard")

      if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err)
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
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard data...</p>
        </div>
      </div>
    )
  }

  // Use mock data if API fails but doesn't throw an error
  const data = dashboardData || {
    totalUsers: 1245,
    newUsers: 87,
    activeJobs: 342,
    newJobs: 56,
    totalCompanies: 128,
    newCompanies: 12,
    totalApplications: 2876,
    newApplications: 198,
    pendingJobs: 15,
    reportedContent: 8,
    users: [],
    jobs: [],
    companies: [],
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, jobs, and platform settings</p>
        </div>
        <Button onClick={fetchDashboardData} disabled={refreshing} className="flex items-center gap-2">
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh Data
        </Button>
      </motion.div>

      {error && (
        <motion.div
          className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          {
            title: "Total Users",
            value: data.totalUsers,
            subtitle: `${data.newUsers} new users this month`,
            icon: <Users className="h-5 w-5 text-primary" />,
          },
          {
            title: "Active Jobs",
            value: data.activeJobs,
            subtitle: `${data.newJobs} new jobs this month`,
            icon: <Briefcase className="h-5 w-5 text-primary" />,
          },
          {
            title: "Companies",
            value: data.totalCompanies,
            subtitle: `${data.newCompanies} new companies this month`,
            icon: <Building className="h-5 w-5 text-primary" />,
          },
          {
            title: "Applications",
            value: data.totalApplications,
            subtitle: `${data.newApplications} new applications this month`,
            icon: <FileText className="h-5 w-5 text-primary" />,
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
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring admin attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Pending Job Approvals</p>
                      <p className="text-sm text-muted-foreground">Jobs waiting for review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                      {data.pendingJobs}
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Reported Content</p>
                      <p className="text-sm text-muted-foreground">Content flagged by users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                      {data.reportedContent}
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
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
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Users className="h-5 w-5 mb-2" />
                  <span>Add User</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Building className="h-5 w-5 mb-2" />
                  <span>Add Company</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Briefcase className="h-5 w-5 mb-2" />
                  <span>Add Job</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <RefreshCw className="h-5 w-5 mb-2" />
                  <span>System Status</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUsersTable users={data.users} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>View and manage job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminJobsTable jobs={data.jobs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Management</CardTitle>
                <CardDescription>View and manage company accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCompaniesTable companies={data.companies} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
