import { NextResponse } from "next/server"

export async function GET() {
  try {
    // For demo purposes, we'll return mock data without requiring authentication
    // In a production app, you would uncomment the authentication check

    /*
    const session = await getSession()

    if (!session || session.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.id

    // Get company ID for the employer
    const companyResult = await sql`
      SELECT id FROM companies WHERE user_id = ${userId}
    `

    if (companyResult.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const companyId = companyResult[0].id
    */

    // Mock data for dashboard
    const activeJobs = 5
    const totalApplications = 47
    const newApplications = 12
    const jobViews = 1243

    // Calculate changes (mock data for now)
    const activeJobsChange = 20
    const applicationsChange = 15
    const viewsChange = 8

    // Mock jobs data
    const jobs = [
      {
        id: "1",
        title: "Senior Frontend Developer",
        location: "Mumbai, India",
        type: "Full-time",
        applications: 18,
        views: 342,
        status: "active",
        postedAt: "2023-04-15",
      },
      {
        id: "2",
        title: "Backend Engineer",
        location: "Remote",
        type: "Full-time",
        applications: 14,
        views: 287,
        status: "active",
        postedAt: "2023-04-10",
      },
      {
        id: "3",
        title: "UX/UI Designer",
        location: "Bangalore, India",
        type: "Full-time",
        applications: 9,
        views: 198,
        status: "active",
        postedAt: "2023-04-12",
      },
    ]

    // Mock applications data
    const applications = [
      {
        id: "1",
        jobId: "1",
        jobTitle: "Senior Frontend Developer",
        applicantName: "John Smith",
        applicantEmail: "john@example.com",
        status: "reviewing",
        appliedAt: "2023-04-16",
      },
      {
        id: "2",
        jobId: "1",
        jobTitle: "Senior Frontend Developer",
        applicantName: "Sarah Johnson",
        applicantEmail: "sarah@example.com",
        status: "interview",
        appliedAt: "2023-04-17",
      },
      {
        id: "3",
        jobId: "2",
        jobTitle: "Backend Engineer",
        applicantName: "Michael Brown",
        applicantEmail: "michael@example.com",
        status: "pending",
        appliedAt: "2023-04-18",
      },
    ]

    // Additional mock data for enhanced dashboard
    const recentActivity = [
      { type: "application", message: "New application for Senior Frontend Developer", time: "2 hours ago" },
      { type: "view", message: "Your Backend Engineer job has 50 new views", time: "5 hours ago" },
      { type: "application", message: "New application for UX/UI Designer", time: "1 day ago" },
      { type: "status", message: "Interview scheduled with Sarah Johnson", time: "2 days ago" },
    ]

    const applicationsByStatus = {
      pending: 25,
      reviewing: 12,
      interview: 8,
      rejected: 2,
      accepted: 0,
    }

    const upcomingInterviews = [
      { candidate: "Sarah Johnson", position: "Senior Frontend Developer", date: "Tomorrow, 10:00 AM" },
      { candidate: "Michael Brown", position: "Backend Engineer", date: "May 15, 2:30 PM" },
    ]

    return NextResponse.json({
      activeJobs,
      activeJobsChange,
      totalApplications,
      applicationsChange,
      newApplications,
      jobViews,
      viewsChange,
      jobs,
      applications,
      recentActivity,
      applicationsByStatus,
      upcomingInterviews,
    })
  } catch (error) {
    console.error("Error fetching employer dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
