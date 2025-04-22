"use client"

import { getEmployerDashboardData } from "@/lib/data"
import { EmployerJobsTable } from "@/components/employer-jobs-table"
import { EmployerApplicationsTable } from "@/components/employer-applications-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function EmployerDashboardPage() {
  // Get the current user session
  const session = await getSession()

  // If no session or not an employer, redirect to login
  if (!session || session.role !== "employer") {
    redirect("/auth/login?type=employer")
  }

  const employerId = session.id
  const { jobs, applications, stats } = await getEmployerDashboardData(employerId)

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/dashboard/employer/post-job">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          <EmployerJobsTable jobs={jobs} />
        </TabsContent>
        <TabsContent value="applications">
          <EmployerApplicationsTable applications={applications} employerId={employerId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
