import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getJobSeekerDashboardData } from "@/lib/data"
import { JobSeekerApplicationsTable } from "@/components/jobseeker-applications-table"
import { JobSeekerSavedJobsTable } from "@/components/jobseeker-saved-jobs-table"
import { RealTimeJobFeed } from "@/components/real-time-job-feed"
import { RefreshCw, Briefcase, BookmarkCheck, Eye, Calendar, FileText, Settings, Upload, Bell } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function JobSeekerDashboardPage() {
  const dashboardData = await getJobSeekerDashboardData()

  // Calculate profile completion percentage
  const profileCompletion = 65 // This would be calculated based on actual profile data

  return (
    <div className="container mx-auto py-8 px-4 pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
          <p className="text-muted-foreground">Track your job applications and saved jobs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/profile/edit">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Briefcase className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalApplications}</div>
                <p className="text-xs text-muted-foreground">Total applications submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                <BookmarkCheck className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.savedJobs}</div>
                <p className="text-xs text-muted-foreground">Jobs saved for later</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.profileViews}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.profileViewsChange > 0 ? "+" : ""}
                  {dashboardData.profileViewsChange}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.interviews}</div>
                <p className="text-xs text-muted-foreground">Scheduled interviews</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Overview of your application statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm">Pending Review</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.pendingApplications}</span>
                    </div>
                    <Progress
                      value={(dashboardData.pendingApplications / dashboardData.totalApplications) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">In Review</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.inReviewApplications}</span>
                    </div>
                    <Progress
                      value={(dashboardData.inReviewApplications / dashboardData.totalApplications) * 100}
                      className="h-2 bg-muted [&>div]:bg-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Interview</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.interviewApplications}</span>
                    </div>
                    <Progress
                      value={(dashboardData.interviewApplications / dashboardData.totalApplications) * 100}
                      className="h-2 bg-muted [&>div]:bg-yellow-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Rejected</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.rejectedApplications}</span>
                    </div>
                    <Progress
                      value={(dashboardData.rejectedApplications / dashboardData.totalApplications) * 100}
                      className="h-2 bg-muted [&>div]:bg-red-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Your scheduled interviews</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.interviews > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <p className="font-medium">Senior Frontend Developer</p>
                        <p className="text-sm text-muted-foreground">TechCorp</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="font-medium">Tomorrow</p>
                        <p className="text-muted-foreground">10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Backend Engineer</p>
                        <p className="text-sm text-muted-foreground">DataSystems</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="font-medium">May 15</p>
                        <p className="text-muted-foreground">2:30 PM</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming interviews scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to attract employers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Frontend Developer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      React
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      TypeScript
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile completion</span>
                  <span className="text-sm font-medium">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Resume</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Uploaded
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <span>Skills</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    8 Added
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span>Job Alerts</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Set Up
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Update Resume
                </Button>
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm" className="w-full">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Real-time job feed */}
          <RealTimeJobFeed />
        </div>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Track the status of your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <JobSeekerApplicationsTable applications={dashboardData.applications} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>Jobs you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <JobSeekerSavedJobsTable savedJobs={dashboardData.savedJobsList} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
