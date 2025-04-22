import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get("featured") === "true"
    const query = searchParams.get("query") || ""
    const location = searchParams.get("location") || ""
    const type = searchParams.get("type") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit
    const latest = searchParams.get("latest") === "true"

    // Get current user session
    const session = await getSession()

    let jobsQuery = sql`
      SELECT 
        id, 
        title, 
        company_name as company, 
        company_id as "companyId",
        location, 
        type, 
        salary, 
        description,
        requirements,
        responsibilities,
        tags,
        created_at,
        is_active as "isActive"
      FROM jobs
      WHERE is_active = true
    `

    // Add featured filter if requested
    if (featured) {
      // Since we don't have a is_featured column, we'll just limit to the most recent jobs
      jobsQuery = sql`${jobsQuery} ORDER BY created_at DESC LIMIT 3`
      return NextResponse.json(await jobsQuery)
    }

    // Add latest filter if requested (for real-time updates)
    if (latest) {
      // Get jobs posted in the last 24 hours
      jobsQuery = sql`${jobsQuery} AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 5`
      return NextResponse.json(await jobsQuery)
    }

    // Add search filters if provided
    if (query) {
      jobsQuery = sql`${jobsQuery} AND (
        title ILIKE ${"%" + query + "%"} OR
        company_name ILIKE ${"%" + query + "%"} OR
        description ILIKE ${"%" + query + "%"} OR
        ${"%" + query + "%"} = ANY(tags)
      )`
    }

    if (location && location !== "Anywhere") {
      if (location === "Remote") {
        jobsQuery = sql`${jobsQuery} AND (location = 'Remote' OR location ILIKE '%remote%')`
      } else {
        jobsQuery = sql`${jobsQuery} AND location = ${location}`
      }
    }

    if (type) {
      jobsQuery = sql`${jobsQuery} AND type = ${type}`
    }

    // Add ordering and pagination
    jobsQuery = sql`${jobsQuery} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

    const jobs = await jobsQuery

    // Format the jobs data
    const formattedJobs = jobs.map((job) => ({
      ...job,
      postedAt: formatDate(job.created_at),
      tags: Array.isArray(job.tags) ? job.tags : [],
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    }))

    return NextResponse.json(formattedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }
}
