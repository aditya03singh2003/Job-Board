import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total users count
    const totalUsersResult = await sql`SELECT COUNT(*) FROM users`
    const totalUsers = Number.parseInt(totalUsersResult[0].count)

    // Get new users (last 30 days)
    const newUsersResult = await sql`
      SELECT COUNT(*) FROM users 
      WHERE created_at > NOW() - INTERVAL '30 days'
    `
    const newUsers = Number.parseInt(newUsersResult[0].count)

    // Get active jobs count
    const activeJobsResult = await sql`
      SELECT COUNT(*) FROM jobs 
      WHERE is_active = true
    `
    const activeJobs = Number.parseInt(activeJobsResult[0].count)

    // Get new jobs (last 30 days)
    const newJobsResult = await sql`
      SELECT COUNT(*) FROM jobs 
      WHERE created_at > NOW() - INTERVAL '30 days'
    `
    const newJobs = Number.parseInt(newJobsResult[0].count)

    // Get total companies count
    const totalCompaniesResult = await sql`SELECT COUNT(*) FROM companies`
    const totalCompanies = Number.parseInt(totalCompaniesResult[0].count)

    // Get new companies (last 30 days)
    const newCompaniesResult = await sql`
      SELECT COUNT(*) FROM companies 
      WHERE created_at > NOW() - INTERVAL '30 days'
    `
    const newCompanies = Number.parseInt(newCompaniesResult[0].count)

    // Get total applications count
    const totalApplicationsResult = await sql`SELECT COUNT(*) FROM applications`
    const totalApplications = Number.parseInt(totalApplicationsResult[0].count)

    // Get new applications (last 30 days)
    const newApplicationsResult = await sql`
      SELECT COUNT(*) FROM applications 
      WHERE created_at > NOW() - INTERVAL '30 days'
    `
    const newApplications = Number.parseInt(newApplicationsResult[0].count)

    // Get pending jobs count
    const pendingJobsResult = await sql`
      SELECT COUNT(*) FROM jobs 
      WHERE is_approved = false
    `
    const pendingJobs = Number.parseInt(pendingJobsResult[0].count)

    // Get reported content count (placeholder)
    const reportedContent = 0

    // Get users
    const users = await sql`
      SELECT id, name, email, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get jobs
    const jobs = await sql`
      SELECT id, title, company_name, location, type, is_active, is_approved, created_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get companies
    const companies = await sql`
      SELECT c.id, c.name, c.website, u.email, c.created_at
      FROM companies c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      totalUsers,
      newUsers,
      activeJobs,
      newJobs,
      totalCompanies,
      newCompanies,
      totalApplications,
      newApplications,
      pendingJobs,
      reportedContent,
      users,
      jobs,
      companies,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
